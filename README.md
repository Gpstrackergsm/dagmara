# DAGMARA™ 2-in-1 Cordless Telescopic Chainsaw – Official Shopify Theme

A high-converting Direct-to-Consumer (DTC) Shopify Online Store 2.0 theme built exclusively for the **DAGMARA™ SMARTFLEXLI 20V Cordless Telescopic Chainsaw** ([ragaoon.com.co](https://ragaoon.com.co/products/dagmara%E2%84%A2-2-in-1-cordless-telescopic-chainsaw-20v-brushless-motor-12-30cm-bar-high-reach-extension-pole)).

Designed to turn paid Facebook, Instagram, and TikTok ad traffic into maximum conversions, pre-orders, and cash-on-delivery checkouts.

---

## 🎯 Product Specification & Metadata

* **Product Title**: `DAGMARA™ 2-in-1 Cordless Telescopic Chainsaw – 20V Brushless Motor, 12” (30cm) Bar & High-Reach Extension Pole`
* **Meta Description**: `Cut thick logs and prune high branches without breaking a sweat—or risking a ladder! The DAGMARA™ SMARTFLEXLI 20V Cordless Telescopic Chainsaw combines extreme cutting power with total versatility.`
* **URL Handle**: `dagmara™-2-in-1-cordless-telescopic-chainsaw-20v-brushless-motor-12-30cm-bar-high-reach-extension-pole`
* **Target Store URL**: `https://ragaoon.com.co/products/dagmara™-2-in-1-cordless-telescopic-chainsaw-20v-brushless-motor-12-30cm-bar-high-reach-extension-pole`

---

## 🚀 Key Conversion Architecture

1. **High-Impact Hero Banner (`sections/hero-banner.liquid`)**
   - High-contrast power-tool branding with cyan `#00b4d8` and safety red accents.
   - Live spec callouts: *1000W Brushless Pure Copper Motor*, *6,000 RPM Cutting Speed*, *12" (30cm) Quenched Bar*, *2-in-1 Telescopic System*.
   - Dual CTAs with smooth scroll to purchase engine and 56s live cutting demo.

2. **Flagship Purchase Engine (`sections/main-product.liquid`)**
   - **Promotional Pricing**: **$99.00 USD** (Regular $179.00 USD — Save $80 / 44% OFF).
   - **10 Real High-Resolution Product Angles** extracted directly from real field footage:
     1. Complete kit & retail box unboxing
     2. Chainsaw profile & safety guard
     3. Heavy wood / thick 30cm log cutting with flying chips
     4. Overhead telescopic high-reach pruning
     5. 12-inch Dagmara deep-quenched bar & chain
     6. Quick chain sprocket mounting
     7. Tool-free red tensioning adjustment knob
     8. Built-in automatic oil lubrication reservoir
     9. 1000W brushless motor housing & safety grip
     10. Telescopic aluminum extension pole mechanism
   - **Scarcity & Urgency Elements**: Batch inventory meter (*"Only 7 units remaining in this shipment"*) and active countdown timer.
   - **Tiered Bundle Selector**: Standard Kit ($99), Double Battery Deluxe Kit ($129 - Most Popular), Landscaper Master Kit ($149).
   - **1-Click Checkout & COD**: Buy now button and Cash on Delivery trust badges.

3. **2-in-1 Dual-Mode Showcase (`sections/telescopic-showcase.liquid`)**
   - Side-by-side demonstration of **Mode 1: Handheld Chainsaw** (for thick ground logs, lumber, and firewood) vs. **Mode 2: Overhead Pole Saw** (for trimming high branches up to 15 ft safely with boots on the ground).

4. **Industrial Brushless Engine Anatomy (`sections/brushless-engine.liquid`)**
   - 1000W brushless motor efficiency, automatic chain oiling reservoir, and tool-free quick tension dial.

5. **Integrated Video Showcase (`sections/video-showcase.liquid`)**
   - Built-in video player streaming the web-optimized MP4 demo with clickable chapter navigation (High Branch Pruning, Heavy Log Slicing, Tool-Free Chain Mount, Auto Oiler & Unboxing).

6. **Direct-Response Feature Comparison Matrix (`sections/comparison-table.liquid`)**
   - Clear proof of why DAGMARA ($99) outperforms dangerous, heavy gas chainsaws ($300–$550) and underpowered 4"/6" brushed toys ($40–$70).

7. **Social Proof & Verified Reviews (`sections/reviews-testimonials.liquid`)**
   - 4.9/5.0 aggregate customer rating with real homeowner and contractor testimonials.

8. **Frictionless FAQ Accordion (`sections/faq.liquid`)**
   - Pre-answering top purchase objections regarding cutting capacity, battery life, reach height, warranty, and chain oil.

9. **Sticky Add-to-Cart & Slide-Over Cart Drawer (`snippets/sticky-atc.liquid`, `snippets/cart-drawer.liquid`)**
   - Persistent bottom bar when scrolling past the main buy button.
   - Slide-over cart drawer with animated free shipping progress bar, quantity selector, and instant checkout.

---

## 🛠️ Theme Directory Structure

```
dagmara/
├── assets/
│   ├── 01_hero_complete_kit.jpg
│   ├── 01_hero_complete_kit_square.jpg
│   ├── 02_chainsaw_profile.jpg
│   ├── 02_chainsaw_profile_square.jpg
│   ├── 03_cutting_thick_log.jpg
│   ├── 03_cutting_thick_log_square.jpg
│   ├── 04_telescopic_high_reach.jpg
│   ├── 04_telescopic_high_reach_square.jpg
│   ├── 05_12inch_dagmara_bar.jpg
│   ├── 05_12inch_dagmara_bar_square.jpg
│   ├── 06_easy_chain_assembly.jpg
│   ├── 06_easy_chain_assembly_square.jpg
│   ├── 07_toolless_tensioning_knob.jpg
│   ├── 07_toolless_tensioning_knob_square.jpg
│   ├── 08_automatic_oiler_reservoir.jpg
│   ├── 08_automatic_oiler_reservoir_square.jpg
│   ├── 09_brushless_motor_grip.jpg
│   ├── 09_brushless_motor_grip_square.jpg
│   ├── 10_telescopic_extension_pole.jpg
│   ├── 10_telescopic_extension_pole_square.jpg
│   ├── dagmara-chainsaw-demo.mp4
│   ├── favicon.svg
│   ├── favicon.png
│   ├── apple-touch-icon.png
│   ├── theme.css
│   └── theme.js
├── config/
│   ├── settings_data.json
│   └── settings_schema.json
├── layout/
│   └── theme.liquid
├── locales/
│   └── en.default.json
├── sections/
│   ├── announcement-bar.liquid
│   ├── header.liquid
│   ├── hero-banner.liquid
│   ├── main-product.liquid
│   ├── telescopic-showcase.liquid
│   ├── brushless-engine.liquid
│   ├── video-showcase.liquid
│   ├── comparison-table.liquid
│   ├── reviews-testimonials.liquid
│   ├── faq.liquid
│   ├── guarantee-banner.liquid
│   ├── footer.liquid
│   ├── main-cart.liquid
│   ├── main-page.liquid
│   └── main-404.liquid
├── snippets/
│   ├── cart-drawer.liquid
│   ├── icon.liquid
│   ├── policy-modal.liquid
│   ├── product-card.liquid
│   └── sticky-atc.liquid
└── templates/
    ├── 404.json
    ├── cart.json
    ├── index.json
    ├── page.json
    ├── policy.liquid
    └── product.json
```

---

## 📦 How to Upload to Shopify

1. Compress the repository folder into a `.zip` archive (or push via Shopify CLI / GitHub App).
2. In your Shopify Admin, navigate to **Online Store > Themes**.
3. Under **Theme library**, click **Add theme > Upload zip file**.
4. Click **Publish** to make DAGMARA your live active theme!
