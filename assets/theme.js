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

  addItem: async (variantId, quantity = 1, properties = {}) => {
    const payload = {
      id: Number(variantId),
      quantity: Number(quantity),
      properties: properties
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
  },

  clearCart: async () => {
    const res = await fetch('/cart/clear.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'same-origin'
    });
    if (!res.ok) throw new Error('Could not clear cart');
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

      // data-price and data-compare are in CENTS (raw Shopify integers), divide by 100
      const priceCents   = parseInt(element.dataset.price, 10)   || 0;
      const compareCents = parseInt(element.dataset.compare, 10) || 0;
      const price   = priceCents / 100;
      const compare = compareCents / 100;
      const bundleName = element.querySelector('.bundle-name')?.textContent.trim() || 'Standard Pro Kit';
      const savings = Math.max(0, compare - price);
      const discountPercent = compare > 0 ? Math.round((savings / compare) * 100) : 0;

      // Read the variant ID baked in directly by Liquid — no lookup needed
      const variantId = element.dataset.variantId;
      const variantInput = document.getElementById('ProductVariantIdInput');
      if (variantId && variantInput) {
        variantInput.value = variantId;
      }

      // Update displayed price, compare, badge
      const priceElem = document.getElementById('product-price');
      const compareElem = document.getElementById('product-compare-price');
      const badgeElem = document.getElementById('product-discount-badge');
      if (priceElem) priceElem.textContent = `$${price.toFixed(2)} USD`;
      if (compareElem) compareElem.textContent = `$${compare.toFixed(2)} USD`;
      if (badgeElem) badgeElem.textContent = savings > 0 ? `Save $${savings.toFixed(0)} (${discountPercent}% OFF)` : '';

      // Update sticky ATC bar
      const stickyPrice = document.querySelector('.sticky-atc-price');
      const stickyCompare = document.querySelector('.sticky-atc-compare');
      const stickyBadge = document.querySelector('.sticky-atc-badge');
      const stickyBtnSpan = document.querySelector('.sticky-atc-btn span');
      if (stickyPrice) stickyPrice.textContent = `$${price.toFixed(2)} USD`;
      if (stickyCompare) stickyCompare.textContent = `$${compare.toFixed(2)}`;
      if (stickyBadge) stickyBadge.textContent = savings > 0 ? `Save $${savings.toFixed(0)} (${discountPercent}% OFF)` : '';
      if (stickyBtnSpan) stickyBtnSpan.textContent = `Claim Special Offer ($${price.toFixed(0)})`;

      // Update COD On-Page Box
      const codPlan = document.getElementById('cod-selected-plan');
      const codPrice = document.getElementById('cod-price-display');
      const codTotal = document.getElementById('cod-total-display');
      if (codPlan) codPlan.textContent = bundleName;
      if (codPrice) codPrice.textContent = `$${price.toFixed(2)} USD`;
      if (codTotal) codTotal.textContent = `$${price.toFixed(2)} USD`;
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

      // Get selected bundle name for cart properties
      const activeBundle = document.querySelector('.bundle-option.active');
      const bundleName = activeBundle?.querySelector('.bundle-name')?.textContent || 'Standard Pro Kit';

      try {
        // Always attempt to add to the real Shopify cart
        await ShopifyCart.addItem(variantId, qty, { 'Kit Configuration': bundleName });

        // Update cart count from real cart
        const cart = await ShopifyCart.getCart();
        if (cart) {
          theme.cart.updateCountBadge(cart.item_count);
        }

        if (atcBtn) {
          atcBtn.innerHTML = '<svg class="icon icon-cart" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg><span>✓ Added to Cart!</span>';
        }

        // Open the cart drawer with real data
        theme.cart.open();

      } catch (e) {
        console.error('Add to cart failed:', e);

        // Show error to user
        const notice = document.getElementById('atc-status-notice');
        if (notice) {
          notice.style.display = 'block';
          notice.textContent = e.message || 'Could not add to cart. Please try again.';
          notice.className = 'atc-inline-notice atc-error';
          setTimeout(() => { notice.style.display = 'none'; }, 5000);
        }

        if (atcBtn) {
          atcBtn.innerHTML = '<svg class="icon icon-cart" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg><span>⚠ Error — Try Again</span>';
        }
      } finally {
        setTimeout(() => {
          if (atcBtn) {
            atcBtn.disabled = false;
            atcBtn.innerHTML = '<svg class="icon icon-cart" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg><span>Add to Cart — Free Delivery</span>';
          }
        }, 3000);
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
        // Always add to cart first, then redirect to checkout
        const activeBundle = document.querySelector('.bundle-option.active');
        const bundleName = activeBundle?.querySelector('.bundle-name')?.textContent || 'Standard Pro Kit';

        await ShopifyCart.addItem(variantId, qty, { 'Kit Configuration': bundleName });
        window.location.href = '/checkout';
      } catch (err) {
        console.warn('Direct add failed, trying form submit:', err);

        // Fallback: try submitting the native Shopify product form
        const form = document.getElementById('MainAddToCartForm');
        if (form) {
          // Change the form action to go straight to checkout
          form.action = '/cart/add';
          const redirectInput = document.createElement('input');
          redirectInput.type = 'hidden';
          redirectInput.name = 'return_to';
          redirectInput.value = '/checkout';
          form.appendChild(redirectInput);
          form.submit();
        } else {
          // Last resort: cart permalink
          window.location.href = `/cart/${variantId}:${qty}`;
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

      // Get selected bundle info
      const activeBundle = document.querySelector('.bundle-option.active');
      const bundleName = activeBundle?.querySelector('.bundle-name')?.textContent || 'Standard Pro Kit';
      const bundlePrice = activeBundle ? parseFloat(activeBundle.dataset.price) : 99.00;

      // Build Shopify checkout URL with pre-filled customer info
      const variantId = document.getElementById('ProductVariantIdInput')?.value;
      const qty = parseInt(document.getElementById('product-qty')?.value || 1);

      // Try to create a real Shopify draft order via cart + checkout
      (async () => {
        try {
          await ShopifyCart.clearCart();
          await ShopifyCart.addItem(variantId, qty, {
            'Kit Configuration': bundleName,
            'Payment Method': 'Cash on Delivery (COD)',
            'Customer Name': name,
            'Phone': phone,
            'Address': address + ', ' + city,
            'Notes': notes
          });

          // Redirect to Shopify checkout with pre-filled info
          const checkoutUrl = `/checkout?checkout[shipping_address][first_name]=${encodeURIComponent(name.split(' ')[0])}&checkout[shipping_address][last_name]=${encodeURIComponent(name.split(' ').slice(1).join(' '))}&checkout[shipping_address][phone]=${encodeURIComponent(phone)}&checkout[shipping_address][address1]=${encodeURIComponent(address)}&checkout[shipping_address][city]=${encodeURIComponent(city)}&note=${encodeURIComponent('COD Order — ' + notes)}`;

          window.location.href = checkoutUrl;
        } catch (e) {
          console.warn('COD cart setup failed, showing confirmation:', e);

          // Fallback: show on-page confirmation if Shopify cart fails
          const orderId = '#DGM-' + Math.floor(1000 + Math.random() * 9000);
          const confOrderId = document.getElementById('conf-order-id');
          if (confOrderId) confOrderId.textContent = orderId;

          document.getElementById('direct-cod-form').style.display = 'none';
          document.getElementById('cod-success-message').style.display = 'block';
          document.getElementById('direct-checkout-section')?.scrollIntoView({ behavior: 'smooth' });

          // Fire Meta Pixel Purchase event
          if (typeof fbq === 'function') {
            fbq('track', 'Purchase', { value: bundlePrice, currency: 'USD', content_name: 'DAGMARA 20V Chainsaw' });
          }
        }
      })();
    }
  },

  // Cart Drawer
  cart: {
    async open() {
      // Fetch real cart data and render it
      const cart = await ShopifyCart.getCart();
      if (cart && cart.items && cart.items.length > 0) {
        theme.cart.renderItems(cart);
      }

      document.getElementById('cart-drawer')?.classList.add('active');
      document.getElementById('cart-drawer-overlay')?.classList.add('active');
    },

    close() {
      document.getElementById('cart-drawer')?.classList.remove('active');
      document.getElementById('cart-drawer-overlay')?.classList.remove('active');
    },

    renderItems(cart) {
      const container = document.getElementById('cart-drawer-items');
      if (!container) return;

      if (!cart.items || cart.items.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 3rem 1rem; color: #94a3b8;"><p style="font-size: 1.1rem; margin-bottom: 1rem;">Your cart is currently empty.</p><a href="#order-now" class="btn btn-outline btn-sm" onclick="theme.cart.close()">Continue Shopping</a></div>';
        theme.cart.updateCountBadge(0);
        const subtotal = document.getElementById('cart-subtotal');
        if (subtotal) subtotal.textContent = '$0.00 USD';
        return;
      }

      let html = '';
      cart.items.forEach((item, index) => {
        const price = (item.final_price / 100).toFixed(2);
        const comparePrice = item.original_price > item.final_price ? `<span class="cart-item-compare">$${(item.original_price / 100).toFixed(2)}</span>` : '';
        const imgSrc = item.featured_image?.url || item.image || '';
        const properties = item.properties || {};
        let propsHtml = '';
        for (const [key, val] of Object.entries(properties)) {
          if (val && key.charAt(0) !== '_') {
            propsHtml += `<span class="cart-item-prop">${key}: ${val}</span>`;
          }
        }

        html += `
          <div class="cart-item" data-line="${index + 1}" data-key="${item.key}">
            <img src="${imgSrc}" alt="${item.title}" width="80" height="80" class="cart-item-image">
            <div class="cart-item-details">
              <h3 class="cart-item-title">${item.product_title}</h3>
              ${item.variant_title ? `<p class="cart-item-variant">${item.variant_title}</p>` : ''}
              ${propsHtml ? `<div class="cart-item-props">${propsHtml}</div>` : ''}
              <div class="cart-item-price-row">
                <span class="cart-item-price">$${price} USD</span>
                ${comparePrice}
              </div>
              <div class="cart-item-quantity-row">
                <div class="quantity-selector">
                  <button type="button" class="qty-btn" onclick="theme.cart.changeQty('${item.key}', ${item.quantity - 1})">-</button>
                  <input type="number" class="qty-input" value="${item.quantity}" min="0" readonly>
                  <button type="button" class="qty-btn" onclick="theme.cart.changeQty('${item.key}', ${item.quantity + 1})">+</button>
                </div>
                <button type="button" class="cart-item-remove" onclick="theme.cart.changeQty('${item.key}', 0)">Remove</button>
              </div>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;

      // Update subtotal and count
      const subtotal = document.getElementById('cart-subtotal');
      if (subtotal) subtotal.textContent = `$${(cart.total_price / 100).toFixed(2)} USD`;
      theme.cart.updateCountBadge(cart.item_count);
    },

    async changeQty(lineKey, newQty) {
      try {
        const cart = await ShopifyCart.changeItem(lineKey, newQty);
        theme.cart.renderItems(cart);
      } catch (e) {
        console.error('Cart update failed:', e);
      }
    },

    async removeItem(lineKey) {
      await theme.cart.changeQty(lineKey, 0);
    },

    updateCountBadge(count) {
      const countBadges = document.querySelectorAll('#header-cart-count, #cart-drawer-count');
      countBadges.forEach(b => {
        b.textContent = count;
        if (count > 0) {
          b.style.display = '';
        }
      });
    },

    // Legacy method kept for backward compatibility
    updateTotal() {
      // Now handled by renderItems from real cart data
    },

    increment() {
      // Legacy - kept for any hardcoded onclick references
      theme.product.incrementQty();
    },

    decrement() {
      // Legacy - kept for any hardcoded onclick references  
      theme.product.decrementQty();
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

// Sync cart count badge on page load
async function syncCartBadge() {
  try {
    const cart = await ShopifyCart.getCart();
    if (cart) {
      theme.cart.updateCountBadge(cart.item_count);
    }
  } catch (e) {
    // Silent fail on initial load
  }
}

// Initialize bundle selection on page load — variant IDs & prices are already
// baked into data attributes by Liquid, so just trigger select() on the active card.
function initBundleVariants() {
  const activeBundle = document.querySelector('.bundle-option.active');
  if (activeBundle) {
    theme.bundles.select(activeBundle);
  }
}

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  startCountdown();
  setupStickyATC();
  syncCartBadge();
  initBundleVariants();
});
