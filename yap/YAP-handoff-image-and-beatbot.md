# YAP handoff: images and Beatbot rebuild

Written 2026-10-06 at the end of the "Site fixes" session. For a new Claude Code session **with network access** to the supplier sites. The previous session could not reach any outside site (proxy 403 on every domain), so everything below that needs images or supplier pages is still open.

Read this whole file before touching anything.

---

## 0. Start here (updated 2026-10-06, second session)

**Step 0:** test network access first: `curl -sS -o /dev/null -w "%{http_code}\n" https://<host>/` for yardautomationpros.com, cdn.shopify.com, beatbot.com, wybotpool.com, mowrator.com, aiper.com, yarbo.com. `000` with "CONNECT tunnel failed, response 403" means the environment's network policy still blocks it. Stop and tell Afo which hosts are blocked. In the second session all seven were blocked, and GitHub, raw.githubusercontent.com and storage.googleapis.com worked.

**Afo's standing approval for the open work (given 2026-10-06):** do all of tasks 1 to 4 and 6 below in one run without stopping to ask. Stop only if a change would put something false on the site, break checkout or delete something. This replaces rule 2 in section 1 for this work. Save a before/after record of every live change in `yap/records/`.

**Task 5 (text clean-up) is DONE.** It was verified still in place at the end of session 2. Do not redo it. See section 3b.

### Open work, in order

| # | Task | Where it is described |
|---|---|---|
| 1 | Wrong images: Yarbo T-shirt (cap file), Trimmer Line Spool (mount file). Then scan all 160 products for other mismatches. | 4.1 |
| 2 | Bundle images: every Y40 and Y40P bundle, plus the Y40P Lawn Mower Pro Module, gets a main image showing what is included. Real Yarbo photos only, no AI images. **Also add the "Complete system" kit lines to the `yap-y40` and `yap-y40p` bundle templates in the draft** (pattern: the `kit_label` / `kit_text` cases in `snippets/yap-buybox-trust.liquid`). | 4.2 |
| 3 | Thin galleries: 51 single-photo products, Wide Wheels Edition first. 3 to 4 images per machine and 2 or more per accessory where official images exist. List any that have none. | 4.3 |
| 4 | Beatbot full rebuild (rules below) | 4.4 |
| 6 | Full preview check, then GO or NO-GO | 0.2 |

### 0.1 Beatbot rules added by Afo (on top of 4.4)
- The `beatbot`, `bb-*` and `bt-*` files are off limits as reference. Study `yap-y40`, `yap-y40p`, `yarbo-all-3-modules`, `yap-mowrator`, `yap-aiper` and `hobot` and match that design system exactly.
- **New Beatbot copy goes into metafields that only the new `yap-beatbot` template reads.** Do not overwrite the live Beatbot `descriptionHtml`, so live pages don't change until Afo publishes. Suggested namespace `yap_bb` (for example `yap_bb.hero`, `yap_bb.benefits`, `yap_bb.specs`, `yap_bb.faq`). Check that no current template reads the namespace you pick.
- Include a choosing guide and FAQs. State the warranty exactly as Beatbot's official warranty page does.
- Add the delivery line **only if Beatbot's official shipping page states it**. Otherwise leave it off.
- Upgrade every Beatbot gallery with official Beatbot images. Look at each one and write alt text.
- Build `/collections/beatbot` to match `/collections/wybot` and `/collections/aiper`, and add a Beatbot tile to the homepage "brands we carry" section in the draft.
- **Assign `yap-beatbot` to the 10 Beatbot products only after the draft preview shows it working.** Template assignment is live. Write down the exact time you do it.
- The 10 Beatbot SEO descriptions still say "continental US". When you change them, send title and description together.

### 0.2 Task 6 preview check
On `?preview_theme_id=188829761840`, load every in-use template (`betta`, `hobot`, `wybot`, `yap-aiper`, `yap-aiper-accessory`, `yap-mowrator`, `yap-mowrator-accessory`, `yap-y40`, `yap-y40p`, `yap-yarbo-accessory`, plus the new `yap-beatbot`). Also load all 10 Beatbot products, `/collections/beatbot`, the homepage, one collection page, `/cart`, `/pages/support` and `/pages/faqs`. Check each at desktop and mobile width (Playwright with Chromium is preinstalled, `executablePath: '/opt/pw-browsers/chromium'`).
Look for: Liquid errors, broken images, missing buy buttons, "Call Now To Order!", restocking fee wording (known: `sections/yi-support.liquid` says "15% restocking fee"), any "warehouse" or "every inquiry" text, and mobile layout breaks. Fix what's broken in the draft, then report GO or NO-GO.

### 0.3 Still on hold (do not do)
Publishing the theme. The refund policy (Afo edits it by hand). The standard shipping line A/B/C and the Collective shipping profile (waiting on Afo's checkout test). Compare-at on the 6 Yarbo trimmer bundles.

### 0.4 How to push theme files (learned in session 2)
- `themeFilesUpsert` accepts `body: {type: URL, value: <url>}`. Commit the edited file to this repo (public), then pass the `raw.githubusercontent.com/stunnerecom-hash/ship-kit/<commit sha>/...` URL, pinned to the commit. The job is asynchronous: poll `job(id){done}`, then compare `checksumMd5` with your local `md5sum`. This avoids pasting large files into tool calls.
- `bulkOperationRunMutation` is blocked by the connector. Large product edits have to go one `productUpdate` per product. Generate the payloads with a script, then verify by re-reading and comparing them in a script.
- Staged uploads to `shopify-staged-uploads.storage.googleapis.com` work. That could carry image files if a supplier CDN stays blocked but you have the files some other way.

---

## 1. Rules (unchanged from the original brief, plus what Afo added)

1. **Read the brand files first** (Google Drive, owner wholesale@yardautomationpros.com):
   - `yap-brand-voice-style-guide.md` (id `1XC0MrnskVc4nQZRKNSGLJQofj8CbgimC`)
   - `YAP - Brand Identity.md` (id `1tSDeZQ3aftR7NE3eLq_3McvBG-wJmk3q`)
   - `YAP - Design Language System.md` (id `1cfpTcfu4QvD-pufNMrCQObXbawCVMB4t`)
   - `Product Page Design Principles - From Porsche Build Guide Review.md` (id `1DrMRrJip_-pIhnRn53k2AE9d64sBJSV0`)
   - `Stratos Shopify Theme Dev Guide + Prompts.md` (id `1WHvC_m_Wa53iQGLauPVX6KTevOGA3-vr`, 688 KB)
   - Follow the `yap-shopify-store-ops` skill.
2. **Every live write needs Afo's explicit yes first.** Products, inventory, collections, redirects, navigation, files, metafields. Show object, old value, new value. One confirmation per distinct change; show the full list before a batch.
3. **Theme work only in the draft theme** `Claude Work - Site Fixes Oct 2026` (`gid://shopify/OnlineStoreTheme/188829761840`). The live theme is `Empire Main - SEO Work v2 2026-09-22` (`188462596400`). The connector blocks writes to the live theme and blocks publishing. Afo publishes.
4. **Brand voice:** no em dashes, en dashes or " - " punctuation; benefit first; second person; calm, no hype, no urgency, no discount language; no person shown or implied operating a machine.
5. **Images:** Afo gave permission to use the suppliers' own site images (Yarbo, Mowrator, Aiper, WYBOT, Beatbot). **Look at every image before it goes live.** Skip any photo showing a person operating the machine. No AI image generation unless Afo asks. Write alt text for every image.
6. **Never invent facts.** Specs, warranty, shipping and lead times come from Shopify data, the brand's official site, or Afo. Superlatives ("World's First", "Industry First") only if the maker states it and it is attributed; default is to leave them out.
7. **Never say "authorized dealer" for WYBOT, Beatbot, Yarbo or Mowrator.** (Per `yd-facts`: YAP is authorized for Betta, HOBOT and Aiper only.)
8. **YAP holds no inventory.** Never imply stock or a YAP warehouse.
9. **Shipping wording:** say "contiguous US", never "continental". Do **not** write "free shipping on every order" anywhere until Afo decides after the test order (see section 5).
10. Do not delete anything without asking. Leave the old `bb-*`, `bt-*` sections/snippets, `product.beatbot.json` and `product.yap-wybot.json` alone. Leave the Team Notes / Call Desk page (`/pages/team-notes`, template `page.yd`) alone.
11. No timeline estimates. No co-author lines on commits.

## 2. Tooling gotchas learned the hard way

- **SEO updates:** `productUpdate(product: {seo: {description}})` and `collectionUpdate(input: {seo: {description}})` **wipe the SEO title** if you send only the description. Always send `seo: {title, description}` together. (This happened once on 2026-10-06 and was restored within a minute.)
- `publishableUnpublish` is blocked by the connector. Unpublishing must be done by Afo in admin.
- `themeFilesUpsert` validates JSON templates. A template that references a deleted file (for example a missing video) is rejected. That is why `templates/product.yarbo-y40p.json` exists on live but not in the draft; it references `shopify://files/videos/Yarbo_Core_10.mp4`, which no longer exists. No product uses that template. Leave it.
- Theme file reads with bodies are large; the tool saves big results to disk. Use `jq`/python on the saved file.
- Collective products: Afo turned **off** title, description, media and compare-at sync for WYBOT and Beatbot on 2026-10-06. Price and inventory still sync. Edits to title, description, media and compare-at now stick (verified for descriptions and compare-at).
- Product images are uploaded with `productCreateMedia` (or `fileCreate` + `productUpdate`) using the image URL; Shopify fetches it. Check the URL is the supplier's official CDN and that you have looked at the image first.

## 3. What is already done (2026-10-06)

Live:
- Inventory tracking turned off on 13 non-Collective variants (Betta SE, SE Plus, Flex, Neo; Mowrator S1 4WD and 2WD; Yarbo Y40 LMP + Snow; Mowrator Self-Sharpening High-Lift Blades). Every non-Collective variant is now untracked.
- Compare-at cleared on all 50 WYBOT and Beatbot variants (no more "Save %" badges there).
- Footer "Learning Center" (`main-menu` item) now links to `/blogs/troubleshooting`.
- 15 redirects added, including `/collections/pro-resource-hub` to `/blogs/troubleshooting` (takes effect once Afo unpublishes that collection).
- WYBOT bundle typo fixed: title "S2 Solar Vision & F1", handle `wybot-full-pool-solution-bundle-s2-solar-vision-f1`, 301 from the old `...-vison-f1` URL.
- All 18 WYBOT descriptions rewritten in YAP voice (source facts: existing product data and the verified WYBOT warranty in `yd-facts`).
- Betta SE SEO description rewritten; Beatbot added to the `robot-pool-cleaners` SEO description.

Draft theme only:
- New `snippets/yap-buybox-trust.liquid` and a hook in `snippets/product.liquid` replace the old "Buy Online Or Call Now To Order!" buy box copy on all 48 product templates.
- "Shipping shown at checkout" text for Yarbo parts and HOBOT corrected in `snippets/yc-copy.liquid`, `sections/yi-support.liquid`, `templates/page.yap-faq.json`, `snippets/yd-facts.liquid`.
- `yd-facts`: Yarbo lead time saved as confirmed ("Usually delivered in 10 to 14 days, from Yarbo's US warehouses after payment"). Note: `yd-facts.liquid` says it is generated by `build-calldesk.js` from `yd-src/`; that source is not in Shopify. Whoever owns `yd-src` must make the same change or the next build reverts it.

## 3b. Done in session 2 (2026-10-06): Task 5 text clean-up

Records for rollback are in `yap/records/`.

Live:
- 18 WYBOT SEO descriptions: "Free shipping in the contiguous US." became "Free shipping in the contiguous US, except Rhode Island." Titles were sent unchanged. Record: `wybot-seo-rhode-island-2026-10-06.json`.
- `/pages/faqs` page body: the Affirm 0% APR financing question was removed. The slope answer now uses product data: Yarbo Y40/Y40P 70% (35°); Mowrator S1 4WD 75% (37°) standard, 85% (40°) Wide Wheels, 119% (50°) Grip Tread; S1 2WD 45% (24°). Record: `faqs-page-body-2026-10-06.json`.
- Blog: "continental" became "contiguous" in `wybot-vs-aiper-vs-betta` and `what-is-a-pool-skimmer-basket-vs-robotic-solar-skimmer`. "from U.S. warehouses" was removed from 5 Yarbo articles. Record: `blog-articles-contiguous-warehouse-2026-10-06.json`.
- 38 Yarbo and Mowrator products: warehouse wording was removed from `descriptionHtml`, `custom.shipping_information`, `custom.product_information`, `custom.key_features` and `custom.product_hero`. Record: `product-warehouse-wording-2026-10-06.json`.
- A store-wide product search for warehouse, continental or "every inquiry" now returns nothing.

Draft theme (44 files; copies in `records/draft-theme-188829761840/`; see its README):
- "every inquiry within 1 business day" became "We reply to emails within 1 business day" in every template.
- The FAQ tracking answer now says "after your order has shipped". The contact hint now says "once your order ships". All other customer-facing warehouse wording is gone. Legacy hidden buy box lines "Ships From Stock" and "In Stock" now say "Ships Direct".
- `page.faq.json` (unused): the Affirm answer was removed and the slopes were fixed.
- Kept on purpose: `sections/yp-supplier.liquid` asks suppliers about their own US warehouse, and the `source` note in `yd-facts`.

## 4. Open work for this session

### 4.1 Wrong product images (task 2.2)
| Product | ID | Problem |
|---|---|---|
| Yarbo T-shirt | 15305407496496 | Only image is `Yarbo_Cap-1.png` (looks like a cap). Confirm visually, replace with Yarbo's official T-shirt image. 1 photo total. |
| Yarbo Trimmer Line Spool (4 Pack) | 15305409233200 | Main image `Back_Brace_Mount-3.png`. Confirm, replace with the spool image, remove the wrong one from the gallery. 3 media. |
| Yarbo Y40P Lawn Mower Pro Module | 15289282330928 | Main image `yap-y40p-lmp.jpg` is the full Core + module kit shot. Replace with a module-only image. |

Then visually check **every** product's featured image. File names that cannot be judged without looking: `20260608-215215.png` (Cutting Disc & Bolts), `20260731-111130.png` (Data Center), `20260526-182658.png` (Flexible RTK Antenna Mount), `20260514-164907.jpg` (RTK Antenna Pro), `fa1ce8f3...jpg` (Mowrator Grip Tread Tires), `600W.jpg` (Mowrator charger), `016.jpg` (HOBOT 2S), `64.png` / `65.png` (Beatbot AquaSense 2 Ultra / X). Report every mismatch.

### 4.2 Bundles that look identical (task 2.3)
Shared or near-identical main images:
- `yap-y40p-lmp.jpg`: Y40P LMP Module, Y40P LMP, LMP + Snow, LMP + Leaf, All 3 Modules. Renamed copies (`yap-y40p-lmp_xxxx.jpg`) on the 4 Y40P LMP trimmer bundles.
- `yap-y40p-snow-combo.jpg`: Y40P Snow, Snow + Leaf; renamed copies on Snow + Trimmer and Snow + Leaf + Trimmer.
- `yap-y40p-blower-combo.jpg`: Y40P Leaf Blower and its trimmer copy.
- Y40 pairs sharing one image: Snow / Snow + Trimmer; Leaf / Leaf + Trimmer (`Frame_2036458133.webp`); Snow + Leaf / + Trimmer; LMP + Snow / + Trimmer; LMP + Leaf / + Trimmer; All 3 / All 3 + Trimmer.

**Propose the approach to Afo before building.** Suggested: a clean kit layout composed only from real Yarbo product photography (Core plus each included module, trimmer and BBM where included), consistent background. Reuse the Kit Contents Grid pattern (`snippets/kit-contents-card.liquid`, used on `product.yarbo-all-3-modules.json`) on the page where it helps.

### 4.3 Thin galleries (task 2.4)
51 products have one photo. **Wide Wheels Edition first** (machine, $4,299). Machines need 3 to 4 useful images; accessories need the product shot plus a fit or in-use shot where one exists (no person operating). Report any product where no extra official image exists.

Mowrator S1 21″ 4WD 18Ah Wide Wheels Edition (15257269666096) **first**, then:
Aiper: Caddy for Scuba X1 Pro Max and N1 Max (15282897256752), Charger for Scuba N1 Pro (15282894340400), Pilot X1 Filter Sleeve (15282882019632), Scuba L1 Ultra-fine Filter (15282883428656), Scuba N1 Charger (15282895094064), Scuba N1 Debris Basket (15282888868144), Scuba N1 Pro Charging Dock (15282892734768), Scuba N1 Pro Debris Basket (15282890178864).
Mowrator: High-Lift Blades (15257276350768), 600W Charger (15257275793712), Mulching Blades (15257276449072), Neck Strap (15257276514608), S1 Remote Controller (15257275531568), Self-Sharpening High-Lift Blades (15257276416304), Self-Sharpening Mowing Blades (15257276186928), Standard Wheels for 4WD (15257276055856).
Yarbo: Mini Blower 3D Model (15305409069360), Mini Core 3D Model (15305408610608), Mini Lawn Mower 3D Model (15305408315696), Mini Snow Blower 3D Model (15305407922480), AC Power Cord (15305403334960), Anti-Slip Studs (15305401925936), Baseball Cap (15305407136048), Battery Power Cord (15305403793712), Blower Module Cover (15305405759792), Bluetooth Antenna (15305399894320), Core Cover (15305400287536), Data Center (15305401106736), Docking Station (15305403171120), Flexible RTK Antenna Mount (15305398550832), HaLow Antenna for Data Center (15305399664944), HaLow Antenna for Rover (15305399042352), LMP Module Cover (15305406054704), Lawn Track (15305400910128), POE Power Adapter (15305399435568), Remote Controller 2024 (15305405497648), Scraper Bar (15305402908976), Shear Pins & Cotter Pins (15305402155312), Smart Assist Module (15305409691952), Smart Assist Module Cover (15305406710064), Snow Blower Module Cover (15305406316848), Snow Plow Blade (15305401762096), Snow Shovel (15305399271728), Snow Track (15305400779056), Straight Blades & Bolts (15305403990320), T-shirt (15305407496496), Tow Hitch (15305401598256), Track Grease (15305400484144), Weighted Side Plate (15305409397040), Wired Charger (15305400090928).

### 4.4 Beatbot rebuild (Phase 4, highest standard)
The existing Beatbot template (`product.beatbot.json`, sections `bb-*` and `bt-*`) is **off limits as a reference**. Do not reuse, extend or patch it. Build new.

Products (all Shopify Collective, all on template suffix `beatbot`, all already in `robot-pool-cleaners` via product type):
| Product | ID | Note |
|---|---|---|
| Sora 10 | 15335789461808 | 3 photos |
| Sora 30 | 15335789691184 | 3 photos |
| Sora 70 | 15335784251696 | 3 photos |
| AquaSense | 15335789625648 | 5 photos |
| AquaSense 2 | 15335789658416 | 6 photos |
| AquaSense 2 Pro | 15335789756720 | 7 photos, **0 supplier stock**, handle sold out cleanly |
| AquaSense 2 Ultra | 15335789822256 | 9 photos |
| AquaSense X | 15335789789488 | 11 photos |
| Sora 30 + iSkim | 15335789494576 | 4 photos |
| AquaSense 2 + iSkim | 15335789723952 | 9 photos |

Steps:
1. Study and document for Afo the design system shared by `yap-y40`, `yap-y40p`, `yarbo-all-3-modules` (Kit Contents Grid), `yap-mowrator`, `yap-mowrator-accessory`, `yap-aiper`, `yap-aiper-accessory`, `hobot`: section order, hero, typography, spacing, image treatment, buy box (hand built; check for an existing custom-liquid buy form before "fixing" one), trust/support panel, specs, FAQ, "Why buy from Yard Automation Pros", reviews placement, and how shared sections + JSON templates + metafields connect.
2. Build `product.yap-beatbot` (plus a bundle variant if needed) in the draft theme with the same architecture: shared Liquid sections, product JSON template via `template_suffix`, metafields for product content, metaobjects for reusable FAQ, spec and warranty entries. CSS variables in `:root`, `{% if %}` guards, `{% schema %}` presets.
3. Copy for every Beatbot product in YAP voice, from Beatbot's official site plus synced data. Warranty stated exactly as Beatbot states it. "How to choose a Beatbot" guide and comparison table (pattern: `/collections/wybot`, copy in `snippets/yc-copy.liquid`), product FAQs. The current Beatbot descriptions (rewritten earlier on 2026-10-06) are factual but feature first; they need the voice rewrite.
4. Gallery: bring every machine to a full premium gallery from Beatbot's own site, with alt text.
5. `/collections/beatbot` does **not** exist. Creating it is a live write (needs Afo's yes). Match `/collections/wybot` and `/collections/aiper`: intro, trust bullets, choose guide, comparison table, common questions, consultation CTA (copy lives in `yc-copy.liquid` keyed by handle).
6. Homepage "The brands we carry": add a Beatbot tile matching the existing tiles exactly (check `templates/index.json` and `sections/yap-brand-panels.liquid`).
7. SEO: all 10 Beatbot SEO descriptions say **"continental US"**; change to contiguous once the shipping line is decided. Check every title/description against the format used by other products.
8. Delivery line: only from Beatbot's official shipping page. Then set it in `snippets/yap-buybox-trust.liquid` (the `delivery` case) and in `yd-facts`.
9. Warranty line in the buy box currently says "Beatbot manufacturer warranty, 2 or 3 years by model". This is not verified; check against Beatbot's warranty page and fix.
10. `snippets/yc-copy.liquid` `robot-pool-cleaners` intro still says "from Aiper, WYBOT and Betta"; add Beatbot when the Beatbot copy is done.
11. Give Afo preview links for every Beatbot page: `https://yardautomationpros.com/products/<handle>?preview_theme_id=188829761840`.

## 5. On hold (do not do without Afo)

- **Standard shipping line.** Two versions drafted. Version A (Collective ships free): "Free shipping on every order to the contiguous US." Version B: "Free shipping to the contiguous US on Yarbo, Mowrator, Aiper, Betta and HOBOT. WYBOT and Beatbot shipping is shown at checkout." Decided after the test order. If WYBOT and Beatbot ship free, `collective_ship_line` in `snippets/yap-buybox-trust.liquid` can be set. Note: WYBOT does not ship to Alaska, Hawaii, **Rhode Island**, US territories or PO boxes (`yd-facts`).
- **Collective shipping profile.** WYBOT and Beatbot variants (51) sit in the app-managed "Shopify Collective" profile (supplier rates, ships to AK, HI, PR, Canada, international). Moving them to the General profile ($0, contiguous US only) is possible but costs margin. Afo decides after the test order.
- **Compare-at on the 6 Yarbo trimmer bundles** (Y40 and Y40P: Leaf + Trimmer, Snow + Trimmer, Snow + Leaf + Trimmer have none; all other bundles have one).

## 6. Found but not fixed (need Afo's decision)

- `sections/yi-support.liquid` (Support Center, live): "outright returns carry a 15% restocking fee". Contradicts the policy (no restocking fee).
- Return condition: FAQ, Support Center and `yd-facts` say returns must be "unopened and unused". Not in the policy summary Afo gave.
- `snippets/yc-copy.liquid`: "Yarbo accessories and merchandise bought on their own, within 14 days" (policy says 30 days).
- Mowrator copy describes a person driving the mower by remote. That is what the product is, but it conflicts with the no-visible-operator rule; Afo should decide how to phrase it.
- ~~`templates/product.yap-y40p.json` "responds to every inquiry within 1 business day"~~: fixed in the draft (now "We reply to emails within 1 business day").
- **Found in session 2, needs Afo or the image pass:**
  - Blog `robot-mowers-large-properties-how-to-choose` has an inline image `4WD_RCLM_2.webp` with the alt text "Person relaxing controlling mower via remote". It likely breaks the no-operator rule. Look at it during Task 1 and swap it.
  - Blog `yarbo-lawn-mower-pro-review` says YAP is "an authorized online dealer" for Yarbo. Section 1 rule 7 says no. Left for Afo to confirm. It also quotes "$5,999", which may be stale.
  - Blog `what-is-the-yarbo-core-...` lists "Weight: 28 lbs" and a "Haul Module", and says "Ships within 3 to 5 business days". These look wrong next to the product data (10 to 14 days). Check them against Yarbo's site.
  - `/pages/faqs` body still says "Free freight shipping is included on robot mowers, snow blowers, and pool cleaners". For WYBOT and Beatbot this depends on the checkout test.
- About 30 older templates that **no product currently uses** carry a Judge.me grid with `show_sample_reviews: true`, "100% American Owned and Operated", "30-Day Satisfaction Promise" and the 1 business day promise. Harmless while unassigned; do not assign any of them to a product without cleaning them first. In-use templates: `beatbot`, `betta`, `hobot`, `wybot`, `yap-aiper`, `yap-aiper-accessory`, `yap-mowrator`, `yap-mowrator-accessory`, `yap-y40`, `yap-y40p`, `yap-yarbo-accessory`.
- WYBOT bundle titles use "Bundle-" with a hyphen, and one has a double space ("Bundle-S2  & F1").
