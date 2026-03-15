<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jihyun Kim Ceramics website. The following changes were made:

- **`instrumentation-client.js`** (new): Initialises PostHog client-side using `posthog-js` with reverse-proxy ingestion, exception capture, and debug mode in development.
- **`next.config.mjs`**: Added PostHog reverse-proxy rewrites (`/ingest/*` → `us.i.posthog.com`) and `skipTrailingSlashRedirect: true` to improve event reliability.
- **`lib/posthog-server.js`** (new): Server-side PostHog client factory using `posthog-node` with `flushAt: 1` and `flushInterval: 0` for immediate flushing in serverless functions.
- **`.env.local`**: `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` set (gitignore-protected).
- **`pages/shop/[id].js`**: Added `shop_item_viewed` (on item load) and `add_to_cart` (on button click) events with item properties.
- **`pages/shop/index.js`**: Added `shop_item_clicked` event with item properties when a user clicks a shop item card.
- **`pages/basket.js`**: Added `remove_from_cart` (on remove button click) and `checkout_started` (on checkout button click) events with cart details.
- **`pages/success.js`**: Added `checkout_completed` client-side event with order ID, amount, currency, and discount code when payment is confirmed.
- **`components/checkout.js`**: Passes `x-posthog-distinct-id` header to the checkout API for server-side event correlation.
- **`pages/api/checkout_sessions.js`**: Added server-side `checkout_session_created` event capturing the Stripe session ID, item count, and subtotal.
- **`pages/api/signup.js`**: Added server-side `newsletter_signup` event with user email as a `$set` property.

| Event | Description | File |
|-------|-------------|------|
| `shop_item_viewed` | Fired when a user views a shop item detail page — top of the purchase funnel | `pages/shop/[id].js` |
| `shop_item_clicked` | Fired when a user clicks on a shop item card in the shop listing page | `pages/shop/index.js` |
| `add_to_cart` | Fired when a user clicks 'Add to cart' on a shop item detail page | `pages/shop/[id].js` |
| `remove_from_cart` | Fired when a user removes an item from their basket | `pages/basket.js` |
| `checkout_started` | Fired when a user clicks the Checkout button in the basket | `pages/basket.js` |
| `checkout_session_created` | Server-side: fired when a Stripe checkout session is successfully created | `pages/api/checkout_sessions.js` |
| `checkout_completed` | Fired on the success page when a paid and complete session is confirmed | `pages/success.js` |
| `newsletter_signup` | Server-side: fired when a user successfully submits their email for the newsletter | `pages/api/signup.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/56651/dashboard/1363689
- **Purchase Funnel** (item viewed → add to cart → checkout started → purchase completed): https://us.posthog.com/project/56651/insights/E7VB1cJP
- **Shop Activity Over Time** (daily trends of all key shop events): https://us.posthog.com/project/56651/insights/hIvafoc9
- **Most Clicked Shop Items** (bar chart broken down by item title): https://us.posthog.com/project/56651/insights/FxmqfsfE
- **Checkout Session Created vs Completed** (server-side sessions vs confirmed purchases): https://us.posthog.com/project/56651/insights/FlqxhCEh
- **Newsletter Signups** (weekly signups over 90 days): https://us.posthog.com/project/56651/insights/KyqEfQXh

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
