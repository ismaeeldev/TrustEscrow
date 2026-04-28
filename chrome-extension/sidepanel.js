/**
 * TrustEscrow Side Panel Logic
 */

const API_BASE = "http://localhost:3000/api/extension";

let currentOrderId = null;
let paymentPromise = null;

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

  // Listen for messages from the checkout iframe
  window.addEventListener('message', (event) => {
    if (event.data.action === "payment_success") {
      if (paymentPromise) paymentPromise.resolve(event.data.payment_method_id);
    } else if (event.data.action === "payment_failed") {
      if (paymentPromise) paymentPromise.reject(new Error(event.data.error));
    }
  });

  await loadProductData();
});

async function loadProductData() {
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
    const displayPrice = (product.price || "").replace(/[^0-9\.]/g, '');
    const priceInput = document.getElementById('product-price-input');
    if (displayPrice && parseFloat(displayPrice) > 0) {
      priceInput.value = displayPrice;
    } else {
      priceInput.value = "";
      priceInput.placeholder = "0.00";
      priceInput.style.borderColor = "#ef4444";
    }
    if (product.image) document.getElementById('product-img').src = product.image;
    
    chrome.storage.local.get(['lastEmail'], (res) => {
      if (res.lastEmail) {
        document.getElementById('buyer-email').value = res.lastEmail;
        document.getElementById('history-email').value = res.lastEmail;
      }
    });
  } else {
    switchView('history-view');
    chrome.storage.local.get(['lastEmail'], (res) => {
      if (res.lastEmail) {
        document.getElementById('history-email').value = res.lastEmail;
        loadHistory();
      }
    });
  }
}

function switchView(viewId) {
  document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  
  document.getElementById(viewId).classList.add('active');
  if (viewId === 'checkout-view') document.getElementById('nav-checkout').classList.add('active');
  if (viewId === 'history-view') document.getElementById('nav-history').classList.add('active');
}

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
  const iframe = document.getElementById('checkout-iframe');

  if (!email) {
    alert("Please enter your email");
    return;
  }

  document.getElementById('hold-button').disabled = true;
  document.getElementById('loading-overlay').style.display = 'flex';
  document.getElementById('loading-text').textContent = "Verifying with Bank...";

  try {
    // 1. Tell iframe to submit payment
    iframe.contentWindow.postMessage({ action: "submit_payment", email }, "http://localhost:3000");

    // 2. Wait for response from iframe
    const paymentMethodId = await new Promise((resolve, reject) => {
      paymentPromise = { resolve, reject };
      // Timeout after 30 seconds
      setTimeout(() => reject(new Error("Payment timeout")), 30000);
    });

    document.getElementById('loading-text').textContent = "Securing Funds...";

    // 3. Validate product
    if (!product || !product.url) {
      throw new Error("Product data missing. Refresh the store page.");
    }

    const manualPrice = document.getElementById('product-price-input').value;
    const amountStr = (manualPrice || "0").replace(/[^0-9\.]/g, '');
    let amountCents = Math.round(parseFloat(amountStr) * 100);

    if (isNaN(amountCents) || amountCents <= 0) {
      throw new Error("Please enter a valid price.");
    }

    // 4. Send to backend
    const payload = {
      buyer_email: email,
      amount: amountCents,
      store_url: product.url,
      product_name: product.title || "Any Store Product",
      payment_method_id: paymentMethodId
    };

    const response = await fetch(`${API_BASE}/proxy-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);

    currentOrderId = data.order_id;
    chrome.storage.local.set({ lastEmail: email });
    showSuccess(data);
  } catch (error) {
    alert(`Payment Error: ${error.message}`);
    document.getElementById('hold-button').disabled = false;
    document.getElementById('loading-overlay').style.display = 'none';
  } finally {
    paymentPromise = null;
  }
});

function showSuccess(data) {
  document.getElementById('loading-overlay').style.display = 'none';
  switchView('success-view');
  if (data.virtual_card) {
    document.getElementById('card-number').textContent = data.virtual_card.number;
    document.getElementById('card-expiry').textContent = data.virtual_card.expiry;
    document.getElementById('card-cvv').textContent = data.virtual_card.cvv;
  }
}

async function loadHistory(filter = 'ALL') {
  const email = document.getElementById('history-email').value || document.getElementById('buyer-email').value;
  if (!email) {
    document.getElementById('orders-list').innerHTML = '<p style="text-align: center; opacity: 0.5; margin-top: 40px;">Enter your email to sync history.</p>';
    return;
  }

  const list = document.getElementById('orders-list');
  list.innerHTML = '<p style="text-align: center; opacity: 0.5;">Updating Dashboard...</p>';

  try {
    const response = await fetch(`${API_BASE}/my-orders?email=${email}`);
    const data = await response.json();
    
    if (data.orders && data.orders.length > 0) {
      const filteredOrders = filter === 'ALL' ? data.orders : data.orders.filter(o => o.status === filter);
      if (filteredOrders.length === 0) {
        list.innerHTML = `<p style="text-align: center; opacity: 0.5; margin-top: 40px;">No ${filter.toLowerCase()} orders.</p>`;
        return;
      }

      list.innerHTML = '';
      filteredOrders.forEach(order => {
        const item = document.createElement('div');
        item.className = 'order-item';
        const isReleased = order.status === 'RELEASED';
        const hostname = new URL(order.storeUrl || 'https://example.com').hostname;
        
        item.innerHTML = `
          <div class="order-header">
            <div style="font-weight: 800; font-size: 1.1rem; color: var(--primary);">$${(order.amount/100).toFixed(2)}</div>
            <div class="status-badge ${isReleased ? 'status-released' : 'status-held'}">${order.status === 'RELEASED' ? 'Released' : 'In Escrow'}</div>
          </div>
          <div style="font-size: 0.9rem; font-weight: 700; margin-bottom: 6px; color: white;">${order.productName || 'Order'}</div>
          <div style="font-size: 0.75rem; margin-bottom: 16px; color: var(--text-muted);">
            <span style="opacity: 0.5;">Store:</span> ${hostname}
          </div>
          ${!isReleased ? `<button class="action-button release-btn" data-id="${order.id}">Confirm Delivery</button>` : ''}
        `;
        list.appendChild(item);
      });

      document.querySelectorAll('.release-btn').forEach(btn => {
        btn.addEventListener('click', (e) => releaseFunds(e.target.dataset.id));
      });
    } else {
      list.innerHTML = '<p style="text-align: center; opacity: 0.5; margin-top: 40px;">No active orders found.</p>';
    }
  } catch (error) {
    list.innerHTML = '<p style="color: #ef4444; text-align: center;">Sync failed.</p>';
  }
}

async function releaseFunds(orderId) {
  document.getElementById('loading-overlay').style.display = 'flex';
  document.getElementById('loading-text').textContent = "Releasing Funds...";
  try {
    const response = await fetch(`${API_BASE}/verify-delivery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId, proof_url: "Released via dashboard" })
    });
    const data = await response.json();
    alert(data.message || "Funds Released!");
    chrome.storage.local.remove(["pendingProduct"]);
    await loadHistory();
  } catch (error) {
    alert("Release failed.");
  } finally {
    document.getElementById('loading-overlay').style.display = 'none';
  }
}

document.getElementById('verify-btn').addEventListener('click', () => {
  if (currentOrderId) releaseFunds(currentOrderId);
});
