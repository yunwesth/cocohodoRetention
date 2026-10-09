# POC 1 — content and brand review

Prepared October 9, 2026. POC 1 deliverables are complete and ready for review. Content approval and live launch are separate from this draft.

## Decisions carried forward

- Square is excluded by your instruction. The candidate ordering providers are DoorDash, Grubhub, and Uber Eats.
- Use the app's cream, brown, and walnut visual direction for the public website.
- Build the first prototype with price-free menu categories and labeled image placeholders where photos are missing.
- Keep rewards in preview until the program rules and live services are ready.

## Store details

| Field | Draft value | Status |
| --- | --- | --- |
| Name | Cocohodo Closter | Official site |
| Address | 255 Closter Dock Road, Closter, NJ 07624 | Official site |
| Phone | (201) 767-2626 | Official site |
| Hours | Monday–Saturday, 9 AM–6 PM; Sunday closed | Official site; holiday hours unresolved |

Source: [official contact page](https://njcocohodo.com/contact/), checked October 9, 2026. These values live together in [store.json](../../website/content/store.json), which all proposed pages should consume. The public pages do not exist yet, so consistency here means one content source has been established; rendered-page checks belong to POC 2.

## Proposed homepage copy

**Headline:** Korean pastries, sweet treats, and coffee in Closter.

**Introduction:** Explore walnut pastries, croissant taiyaki, bubble tea, and more. Find a favorite for your next visit.

**Buttons:** Explore the menu · Order online

**About:** A little something for every visit. Stop by for a pastry and a drink, or explore walnut pastry gift boxes for someone special.

**Rewards:** A little thank-you for coming back. Preview our digital rewards card and see how collecting stamps works.

**Visit:** Come see us in Closter. Find our hours, call the shop, or get directions.

This is draft copy grounded in the [official site's offerings](https://njcocohodo.com/). No reviews, ratings, or bestselling claims are included.

## Menu and ordering

The draft categories are walnut pastries, gift boxes, croissant taiyaki, bubble tea and smoothies, shaved ice, and coffee/hot/iced drinks. Category names come from the [official menu](https://njcocohodo.com/menu/). Product availability and current in-store prices remain unresolved; prices are explicitly disabled in the content file.

| Provider | Candidate link | Remaining check |
| --- | --- | --- |
| DoorDash | [Closter store](https://www.doordash.com/store/cocohodo-closter-623514/) | POC 3: correct store, available ordering modes, active link |
| Grubhub | [Closter store](https://www.grubhub.com/restaurant/cocohodo-255-closter-dock-rd-closter/2525321) | Same |
| Uber Eats | [Closter store](https://www.ubereats.com/store/cocohodo-closter/PJsu-e91RoWihoPZwbhiXw) | Same |

The official homepage links these providers. No preferred provider has been selected. Production enablement stays false until the POC 3 checks; the future prototype can show candidate choices clearly as a draft.

## Rewards rules to review

The existing app implements one stamp per eligible paid drink, a reward after ten stamps, preserved overflow, redemption before adding more to a full card, and no stamp expiration. These are implementation facts from [README.md](../../README.md), not confirmation of store policy.

Before advertising the live offer, settle eligible drinks, free-drink size/value, exclusions, and pickup/delivery eligibility. External orders do not automatically award stamps. The proposed app address remains `app.njcocohodo.com`, subject to domain access and setup.

## Visual and photo review

Use the existing paper background `#f8f5f2`, brown text `#2c251f`, and warm accent `#e9d5c2`. Pair readable sans-serif body text with optional Georgia headings. Use the walnut mark as the prototype identity and reserve Hodo for the rewards section.

The [asset inventory](ASSET_INVENTORY.md) identifies every existing image/artwork candidate, its source, and its unresolved reuse status. Proposed real photos: pastry/drink hero, taiyaki, bubble tea or shaved ice, a gift box, and the Closter storefront. No external photograph is claimed to be cleared for publication.

## POC 1 acceptance record

- [x] Store details are centralized for consistent reuse across proposed pages.
- [x] Every proposed visual has a source or is explicitly marked as an unselected photo request; reuse status is recorded.
- [x] Prices, availability, holiday hours, and reward eligibility are explicitly unresolved.
- [x] The first prototype can proceed without prices or approved photography.

Checks: parsed the JSON, checked required source references and local asset paths, and checked that the only candidate provider IDs are DoorDash, Grubhub, and Uber Eats. This POC adds content/documents only; application tests are not needed for these changes.

**Next:** POC 2 builds the public website prototype from this content. Review this sheet for corrections to the copy or visual direction; unresolved prices and photo selection do not block the prototype.

## Subsequent implementation

The user authorized all remaining POCs on October 9, 2026. This sheet remains the historical POC 1 review. The [MVP status](../../MVP_STATUS.md) and [photo sources](../../website/public/photos/SOURCES.md) describe the implemented website, updated provider checks, and remaining launch requirements.
