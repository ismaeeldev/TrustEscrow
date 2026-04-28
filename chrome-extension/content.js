/**
 * TrustEscrow Content Script
 * Wrapped in IIFE to prevent global namespace collisions and errors.
 */
(function() {
  if (window.trustEscrowLoaded) return;
  window.trustEscrowLoaded = true;

  console.log("🛡️ TrustEscrow Anywhere Active");

  // 1. Configuration & Regex
  const PRICE_REGEX = /(\$|USD|£|€|¥|₹)\s?(\d+([\.,]\d{2,3})*([\.,]\d{2})?)/g;
  let detectorInterval = null;

  /**
   * Scans the page for prices and product information.
   */
  function scanForProducts() {
    const hasPrice = document.body.innerText.match(PRICE_REGEX);
    const hasSchema = !!document.querySelector('script[type="application/ld+json"]');
    const hasProductMeta = !!document.querySelector('meta[property="og:type"][content="product"]');
    
    if (hasPrice || hasSchema || hasProductMeta) {
      injectEscrowButton();
    }
  }

  /**
   * Injects the TrustEscrow button next to common checkout/buy buttons.
   */
  function injectEscrowButton(manualTargets = null) {
    const buyButtonSelectors = [
      'button[name="add"]',
      'button[id*="checkout"]',
      'button[id*="add-to-cart"]',
      'button[class*="buy-now"]',
      'button[class*="add-to-cart"]',
      'button[class*="AddToCart"]',
      'input[type="submit"][value*="Add to Cart"]',
      'input[type="button"][value*="Add to Cart"]',
      'a[href*="checkout"]',
      '.product-form__submit',
      '.single_add_to_cart_button',
      'button.add-to-cart',
      '#add-to-cart-button',
      '#buy-now-button',
      '.checkout-button',
      '.add_to_cart_button',
      '[aria-label*="Add to cart" i]',
      '[aria-label*="Buy now" i]',
      '[title*="Add to cart" i]',
      '.sqs-add-to-cart-button', // Squarespace
      '.wix-add-to-cart', // Wix
      '.vtex-add-to-cart-button', // VTEX
      '.btn-add-to-cart', // General
      '.Button-AddToCart' // General
    ];

    let targetButtons = manualTargets || [];

    if (!manualTargets) {
      function findButtonsRecursive(root) {
        buyButtonSelectors.forEach(selector => {
          try {
            const elements = root.querySelectorAll(selector);
            targetButtons = [...targetButtons, ...Array.from(elements)];
          } catch (e) {}
        });

        const forms = root.querySelectorAll('form');
        forms.forEach(form => {
          const action = (form.action || "").toLowerCase();
          if (action.includes('/cart/add') || action.includes('/checkout')) {
            const formButtons = form.querySelectorAll('button, input[type="submit"]');
            targetButtons = [...targetButtons, ...Array.from(formButtons)];
          }
        });

        const allElements = root.querySelectorAll('*');
        allElements.forEach(el => {
          if (el.shadowRoot) {
            findButtonsRecursive(el.shadowRoot);
          }
        });
      }

      findButtonsRecursive(document);

      const actionTexts = ['add to cart', 'buy now', 'checkout', 'add to bag', 'purchase', 'proceed to checkout'];
      const allButtons = document.querySelectorAll('button, a, input[type="submit"], input[type="button"]');
      
      allButtons.forEach(btn => {
        const text = (btn.innerText || btn.value || "").toLowerCase().trim();
        if (actionTexts.some(t => text.includes(t)) && !targetButtons.includes(btn)) {
          targetButtons.push(btn);
        }
      });
    }

    targetButtons.forEach(btn => {
      const style = window.getComputedStyle(btn);
      if (style.display === 'none' || style.visibility === 'hidden' || btn.offsetWidth === 0) return;
      if (btn.hasAttribute('data-trust-escrow-injected')) return;
      
      const parent = btn.parentElement;
      if (!parent) return;
      
      // Prevent double injection
      if (parent.querySelector('.trust-escrow-btn')) return;

      console.log("🛡️ TrustEscrow: Injecting next to", btn);

      const escrowBtn = document.createElement('button');
      escrowBtn.className = 'trust-escrow-btn';
      escrowBtn.textContent = '🛡️ Secure with TrustEscrow';
      btn.setAttribute('data-trust-escrow-injected', 'true');

      // Super robust styling
      Object.assign(escrowBtn.style, {
        backgroundColor: '#059669',
        color: 'white',
        border: '2px solid #047857',
        padding: '12px 20px',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
        margin: '10px 0',
        width: '100%',
        display: 'block',
        textAlign: 'center',
        fontSize: '15px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: '9999',
        position: 'relative',
        height: 'auto',
        lineHeight: '1.4',
        fontFamily: 'inherit'
      });

      escrowBtn.addEventListener('click', (e) => {
        console.log("🛡️ TrustEscrow: Button clicked!");
        e.preventDefault();
        e.stopPropagation();
        
        escrowBtn.textContent = '⌛ Opening...';
        
        const productInfo = detectComprehensiveProductInfo(btn);

        console.log("🛡️ TrustEscrow: Product Info detected:", productInfo);

        // Save data for the overlay to consume (use local for best compatibility)
        chrome.storage.local.set({ pendingProduct: productInfo }).then(() => {
          console.log("🛡️ TrustEscrow: Data saved to local storage");
          toggleCheckoutOverlay();
        }).catch(err => {
          console.error("🛡️ TrustEscrow: Storage error", err);
          toggleCheckoutOverlay(); // Open anyway
        });
      });

      // Injection Strategy: Insert AFTER the button's container
      const targetLocation = (btn.id === 'add-to-cart-button' && btn.closest('.a-button-stack')) 
        ? btn.closest('.a-button-stack') 
        : btn;

      if (targetLocation.parentNode) {
        targetLocation.parentNode.insertBefore(escrowBtn, targetLocation.nextSibling);
      }
    });
  }

  /**
   * Toggles a sliding iframe overlay for the checkout experience.
   */
  function toggleCheckoutOverlay() {
    console.log("🛡️ TrustEscrow: Toggling Overlay...");
    let iframe = document.getElementById('trust-escrow-checkout-frame');
    
    if (iframe) {
      const isHidden = iframe.style.display === 'none';
      iframe.style.display = isHidden ? 'block' : 'none';
      // Reset button text
      const mainBtn = document.querySelector('.trust-escrow-btn');
      if (mainBtn && isHidden) mainBtn.textContent = '🛡️ Secure with TrustEscrow';
      return;
    }

    // Create Backdrop
    const backdrop = document.createElement('div');
    backdrop.id = 'trust-escrow-backdrop';
    Object.assign(backdrop.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: '2147483646',
      display: 'block'
    });
    backdrop.addEventListener('click', () => {
      iframe.style.display = 'none';
      backdrop.style.display = 'none';
    });
    document.body.appendChild(backdrop);

    iframe = document.createElement('iframe');
    iframe.id = 'trust-escrow-checkout-frame';
    iframe.src = chrome.runtime.getURL('sidepanel.html');
    
    Object.assign(iframe.style, {
      position: 'fixed',
      top: '0',
      right: '0',
      width: '450px',
      maxWidth: '90vw',
      height: '100vh',
      border: 'none',
      zIndex: '2147483647',
      boxShadow: '-10px 0 50px rgba(0,0,0,0.5)',
      backgroundColor: '#0f172a',
      display: 'block'
    });

    document.body.appendChild(iframe);

    // Listen for close message from the iframe
    window.addEventListener('message', (event) => {
      if (event.data.action === "close_trust_escrow") {
        iframe.style.display = 'none';
        backdrop.style.display = 'none';
        const mainBtn = document.querySelector('.trust-escrow-btn');
        if (mainBtn) mainBtn.textContent = '🛡️ Secure with TrustEscrow';
      }
    });

    console.log("🛡️ TrustEscrow: Checkout Overlay Injected into DOM");
  }

  /**
   * Comprehensive product detection logic.
   */
  function detectComprehensiveProductInfo(anchorBtn) {
    let info = {
      title: document.title,
      price: "$0.00",
      url: window.location.href,
      image: ""
    };

    // 1. Try JSON-LD (Schema.org)
    try {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      for (const script of scripts) {
        const data = JSON.parse(script.innerText);
        const product = findProductInJsonLd(data);
        if (product) {
          if (product.name) info.title = product.name;
          if (product.image) info.image = Array.isArray(product.image) ? product.image[0] : product.image;
          if (product.offers) {
            const offer = Array.isArray(product.offers) ? product.offers[0] : product.offers;
            if (offer.price) info.price = `${offer.priceCurrency === 'USD' ? '$' : (offer.priceCurrency || '')}${offer.price}`;
          }
          if (info.price !== "$0.00") break;
        }
      }
    } catch (e) {}

    // 2. Try OpenGraph
    if (info.price === "$0.00" || !info.image) {
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogImg = document.querySelector('meta[property="og:image"]');
      const ogPrice = document.querySelector('meta[property="product:price:amount"]') || 
                      document.querySelector('meta[property="og:price:amount"]') ||
                      document.querySelector('meta[name="twitter:data1"]'); // Common for prices
      const ogCurrency = document.querySelector('meta[property="product:price:currency"]') ||
                         document.querySelector('meta[property="og:price:currency"]');

      if (ogTitle) info.title = ogTitle.content;
      if (ogImg) info.image = ogImg.content;
      if (ogPrice) {
        const amount = ogPrice.content || ogPrice.value;
        if (amount && !isNaN(parseFloat(amount.replace(/[^0-9\.]/g, '')))) {
          const symbol = ogCurrency ? (ogCurrency.content === 'USD' ? '$' : ogCurrency.content) : '$';
          info.price = `${symbol}${amount}`;
        }
      }
    }

    // 3. Fallback to Heuristics
    if (info.price === "$0.00") info.price = detectPriceNearElement(anchorBtn);
    if (!info.image) info.image = detectProductImage();

    return info;
  }

  function findProductInJsonLd(obj) {
    if (obj['@type'] === 'Product') return obj;
    if (obj['@graph'] && Array.isArray(obj['@graph'])) {
      return obj['@graph'].find(item => item['@type'] === 'Product');
    }
    return null;
  }

  /**
   * Specifically detects the price on the page, with heavy bias for Amazon.
   */
  function detectPriceNearElement(el) {
    // Check common price containers first
    const commonSelectors = [
      '[itemprop="price"]',
      '.price',
      '#price',
      '.amount',
      '.product-price',
      '.current-price',
      '.price-current',
      '.special-price',
      '.price-wrapper',
      '[class*="price"]',
      '[id*="price"]'
    ];

    for (const selector of commonSelectors) {
      try {
        const elements = document.querySelectorAll(selector);
        for (const found of elements) {
          const text = found.innerText.trim();
          if (text.match(PRICE_REGEX)) return text;
          // If no symbol but looks like a number and in a "price" element
          const numMatch = text.match(/\d+[\.,]\d{2}/);
          if (numMatch) return `$${numMatch[0]}`; 
        }
      } catch (e) {}
    }

    // 1. Check Amazon specific price elements
    const amazonPrice = document.querySelector('.a-price .a-offscreen') || 
                        document.querySelector('#priceblock_ourprice') || 
                        document.querySelector('#priceblock_dealprice') ||
                        document.querySelector('.priceToPay');
    
    if (amazonPrice) {
      const priceText = amazonPrice.innerText || amazonPrice.textContent;
      if (priceText) return priceText.trim();
    }

    // 2. Look for price patterns near the button
    let current = el;
    for (let i = 0; i < 5; i++) { // Search up to 5 parents
      if (!current) break;
      const text = current.innerText || "";
      const match = text.match(PRICE_REGEX);
      if (match) return match[0];
      current = current.parentElement;
    }

    // 3. Last resort: scan whole page for most prominent price
    const allMatches = document.body.innerText.match(PRICE_REGEX);
    return allMatches ? allMatches[0] : "$0.00";
  }

  /**
   * Detects the main product image.
   */
  function detectProductImage() {
    // 1. Amazon Main Image
    const amazonImg = document.getElementById('landingImage') || 
                      document.getElementById('main-image') ||
                      document.querySelector('.a-dynamic-image');
    if (amazonImg) return amazonImg.src;

    // 2. OpenGraph Image
    const ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg && ogImg.content) return ogImg.content;

    // 3. Shopify / Generic product image
    const productImg = document.querySelector('.product-main-image img') || 
                       document.querySelector('.product__photo img') ||
                       document.querySelector('img[class*="product"]');
    
    if (productImg) return productImg.src;

    // 4. First large image in main content
    const mainImgs = Array.from(document.querySelectorAll('main img, #content img'));
    const largeImg = mainImgs.find(img => img.offsetWidth > 200);
    
    return largeImg ? largeImg.src : "";
  }

  function createStatusBadge() {
    if (document.getElementById('trust-escrow-status-badge')) return;
    
    const badge = document.createElement('div');
    badge.id = 'trust-escrow-status-badge';
    
    const textSpan = document.createElement('span');
    textSpan.textContent = '🛡️ TrustEscrow Active ';
    
    const fixLink = document.createElement('span');
    fixLink.id = 'force-inject-link';
    fixLink.textContent = '[Manual Sync]';
    Object.assign(fixLink.style, {
      marginLeft: '10px',
      textDecoration: 'underline',
      cursor: 'pointer',
      color: '#fff',
      fontSize: '11px',
      opacity: '0.9',
      padding: '2px 6px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '4px'
    });

    badge.appendChild(textSpan);
    badge.appendChild(fixLink);
    
    Object.assign(badge.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#059669',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      zIndex: '2147483647',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      fontFamily: 'sans-serif',
      display: 'flex',
      alignItems: 'center',
      cursor: 'default'
    });

    document.body.appendChild(badge);

    fixLink.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      injectEscrowButton();
      const amazonBtn = document.getElementById('add-to-cart-button') || document.getElementById('buy-now-button');
      if (amazonBtn) injectEscrowButton([amazonBtn]);
    });
  }

  // Initial Scan
  detectorInterval = setInterval(scanForProducts, 3000);
  scanForProducts();
  createStatusBadge();

  // Mutation Observer
  const observer = new MutationObserver(() => {
    clearTimeout(window.trustEscrowScanTimeout);
    window.trustEscrowScanTimeout = setTimeout(scanForProducts, 500);
  });
  observer.observe(document.body, { childList: true, subtree: true });

})();
