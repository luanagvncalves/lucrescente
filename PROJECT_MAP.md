# Lucrescente Website - File Reference

**Project Path:** `C:\Users\Lenovo\OneDrive - IPLeiria\Lucrescente\lucrescente`  
**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Supabase, Stripe  
**Last Updated:** 2026-09-22

## Directory Structure

```
lucrescente/
├── web/                          # Main Next.js app
│   ├── src/
│   │   ├── app/                  # Pages and routing
│   │   ├── components/           # React components
│   │   ├── lib/                  # Utilities and types
│   │   ├── content/              # Multi-language content
│   │   ├── data/                 # Product catalog, testimonials
│   │   └── config/               # Configuration
│   ├── public/                   # Static assets & images
│   └── package.json              # Dependencies
├── assets/                        # Photos and images
├── supabase/                      # Database migrations
└── verification/                  # Screenshots for testing
```

## Pages (src/app/)

| File | Purpose |
|------|---------|
| `page.tsx` | Home page with hero, testimonials, featured products |
| `layout.tsx` | Root layout, header, footer, providers |
| `produtos/page.tsx` | Product catalog, category filtering |
| `produtos/[slug]/page.tsx` | Individual product detail page |
| `ingredientes/page.tsx` | Ingredient directory/search |
| `ingredientes/[slug]/page.tsx` | Individual ingredient detail |
| `galeria/page.tsx` | Photo gallery by year |
| `galeria/[ano]/page.tsx` | Photos for specific year |
| `cuidados/page.tsx` | Care instructions |
| `sobre/page.tsx` | About page |
| `encomenda/confirmacao/page.tsx` | Order confirmation |
| `error.tsx` | Error boundary |
| `not-found.tsx` | 404 page |
| `api/checkout/route.ts` | Stripe checkout endpoint |
| `api/stripe/webhook/route.ts` | Stripe webhook handler |

## Components (src/components/)

### Product Display
- `product/catalogue.tsx` → Product grid with filtering
- `product/product-card.tsx` → Single product card (3:4 aspect ratio)
- `product/product-gallery.tsx` → Product detail image gallery (3:4 aspect ratio)
- `product/purchase-panel.tsx` → Variant selector, quantity, add to cart, **dose input for embalagem própria**
- `product/candle-models.tsx` → Custom container options for candles

### Cart & Checkout
- `cart/cart-drawer.tsx` → Shopping cart sidebar with checkout button
- `cart/clear-cart.tsx` → Clear cart utility

### Layout
- `layout/header.tsx` → Top navigation, cart icon
- `layout/footer.tsx` → Footer with links
- `layout/locale-runtime.tsx` → Language switcher

### Home Page
- `home/hero.tsx` → Hero section
- `home/testimonials.tsx` → Customer testimonials
- `home/ingredient-teaser.tsx` → Featured ingredients

### Content
- `ingredient/ingredient-index.tsx` → Ingredient search/list
- `contact/contact-links.tsx` → Contact information

### UI Components
- `ui/button.tsx` → Reusable button
- `ui/modal.tsx` → Modal dialog
- `ui/product-image.tsx` → Image with **3:4 aspect ratio, portrait/square/wide ratios**
- `ui/motifs.tsx` → Decorative motifs
- `ui/toaster.tsx` → Toast notifications
- `ui/scroll-reveal.tsx` → Scroll animations
- `ui/typography.tsx` → Text styles

## Configuration & Data

### Configuration Files
- `web/package.json` → Dependencies, build scripts
- `web/tsconfig.json` → TypeScript settings
- `web/tailwind.config.js` → Tailwind CSS theme (colors, spacing)
- `web/next.config.js` → Next.js config
- `src/config/shipping.ts` → Shipping rates/zones

### Data Files
- `src/data/catalog.ts` → **Product definitions with variants (updated 2026-09-22 for sais de banho)**
- `src/data/editorial.ts` → Featured products, testimonials
- `src/data/testimonials.ts` → Customer reviews
- `src/data/galeria.ts` → Gallery configuration

### Content Files (Multi-language)
- `src/content/pt.ts` → Portuguese text (UI, labels, messages)
- `src/content/en.ts` → English translations
- `src/content/fr.ts` → French translations
- `src/content/product-locales.ts` → Product name/description translations
- `src/content/ingredient-locales.ts` → Ingredient translations
- `src/content/category-locales.ts` → Category name translations
- `src/content/allergen-notes.ts` → Allergen information per product

## Libraries & Utilities

### Core
- `src/lib/types.ts` → TypeScript types (Product, Variant, Order, etc.)
- `src/lib/i18n.ts` → Language/locale utilities
- `src/lib/cart-store.ts` → Cart state management (Zustand)
- `src/lib/orders.ts` → Order processing logic

## Product Images

### Image Locations
```
web/public/images/products/
├── spray-relaxante/        ← YOUR NEW SPRAY PHOTOS (0.jpg = cover)
│   ├── 0.jpg (cover)
│   ├── 1.jpg
│   └── 2.jpg
├── sais-de-banho-relaxante/  ← YOUR NEW BATH SALT PHOTOS
│   ├── 0.jpg (cover)
│   ├── 1.jpg
│   ├── 2.jpg
│   └── 3.jpg
├── [other-products]/
├── categories/             ← Category preview images
└── editorial/              ← Home page images
```

## Recent Changes (This Session)

✅ **Spray Relaxante**
- Changed aspect ratio: 4/5 → 3/4
- Added 3 new product photos (0.jpg = cover with 3rd image)
- Affects: `product-image.tsx`, `product-gallery.tsx`

✅ **Sais de Banho Relaxante**
- Added 4 new product photos (0.jpg = cover)
- Lowercase description
- Added "frasco de vidro" (€8) variant option
- Added dose input box when "embalagem própria" selected
- Affects: `catalog.ts`, `purchase-panel.tsx`

## Quick Navigation - Most Edited Files

**For product changes:**
- Product info: `src/data/catalog.ts`
- Product display: `src/components/product/product-card.tsx`, `product-gallery.tsx`
- Variants/options: `src/components/product/purchase-panel.tsx`
- Images: `web/public/images/products/[category]/`

**For text/language:**
- Portuguese content: `src/content/pt.ts`
- Product translations: `src/content/product-locales.ts`

**For styling:**
- Colors/theme: `web/tailwind.config.js`
- Product image styling: `src/components/ui/product-image.tsx`

**For checkout:**
- Cart: `src/components/cart/cart-drawer.tsx`
- Checkout: `web/src/app/api/checkout/route.ts`
- Stripe: `web/src/app/api/stripe/webhook/route.ts`

---

**Next time you need to edit something, I can reference this map instead of asking for file paths!** 🚀
