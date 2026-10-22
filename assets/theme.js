/**
 * DAGMARA™ 20V Pro Power Tools - Interactive JavaScript Engine
 */

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
      if (input) {
        input.value = parseInt(input.value) + 1;
      }
    },
    decrementQty() {
      const input = document.getElementById('product-qty');
      if (input && parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
      }
    },
    addToCart() {
      const qty = parseInt(document.getElementById('product-qty')?.value || 1);
      const cartInput = document.getElementById('cart-item-qty');
      if (cartInput) {
        cartInput.value = qty;
      }
      theme.cart.open();
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
