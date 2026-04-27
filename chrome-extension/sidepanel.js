/**
 * TrustEscrow Side Panel Logic
 */

const API_BASE = "http://localhost:3000/api/extension";

let currentOrderId = null;

// 1. Initialize View
document.addEventListener('DOMContentLoaded', async () => {
  console.log("🛡️ TrustEscrow Overlay: Initializing...");
  
  // Close Button
  document.getElementById('close-btn').addEventListener('click', () => {
    window.parent.postMessage({ action: "close_trust_escrow" }, "*");
  });

  // Tab Switching
  document.getElementById('nav-checkout').addEventListener('click', () => switchView('checkout-view'));
  document.getElementById('nav-history').addEventListener('click', () => {
    switchView('history-view');
    loadHistory();
  });

  document.getElementById('refresh-history').addEventListener('click', () => loadHistory());

  // Filter Switching
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      loadHistory(e.target.dataset.filter);
    });
  });

  // Load product if on checkout
  // ... (rest of init)
  let product = null;
  let retries = 0;
  while (!product && retries < 10) {
    product = await getPendingProduct();
    if (!product) {
      await new Promise(r => setTimeout(r, 300));
      retries++;
    }
  }

  if (product) {
    document.getElementById('product-name').textContent = product.title || "Unknown Product";
    document.getElementById('product-price').textContent = product.price || "$0.00";
    if (product.image) document.getElementById('product-img').src = product.image;
    
    // Auto-fill emails if we have them in storage
    chrome.storage.local.get(['lastEmail'], (res) => {
      if (res.lastEmail) {
        document.getElementById('buyer-email').value = res.lastEmail;
        document.getElementById('history-email').value = res.lastEmail;
      }
    });
  } else {
    // If no product is pending (opened via icon click), go straight to history
    console.log("🛡️ TrustEscrow Overlay: No product pending, switching to History view.");
    switchView('history-view');
    
    chrome.storage.local.get(['lastEmail'], (res) => {
      if (res.lastEmail) {
        document.getElementById('history-email').value = res.lastEmail;
        loadHistory();
      }
    });
  }
});

function switchView(viewId) {
  document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  
  document.getElementById(viewId).classList.add('active');
  if (viewId === 'checkout-view') document.getElementById('nav-checkout').classList.add('active');
  if (viewId === 'history-view') document.getElementById('nav-history').classList.add('active');
}

/**
 * Fetch product info from local storage
 */
async function getPendingProduct() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["pendingProduct"], (result) => {
      resolve(result.pendingProduct);
    });
  });
}

/**
 * Handle "Confirm & Hold"
 */
document.getElementById('hold-button').addEventListener('click', async () => {
  const email = document.getElementById('buyer-email').value;
  const product = await getPendingProduct();

  if (!email) {
    alert("Please enter your email");
    return;
  }

  // Save email for next time
  chrome.storage.local.set({ lastEmail: email });

  document.getElementById('hold-button').disabled = true;
  document.getElementById('loading').style.display = 'block';

  try {
    const amountStr = (product.price || "0").replace(/[^0-9\.]/g, '');
    const amountCents = Math.round(parseFloat(amountStr) * 100);

    const response = await fetch(`${API_BASE}/proxy-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        buyer_email: email,
        amount: amountCents,
        store_url: product.url,
        product_name: product.title
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);

    currentOrderId = data.order_id;
    showSuccess(data);
  } catch (error) {
    alert(`Error: ${error.message}`);
    document.getElementById('hold-button').disabled = false;
    document.getElementById('loading').style.display = 'none';
  }
});

function showSuccess(data) {
  switchView('success-view');
  document.getElementById('held-amount').textContent = document.getElementById('product-price').textContent;
  if (data.virtual_card) {
    document.getElementById('card-number').textContent = data.virtual_card.number;
    document.getElementById('card-expiry').textContent = data.virtual_card.expiry;
    document.getElementById('card-cvv').textContent = data.virtual_card.cvv;
  }
}

/**
 * Load History
 */
async function loadHistory(filter = 'ALL') {
  const email = document.getElementById('history-email').value || document.getElementById('buyer-email').value;
  if (!email) {
    document.getElementById('orders-list').innerHTML = '<p style="text-align: center; opacity: 0.5; margin-top: 40px;">Please enter your email in the "Connected Email" box to see your orders.</p>';
    return;
  }

  // Update storage if email was typed manually
  chrome.storage.local.set({ lastEmail: email });

  const list = document.getElementById('orders-list');
  list.innerHTML = '<p style="text-align: center; opacity: 0.5;">Updating Dashboard...</p>';

  try {
    const response = await fetch(`${API_BASE}/my-orders?email=${email}`);
    const data = await response.json();
    
    if (data.orders && data.orders.length > 0) {
      // Filter the data locally for instant responsiveness
      const filteredOrders = filter === 'ALL' 
        ? data.orders 
        : data.orders.filter(o => o.status === filter);

      if (filteredOrders.length === 0) {
        list.innerHTML = `<p style="text-align: center; opacity: 0.5; margin-top: 40px;">No ${filter.toLowerCase()} orders found.</p>`;
        return;
      }

      list.innerHTML = '';
      filteredOrders.forEach(order => {
        const item = document.createElement('div');
        item.className = 'order-item';
        const isReleased = order.status === 'RELEASED';
        
        item.innerHTML = `
          <div class="order-header">
            <div style="font-weight: bold;">$${(order.amount/100).toFixed(2)}</div>
            <div class="order-status ${isReleased ? 'released' : ''}">${order.status}</div>
          </div>
          <div style="font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">${order.productName || 'Order'}</div>
          <div style="font-size: 0.75rem; margin-bottom: 12px; opacity: 0.6;">
            Store: ${new URL(order.storeUrl || 'https://amazon.com').hostname}
          </div>
          ${!isReleased ? `<button class="pay-button release-btn" data-id="${order.id}" style="padding: 10px; font-size: 0.85rem; background: var(--primary);">Confirm Delivery & Release Funds</button>` : ''}
        `;
        list.appendChild(item);
      });

      // Add listeners to release buttons
      document.querySelectorAll('.release-btn').forEach(btn => {
        btn.addEventListener('click', (e) => releaseFunds(e.target.dataset.id));
      });
    } else {
      list.innerHTML = '<p style="text-align: center; opacity: 0.5; margin-top: 40px;">No active orders found for this email.</p>';
    }
  } catch (error) {
    list.innerHTML = '<p style="color: #ef4444; text-align: center;">Error updating dashboard.</p>';
  }
}

async function releaseFunds(orderId) {
  try {
    const response = await fetch(`${API_BASE}/verify-delivery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: orderId,
        proof_url: "Released via extension history"
      })
    });
    const data = await response.json();
    alert(data.message || "Funds Released Successfully!");
    
    // 1. Clear the current checkout data so it doesn't show up again
    chrome.storage.local.remove(["pendingProduct"]);
    
    // 2. Refresh history and switch to it
    await loadHistory();
    switchView('history-view');
    
    // 3. Tell parent to close overlay if it's the iframe (optional, but good UX)
    // window.parent.postMessage({ action: "close_trust_escrow" }, "*");
    
  } catch (error) {
    alert("Failed to release funds.");
  }
}

// Global Release for current view
document.getElementById('verify-btn').addEventListener('click', () => {
  if (currentOrderId) releaseFunds(currentOrderId);
});
