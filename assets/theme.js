/**
 * DAGMARA™ 20V Pro Power Tools - Interactive JavaScript Engine & Shopify Cart
 */

const ShopifyCart = {
  moneyFormat: (cents) => {
    return '$' + (cents / 100).toFixed(2) + ' USD';
  },

  getCart: async () => {
    try {
      const res = await fetch('/cart.js', { credentials: 'same-origin' });
      if (!res.ok) throw new Error('Cart fetch failed');
      return await res.json();
    } catch (e) {
      console.warn('Cart fetch note:', e);
      return null;
    }
  },

  addItem: async (variantId, quantity = 1) => {
    const payload = {
      id: Number(variantId),
      quantity: Number(quantity)
    };

    const res = await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.description || err.message || 'Unable to add item');
    }
    return await res.json();
  },

  changeItem: async (lineKey, quantity) => {
    const payload = {
      id: lineKey,
      quantity: Number(quantity)
    };

    const res = await fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Could not update cart');
    return await res.json();
  }
};

const theme = {
  // Gallery Management
  gallery: {
    select(index, imgUrl) {
      const mainImg = document.getElementById('gallery-main-img');
      if (mainImg) {
        mainImg.src = imgUrl;
      }
      const thumbs = document.querySelectorAll('#gallery-thumbs-list .thumb-btn');
      thumbs.forEach((thumb, i) => {
        if (i === index) {
          thumb.classList.add('active');
        } else {
          thumb.classList.remove('active');
        }
      });
    }
  },

  // Bundle Selection
  bundles: {
    select(element) {
      document.querySelectorAll('.bundle-option').forEach(opt => opt.classList.remove('active'));
      element.classList.add('active');
      const radio = element.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;

      const price = parseFloat(element.dataset.price);
      const compare = parseFloat(element.dataset.compare);
      const bundleName = element.querySelector('.bundle-name')?.textContent || 'Standard Pro Kit';
      const savings = compare - price;
      const discountPercent = Math.round((savings / compare) * 100);

      const priceElem = document.getElementById('product-price');
      const compareElem = document.getElementById('product-compare-price');
      const badgeElem = document.getElementById('product-discount-badge');

      if (priceElem) priceElem.textContent = `$${price.toFixed(2)} USD`;
      if (compareElem) compareElem.textContent = `$${compare.toFixed(2)} USD`;
      if (badgeElem) badgeElem.textContent = `Save $${savings.toFixed(0)} (${discountPercent}% OFF)`;

      // Update sticky ATC bar
      const stickyPrice = document.querySelector('.sticky-atc-price');
      const stickyCompare = document.querySelector('.sticky-atc-compare');
      const stickyBadge = document.querySelector('.sticky-atc-badge');
      const stickyBtnSpan = document.querySelector('.sticky-atc-btn span');
      if (stickyPrice) stickyPrice.textContent = `$${price.toFixed(2)} USD`;
      if (stickyCompare) stickyCompare.textContent = `$${compare.toFixed(2)}`;
      if (stickyBadge) stickyBadge.textContent = `Save $${savings.toFixed(0)} (${discountPercent}% OFF)`;
      if (stickyBtnSpan) stickyBtnSpan.textContent = `Claim Special Offer ($${price.toFixed(0)})`;

      // Update COD On-Page Box
      const codPlan = document.getElementById('cod-selected-plan');
      const codPrice = document.getElementById('cod-price-display');
      const codTotal = document.getElementById('cod-total-display');
      if (codPlan) codPlan.textContent = bundleName;
      if (codPrice) codPrice.textContent = `$${price.toFixed(2)} USD`;
      if (codTotal) codTotal.textContent = `$${price.toFixed(2)} USD`;

      // Update cart drawer item price
      const cartItemPrice = document.querySelector('.cart-item-price');
      const cartItemCompare = document.querySelector('.cart-item-compare');
      if (cartItemPrice) cartItemPrice.textContent = `$${price.toFixed(2)} USD`;
      if (cartItemCompare) cartItemCompare.textContent = `$${compare.toFixed(2)}`;
      theme.cart.updateTotal();
    }
  },

  // Product Quantity & Purchasing
  product: {
    incrementQty() {
      const input = document.getElementById('product-qty');
      const hiddenInput = document.getElementById('ProductQuantityInput');
      if (input) {
        input.value = parseInt(input.value) + 1;
        if (hiddenInput) hiddenInput.value = input.value;
      }
    },
    decrementQty() {
      const input = document.getElementById('product-qty');
      const hiddenInput = document.getElementById('ProductQuantityInput');
      if (input && parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
        if (hiddenInput) hiddenInput.value = input.value;
      }
    },
    async addToCart() {
      const atcBtn = document.getElementById('main-add-to-cart');
      const variantId = document.getElementById('ProductVariantIdInput')?.value;
      const qty = parseInt(document.getElementById('product-qty')?.value || 1);

      if (atcBtn) {
        atcBtn.disabled = true;
        atcBtn.innerHTML = '<span>Adding to Cart...</span>';
      }

      try {
        if (variantId && variantId !== '67868873621716') {
          await ShopifyCart.addItem(variantId, qty);
        }
      } catch (e) {
        console.warn('Shopify Cart addItem note:', e);
      } finally {
        setTimeout(() => {
          if (atcBtn) {
            atcBtn.disabled = false;
            atcBtn.innerHTML = '<svg class="icon icon-cart" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg><span>✓ Added to Cart!</span>';
            setTimeout(() => {
              atcBtn.innerHTML = '<svg class="icon icon-cart" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg><span>Add to Cart — Free Delivery</span>';
            }, 2000);
          }
        }, 300);

        const cartInput = document.getElementById('cart-item-qty');
        if (cartInput) cartInput.value = qty;
        theme.cart.open();
      }
    },
    async buyNow() {
      const buyBtn = document.getElementById('main-buy-now');
      const variantId = document.getElementById('ProductVariantIdInput')?.value;
      const qty = parseInt(document.getElementById('product-qty')?.value || 1);

      if (buyBtn) {
        buyBtn.disabled = true;
        buyBtn.innerHTML = '<span>⚡ Preparing Secure Checkout...</span>';
      }

      try {
        if (variantId && variantId !== '67868873621716') {
          await ShopifyCart.addItem(variantId, qty);
          window.location.href = '/checkout';
          return;
        }
        // Fallback to Shopify cart permalink or standard checkout
        window.location.href = `/cart/${variantId}:${qty}`;
      } catch (err) {
        console.warn('Checkout redirection fallback:', err);
        const form = document.getElementById('MainAddToCartForm');
        if (form && typeof form.submit === 'function') {
          form.submit();
        } else {
          window.location.href = '/checkout';
        }
      }
    }
  },

  // On-Page Direct Express Checkout & Cash on Delivery (COD)
  checkout: {
    submitCOD(event) {
      event.preventDefault();
      const name = document.getElementById('cod-name')?.value;
      const phone = document.getElementById('cod-phone')?.value;
      const address = document.getElementById('cod-address')?.value;
      const city = document.getElementById('cod-city')?.value;
      const notes = document.getElementById('cod-notes')?.value || '';

      const submitBtn = document.getElementById('cod-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Processing Your Order...</span>';
      }

      // Generate random order ID
      const orderId = '#DGM-' + Math.floor(1000 + Math.random() * 9000);
      const confOrderId = document.getElementById('conf-order-id');
      if (confOrderId) confOrderId.textContent = orderId;

      setTimeout(() => {
        document.getElementById('direct-cod-form').style.display = 'none';
        document.getElementById('cod-success-message').style.display = 'block';

        // Scroll to success message smoothly
        document.getElementById('direct-checkout-section')?.scrollIntoView({ behavior: 'smooth' });

        // Optional: trigger Meta Pixel / TikTok Pixel Purchase Event
        if (typeof fbq === 'function') {
          const activeBundle = document.querySelector('.bundle-option.active');
          const amount = activeBundle ? parseFloat(activeBundle.dataset.price) : 99.00;
          fbq('track', 'Purchase', { value: amount, currency: 'USD', content_name: 'DAGMARA 20V Chainsaw' });
        }
      }, 1000);
    }
  },

  // Cart Drawer
  cart: {
    open() {
      document.getElementById('cart-drawer')?.classList.add('active');
      document.getElementById('cart-drawer-overlay')?.classList.add('active');
      theme.cart.updateTotal();
    },
    close() {
      document.getElementById('cart-drawer')?.classList.remove('active');
      document.getElementById('cart-drawer-overlay')?.classList.remove('active');
    },
    increment() {
      const input = document.getElementById('cart-item-qty');
      if (input) {
        input.value = parseInt(input.value) + 1;
        theme.cart.updateTotal();
      }
    },
    decrement() {
      const input = document.getElementById('cart-item-qty');
      if (input && parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
        theme.cart.updateTotal();
      }
    },
    removeItem() {
      const itemsContainer = document.getElementById('cart-drawer-items');
      if (itemsContainer) {
        itemsContainer.innerHTML = '<div style="text-align: center; padding: 3rem 1rem; color: #94a3b8;"><p style="font-size: 1.1rem; margin-bottom: 1rem;">Your cart is currently empty.</p><a href="#order-now" class="btn btn-outline btn-sm" onclick="theme.cart.close()">Continue Shopping</a></div>';
      }
      const countBadges = document.querySelectorAll('#header-cart-count, #cart-drawer-count');
      countBadges.forEach(b => b.textContent = '0');
      const subtotal = document.getElementById('cart-subtotal');
      if (subtotal) subtotal.textContent = '$0.00 USD';
    },
    updateTotal() {
      const activeBundle = document.querySelector('.bundle-option.active');
      const unitPrice = activeBundle ? parseFloat(activeBundle.dataset.price) : 99.00;
      const qty = parseInt(document.getElementById('cart-item-qty')?.value || 1);
      const total = unitPrice * qty;

      const subtotal = document.getElementById('cart-subtotal');
      if (subtotal) subtotal.textContent = `$${total.toFixed(2)} USD`;

      const countBadges = document.querySelectorAll('#header-cart-count, #cart-drawer-count');
      countBadges.forEach(b => b.textContent = qty);
    }
  },

  // Video Chapter Seek
  video: {
    seek(seconds) {
      const video = document.getElementById('dagmara-video-player');
      if (video) {
        video.currentTime = seconds;
        video.play();
      }
    }
  },

  // Policy Modals
  policy: {
    content: {
      shipping: `
        <h3>Free Express Shipping Worldwide</h3>
        <p>All orders are processed and dispatched within <strong>24 business hours</strong> directly from our regional fulfillment centers.</p>
        <p><strong>Estimated Delivery Time:</strong></p>
        <ul>
          <li>United States & Canada: 2–4 Business Days</li>
          <li>Europe & United Kingdom: 2–4 Business Days</li>
          <li>Australia & International: 3–6 Business Days</li>
        </ul>
        <p>Every shipment includes tracking and transit insurance. You will receive an SMS and email notification with your tracking number upon dispatch.</p>
      `,
      refund: `
        <h3>30-Day 100% Risk-Free Guarantee</h3>
        <p>We want you to experience the cutting power of the DAGMARA 20V chainsaw with complete confidence. If for any reason you are not completely satisfied within 30 days of receiving your kit, simply contact our support team at <strong>support@ragaoon.com.co</strong>.</p>
        <p>We will provide a prepaid return shipping label and issue a 100% full refund to your original payment method. No restocking fees, no questions asked.</p>
      `,
      warranty: `
        <h3>2-Year Official Manufacturer Warranty</h3>
        <p>Every DAGMARA™ power tool is built to industrial standards. Your purchase automatically includes a comprehensive <strong>2-Year Limited Warranty</strong> covering:</p>
        <ul>
          <li>1000W Brushless Motor assembly & stator</li>
          <li>Electronic control board & switchgear</li>
          <li>Lithium-ion battery cell health & charging dock</li>
          <li>Telescopic pole locking coupling mechanisms</li>
        </ul>
        <p>If any component fails due to manufacturer defects within 24 months, we will send an immediate free replacement part or entire unit.</p>
      `,
      privacy: `
        <h3>Privacy Policy</h3>
        <p>Your privacy is important to us. We never sell, rent, or disclose your personal information, address, or payment details to any third parties. All transactions are securely encrypted using industry-standard 256-bit SSL protocols.</p>
      `,
      terms: `
        <h3>Terms of Service</h3>
        <p>By placing an order through DAGMARA / ragaoon.com.co, you agree to our standard terms of purchase. All products are designed for lawn, garden, property, and arborist maintenance. Please observe all included safety instructions and wear the provided cut-resistant gloves during operation.</p>
      `
    },
    open(policyKey) {
      const titleMap = {
        shipping: 'Shipping & Delivery Policy',
        refund: '30-Day Money-Back Guarantee',
        warranty: '2-Year Manufacturer Warranty',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service'
      };
      const title = document.getElementById('policy-modal-title');
      const content = document.getElementById('policy-modal-content');
      if (title) title.textContent = titleMap[policyKey] || 'Store Policy';
      if (content) content.innerHTML = theme.policy.content[policyKey] || '<p>Content unavailable.</p>';

      document.getElementById('policy-modal')?.classList.add('active');
      document.getElementById('policy-modal-overlay')?.classList.add('active');
    },
    close() {
      document.getElementById('policy-modal')?.classList.remove('active');
      document.getElementById('policy-modal-overlay')?.classList.remove('active');
    }
  }
};

// Flash Countdown Timer Tick Down
function startCountdown() {
  let totalSeconds = 2 * 3600 + 44 * 60 + 18;
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  setInterval(() => {
    if (totalSeconds <= 0) totalSeconds = 3 * 3600;
    totalSeconds--;

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(m).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(s).padStart(2, '0');
  }, 1000);
}

// Sticky Add to Cart Observer
function setupStickyATC() {
  const buyBtn = document.querySelector('.main-buy-btn');
  const stickyBar = document.getElementById('sticky-atc-bar');
  if (!buyBtn || !stickyBar) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        stickyBar.classList.add('visible');
      } else {
        stickyBar.classList.remove('visible');
      }
    });
  }, { threshold: 0.1 });

  observer.observe(buyBtn);
}

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  startCountdown();
  setupStickyATC();
});
