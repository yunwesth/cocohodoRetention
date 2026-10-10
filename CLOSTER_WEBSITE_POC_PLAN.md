# Closter Cocohodo — website MVP and rewards integration

Prepared: October 9, 2026  
Status: Local MVP implemented October 9, 2026 after authorization to proceed through all POCs. POCs 1–4 have working deliverables; POCs 5–7 have automated verification and/or launch preparation, with live service, domain, and pilot steps outstanding. See [MVP_STATUS.md](MVP_STATUS.md) for evidence and limitations.

## 1. Intended result

Create a mobile-friendly website for Closter Cocohodo where visitors can explore the menu, find the shop, choose an ordering provider, and open our existing rewards app.

Proposed addresses, subject to confirming ownership and DNS access:

| Address | Purpose |
| --- | --- |
| `https://njcocohodo.com` | Public website: food, menu, ordering, store information, and rewards introduction |
| `https://app.njcocohodo.com` | Existing customer rewards app |
| `https://app.njcocohodo.com/cashier/login` | Staff sign-in and access to the cashier station |

If another domain is chosen, retain the same `domain` + `app.domain` arrangement. These are proposed destinations, not claims that the subdomain is configured or available to us.

**Recommended approach:** create a separate public website and connect it to the existing rewards app with prominent links and consistent branding. Keep the current rewards routes intact. Visitors should be able to browse the public website without creating an account.

## 2. Research and content baseline

Web research checked the existing official website and search results for the Closter location. Treat the following as source-backed draft content, with an owner check before publication. Search results and delivery listings can lag behind current store operations.

| Information | Draft content | Source / status |
| --- | --- | --- |
| Business name | Cocohodo Closter | [Official contact page](https://njcocohodo.com/contact/) |
| Address | 255 Closter Dock Road, Closter, NJ 07624 | [Official contact page](https://njcocohodo.com/contact/) |
| Phone | (201) 767-2626 | [Official contact page](https://njcocohodo.com/contact/) |
| Published store hours | Monday–Saturday, 9 AM–6 PM; Sunday closed | [Official contact page](https://njcocohodo.com/contact/); holiday exceptions unknown |
| Main offerings | Korean walnut pastries, croissant taiyaki, bubble tea, shaved ice, and coffee | [Official homepage](https://njcocohodo.com/) |
| Menu organization | Walnut pastries and gift boxes; taiyaki; smoothies and bubble tea; shaved ice; hot and iced drinks | [Official menu](https://njcocohodo.com/menu/) |
| Ordering candidates for the MVP | DoorDash, Grubhub, Uber Eats | [Official homepage navigation](https://njcocohodo.com/); ordering availability requires an interactive check |

### Important content discrepancies

- The official menu lists custard taiyaki at $4; [DoorDash](https://www.doordash.com/store/cocohodo-closter-623514/) lists it at $5.95. Channel pricing or stale content could explain this; we cannot determine which from these pages alone.
- Delivery ordering windows may differ from storefront hours. Display the official storefront schedule for visiting, and let each provider show its own ordering availability.
- The official menu contains apparent transcription issues, including a three-decimal drink price. Do not import prices automatically into the new site.
- Google rating, review count, holiday hours, parking details, social profiles, and a public email address have not been verified. Omit them until confirmed rather than inventing values.
- Ingredient descriptions are not a complete allergen policy. Any dietary or allergen claims need the shop's confirmation.

### Ordering links to validate in POC 3

User decision (October 9, 2026): exclude Square from all website ordering links.

| Provider | Candidate destination | Evidence |
| --- | --- | --- |
| DoorDash | <https://www.doordash.com/store/cocohodo-closter-623514/> | Closter store listing found in search |
| Grubhub | <https://www.grubhub.com/restaurant/cocohodo-255-closter-dock-rd-closter/2525321> | Destination linked from the official site; checkout not tested |
| Uber Eats | <https://www.ubereats.com/store/cocohodo-closter/PJsu-e91RoWihoPZwbhiXw> | Closter listing; use a clean store link without another customer's address parameters |

Use an address-based Google Maps directions link initially. Verify that it opens the correct storefront on a phone before release; the existing site's shortened map link could not be resolved by the research tool.

## 3. MVP experience

### Public pages

| Page | Contents and main action |
| --- | --- |
| `/` | Product photograph, short introduction, featured food categories, menu and order buttons, rewards introduction, visit information |
| `/menu/` | Readable HTML menu, category navigation, owner-confirmed descriptions and prices, ordering links |
| `/order/` | Working provider choices, clearly labeled pickup/delivery where verified |
| `/rewards/` | Explain the approved reward rules; “Join Rewards” and “Open My Rewards” buttons |
| `/contact/` | Address, hours, tap-to-call, directions; preserve the existing contact URL |
| `/privacy/` and `/rewards/terms/` | Accurate descriptions of data use and the approved rewards program before live enrollment |

The homepage should lead visitors through: **what the shop offers → explore food → order or visit → return with rewards**. Use a compact mobile navigation with Menu, Order, Rewards, and Visit. On the rewards page, make joining the primary action.

### Visual direction for the first draft

- Warm cream background, coffee-brown text, and restrained walnut/gold accents, coordinated with the current rewards app.
- Real shop and food photography, prioritizing walnut pastries, taiyaki, drinks, and the storefront.
- Keep the existing Cocohodo identity recognizable; confirm logo and photo reuse rights with the shop.
- English first, retaining verified Korean product names where useful. Full bilingual navigation can follow the MVP.
- Draft headline: “Korean pastries, sweet treats, and coffee in Closter.” This is proposed copy, not a quoted slogan.
- No invented reviews, ratings, bestseller labels, or unsupported origin stories.

### Rewards journey

1. Visitor opens the public website and selects Rewards.
2. Visitor reads the program rules and selects Join Rewards.
3. `app.<domain>/login` handles phone verification.
4. The customer sees their saved card and opens `/qr` at the counter.
5. Authorized staff scan the code and award eligible purchases.
6. The customer sees the updated card and later redeems a completed card through staff.
7. A “Back to Cocohodo” link returns to the public website. Returning customers can open the app directly or from their home screen.

External orders do not automatically earn stamps in this MVP. Eligibility for delivery/pickup purchases is a business decision; the existing implementation records staff-confirmed transactions and has no ordering-provider integration.

## 4. Reuse and architecture

### What already exists locally

Source inspection found a Next.js rewards app with these routes:

| Route | Existing purpose |
| --- | --- |
| `/` | Rewards dashboard |
| `/login` | Customer phone verification |
| `/qr` | Enlarged customer QR display |
| `/cashier/login` | Staff sign-in |
| `/cashier` | Scan, look up members, award stamps, redeem rewards |

The repository also includes Supabase integration, a database migration, an app manifest, automated test suites, and [a live launch checklist](LAUNCH_CHECKLIST.md). Blank service configuration produces a read-only preview. Inspecting this implementation does not establish that live SMS, database configuration, or physical-device scanning works today. The README records earlier test results; rerun relevant checks during the POCs rather than treating those results as current.

Existing program logic: one stamp per eligible paid drink, ten stamps per reward, overflow preserved, and a completed card redeemed before additional awards. Confirm drink eligibility, reward size/value, exclusions, and whether these rules match the shop's intended program before advertising them.

### Proposed implementation arrangement

```text
Public website — njcocohodo.com
  Menu / Order / Visit / Rewards explanation
                       |
                       | ordinary HTTPS links
                       v
Rewards app — app.njcocohodo.com
  Customer login / card / QR / staff station
                       |
                       v
  Supabase Auth + PostgreSQL
  SMS provider configured through Supabase
```

- Use npm workspaces: `apps/rewards` for rewards, `apps/website` for the public site, and `packages/ui` for shared artwork. Each app owns its build and configuration; install through the root lockfile.
- Use a separately deployable Next.js public site with static content for the initial menu and store details. A CMS is unnecessary for this MVP; document where an operator can request or make content changes.
- Use one configuration value for the public site's rewards destination and another for the app's return-to-site destination. Local development can use website port 3001 and rewards port 3000; staging uses explicit HTTPS origins.
- Proposed hosting: two projects on a Next.js-compatible host such as Vercel. This preserves the current app stack and allows independent releases. Custom root domains and subdomains are supported in [Vercel's domain setup documentation](https://vercel.com/docs/domains/working-with-domains/add-a-domain). Hosting account, commercial plan suitability, and costs are decisions for POC 6.
- Keep sign-in and customer data within the rewards app. The public site does not need a Supabase client, shared login cookies, or an embedded iframe. Configure applicable Supabase site/redirect URLs for the actual app environment; see [Supabase redirect configuration](https://supabase.com/docs/guides/auth/redirect-urls).
- Use separate staging and production service configuration. Do not put privileged database or SMS credentials in browser variables.
- Follow the installed Next.js documentation before implementation, as required by `AGENTS.md`, and use the project's specified Node 24 runtime.

## 5. POC sequence and progress

A POC is a small working experiment with a specific pass condition. The user subsequently authorized completing all POCs without intermediate review pauses. Record each result and any external dependency here. POCs 1–4 can establish the website and integration preview; POC 5 proves real rewards operation; POCs 6–7 cover release and a small shop pilot.

| Status | POC | Question to prove | Depends on |
| --- | --- | --- | --- |
| [x] | 1. Content and brand baseline | Can we represent the correct shop accurately? | This plan |
| [x] | 2. Public website prototype | Can a mobile visitor understand the shop and find key actions? | POC 1 draft |
| Built; field checks pending | 3. Menu, order, and visit flows | Can visitors find food, order, and reach the shop? | POC 2 |
| [x] | 4. Website-to-rewards integration | Does the existing rewards app feel like part of the website? | POC 3 |
| Automated tests passed; live setup pending | 5. Live rewards transaction | Can a real customer earn and redeem reliably? | POC 4 + staging services |
| Prepared; domain access pending | 6. Domain and release rehearsal | Can both properties run on their intended HTTPS addresses? | POC 5 + domain/hosting access |
| Prepared; real pilot pending | 7. Shop pilot and MVP launch | Can staff operate the complete experience during real service? | POC 6 |

### POC 1 — Content and brand baseline

**Build:** a store content file, asset inventory, and short content review document, seeded from the research above. Store each uncertain field's source and confirmation status. Inventory the existing app's colors and branding for reuse.

**Demonstrate:** one review sheet containing the business details, menu categories, draft homepage copy, proposed photographs, ordering links, and rewards rules.

**Pass when:**

- [x] Address, phone, and normal hours agree across the proposed pages.
- [x] Each image has a known source and reuse status.
- [x] Menu prices, product availability, holiday exceptions, and reward eligibility are either confirmed or explicitly unresolved.
- [x] The draft can proceed using categories and price-free previews if final pricing is unavailable.

**Needed from the shop:** current menu/prices, logo/photos if available, confirmation of rewards rules. Domain access is not required yet.

**Review decision:** accept the content/visual direction or list specific corrections. Unresolved prices block price publication, not layout work.

### POC 2 — Public website prototype

**Build:** a responsive homepage, shared header/footer, mobile navigation, and page layouts for the MVP routes. Use actual approved content where available and clearly labeled draft assets otherwise. Keep the existing rewards app runnable alongside it.

**Demonstrate:** the homepage on a phone-sized viewport and desktop. Walk from the introduction to Menu, Order, Rewards, and Visit.

**Pass when:**

- [x] A first-time visitor can identify the shop, its offerings, and its location immediately.
- [x] Menu, Order, and Rewards are reachable in one navigation action.
- [x] Layout works at 360px, 768px, and 1440px without horizontal overflow.
- [x] Navigation works by keyboard; text is readable and focus is visible.
- [x] The existing rewards routes still render separately.

**Review decision:** accept the layout, photography direction, and relationship to the app's branding before filling the full menu.

### POC 3 — Menu, order, and visit flows

**Build:** category-based HTML menu, a provider selection page, tap-to-call, directions, and the store-hours section. Publish only confirmed prices; omit prices while they remain unresolved. Use a simple editable content file with a last-reviewed date.

**Demonstrate:** find a pastry and a drink, choose an ordering provider, open the correct Closter listing, call the shop, and open directions on a phone. Provider verification does not require placing a paid order.

**Pass when:**

- [x] The menu remains usable without a PDF viewer or horizontal scrolling.
- [ ] Listed products and displayed prices match the approved content source.
- [ ] Every enabled provider opens the correct Closter store; broken or inactive providers are omitted.
- [x] Ordering page presents DoorDash and Uber Eats as choices; Grubhub is disabled after regional verification failed. No shop preference is assumed.
- [x] Storefront hours are clearly distinguished from provider ordering windows.
- [ ] Directions resolve to 255 Closter Dock Road and the call link uses the published phone number.

**Review decision:** confirm menu accuracy and the main Order destination.

### POC 4 — Website-to-rewards integration

**Build:** public rewards explanation, Join Rewards/Open My Rewards buttons, configurable cross-site links, matching brand elements, and a return link in the app. Keep staff access separate from customer navigation. Test with the existing read-only preview first.

**Demonstrate:** public homepage → rewards explanation → app login/dashboard → QR screen → return to public website. Show the cashier entry separately.

**Pass when:**

- [x] Links target the configured environment rather than a hardcoded production domain.
- [x] Direct navigation and refresh work on `/login`, `/qr`, and `/cashier/login`.
- [x] The preview is visibly labeled and does not imply live enrollment or saved stamps.
- [x] The existing app manifest still opens the rewards app as its own home-screen destination.
- [x] Public copy labels the current rules as proposed and does not promise automatic delivery-order rewards; final owner approval remains a live-launch requirement.

**Review decision:** accept the complete visual/navigation journey. This proves integration, not live rewards readiness.

### POC 5 — Live rewards transaction

**Build/configure:** staging Supabase database, migration, phone authentication/SMS provider, and authorized staff account. Reuse the existing application logic. [Supabase's phone sign-in guide](https://supabase.com/docs/guides/auth/phone-login) describes the provider setup. Complete the relevant items in [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md).

**Demonstrate:** on two physical devices, join from the website, receive an SMS, open a fresh card, scan it as staff, award eight then three stamps, redeem, and observe the remaining stamp. Sign out and back in to verify persistence.

**Pass when:**

- [ ] Real SMS verification succeeds and a new member begins at zero stamps.
- [ ] Eight plus three produces ten active and one pending stamp; redeeming leaves one active stamp.
- [ ] A retry after a lost response does not duplicate an award or redemption.
- [ ] Customers cannot use staff operations or access another member's information.
- [ ] Camera scanning and manual-code fallback work on iPhone Safari and Android Chrome over HTTPS.
- [ ] Home-screen opening, session restoration, and the public-site return journey work on both platforms.
- [ ] Relevant unit, database, browser, type, lint, and build checks pass; record actual results and any remaining failures.

**Needed from the shop:** shop-owned staging services, SMS setup, staff credentials provisioned securely, test phones, and final eligibility rules. Provider onboarding can take longer than implementation; no fixed activation date is assumed.

**Review decision:** accept live operation or fix failed cases before release. Finish accurate privacy/rewards terms before inviting real customers.

### POC 6 — Domain and release rehearsal

**Prepare:** two deployments, environment-specific service settings, domain mapping, HTTPS, backups, URL redirects, and a release/rollback runbook. Inventory the current site's URLs and DNS records before changing them. Choose a canonical root/`www` address and redirect the other.

**Demonstrate:** first use staging deployment URLs. Once release is authorized, verify the real public domain and `app` subdomain, cross-site navigation, direct app routes, and authentication on their final origins.

**Pass when:**

- [ ] Domain ownership/access and the host's required DNS values are confirmed; do not guess record values.
- [ ] The app subdomain can be introduced while the existing main site stays available during the rehearsal.
- [ ] HTTPS works on both destinations, and no login link points to staging or localhost.
- [ ] Existing `/menu/` and `/contact/` URLs remain usable; other changed URLs have explicit redirects.
- [ ] Public pages have appropriate titles, descriptions, canonical URLs, sitemap entries, and accurate local-business structured data.
- [ ] Staging and private/account routes are excluded from indexing; this does not replace authentication.
- [ ] Existing email DNS records are preserved, and rollback instructions identify the previous website deployment/DNS values.
- [ ] Hosting, database, SMS costs and an operating budget have been reviewed using the plans chosen at that time.

**Needed from the shop:** DNS/registrar and hosting access, production service setup, and a decision to replace the existing public website. The plan itself does not authorize a live-domain switch.

**Review decision:** authorize the prepared launch when the preview, checks, and rollback plan are reviewable.

### POC 7 — Shop pilot and MVP launch

**Prepare:** a counter QR sign pointing to the public rewards page, a short staff guide, and a support procedure for login issues and uncertain transactions. The staff guide must explain eligibility, full-card redemption, manual lookup, and transaction recovery.

**Demonstrate:** a proposed pilot with 5–10 invited customers over 3–7 operating days. These are suggested pilot parameters, not commitments or claims about current users.

**Pass when:**

- [ ] Staff can complete enrollment assistance, stamp awards, and redemption without developer assistance.
- [ ] No unresolved duplicate transactions, incorrect balances, or authorization failures remain.
- [ ] At least one returning customer opens the same saved card on a later visit.
- [ ] All critical launch checklist items are complete and remaining minor issues have an owner.
- [ ] The shop owner can identify how to change hours/menu content and whom to contact for support.

**Measure:** enrollment attempts/completions, successful awards, redemptions, repeat visits during the pilot, and staff-reported friction. Use existing records and a simple pilot log initially; define any new tracking separately and avoid logging phone numbers or QR tokens in analytics. A short pilot proves usability and operation, not a long-term retention lift.

**Review decision:** open enrollment more broadly or extend the pilot to resolve observed issues.

## 6. Scope after the MVP

Defer a custom cart/checkout, POS synchronization, automatic delivery rewards, promotional SMS campaigns, referral points, tiers, a management analytics dashboard, full bilingual content, and a native app-store application. Add these only after the basic website and rewards workflow pass the pilot.

## 7. Inputs needed, by stage

| Input / decision | Needed by | Default until resolved |
| --- | --- | --- |
| Current menu, pricing, and holiday hours | POC 3 publication | Use source-backed categories and ordinary hours; omit unconfirmed prices and holiday claims |
| Approved photographs/logo | POC 2 final visual review | Use labeled draft assets in the prototype |
| Preferred ordering provider | POC 3 | Show verified provider choices |
| Reward eligibility, reward limits, delivery eligibility | POC 4 final copy / POC 5 | Treat current app rules as a proposal |
| Supabase/SMS access and physical devices | POC 5 | Read-only preview |
| Domain choice, DNS access, and hosting budget | POC 6 | Local/staging URLs; `njcocohodo.com` remains a proposal |
| Privacy/support contact and launch operator | Before customer enrollment | Keep live enrollment closed |

## 8. How to execute this plan one POC at a time

POC 1 review: [Content and brand review](docs/poc-1/REVIEW.md).

Current handoff: [MVP status and verification](MVP_STATUS.md). Public website: http://localhost:3001; rewards: http://localhost:3000.

The latest user direction authorizes proceeding through every POC. Implement available deliverables and checks without waiting for per-POC approval. Record actual external requirements and unresolved business decisions; do not mark real-service, domain, or pilot outcomes complete based on local simulations.

| POC | Date | Evidence / preview | Pass or revise | Open items |
| --- | --- | --- | --- | --- |
| 1 | October 9, 2026 | [Review sheet](docs/poc-1/REVIEW.md), [store content](apps/website/content/store.json), [asset inventory](docs/poc-1/ASSET_INVENTORY.md) | Deliverables complete; ready for review | Prices, availability, holiday hours, photo rights, reward eligibility |
| 2 | October 9, 2026 | [Website](http://localhost:3001), [screenshots](docs/preview/desktop.png) | Implemented; viewport/browser checks passed | Owner visual review |
| 3 | October 9, 2026 | [Menu](http://localhost:3001/menu/), [ordering](http://localhost:3001/order/) | Implemented; two provider listings verified | Final availability, Grubhub, actual phone directions |
| 4 | October 9, 2026 | Website → app → QR → website browser tests | Passed on four profiles | Actual hosted origins |
| 5 | October 9, 2026 | 17 unit, 26 PGlite, 12 preview, 13 mocked authenticated checks passed | Automated portion passed; live portion pending | Real SMS, physical devices, shop services, separate PostgreSQL |
| 6 | October 9, 2026 | Production builds, [runbook](docs/launch/RUNBOOK.md) | Prepared; no deployment/domain changes | Hosting/DNS access, HTTPS rehearsal, launch review |
| 7 | October 9, 2026 | [Staff guide](docs/launch/STAFF_GUIDE.md), [pilot worksheet](docs/launch/PILOT.md) | Prepared; pilot not performed | Staff and invited customers |
