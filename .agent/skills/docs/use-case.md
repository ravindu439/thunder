# ThunderID Use-Case Documentation

A use-case section (`docs/content/use-cases/<pattern>/`) answers one question: "is this my problem, and if so, how do I solve it with ThunderID?" This reference defines the shape that answers it, the traps that wreck it, and a rubric to score it. It does not replace `new-page.md` (scaffolding), `edit.md` (verified writing), or `review.md` (structure/style/tech) — those handle each page's mechanics; this handles the shape of the whole section.

## Usage

Read when asked to create, restructure, or audit a use-case section, or rate one against a quality bar. If unclear whether it's a build or a review, ask. **For an audit, read every page in the section fully first** — never score from memory or a partial read.

---

## The Target Shape

Up to eight parts, in order. Some share a page; treat it as a menu, not a mandatory checklist (part 6 is often redundant).

1. **Title = the problem**, not the solution's name. "Secure Consumer Access to Your Application," not "B2C." A persona or product-category title is a solution label wearing a problem's clothes.
2. **Situation** — open on a concrete example told as a **third-person story** ("A customer signs up for a restaurant-booking app, books a table, and comes back a week later to change the date after resetting a forgotten password. Every action calls the backend, and each has to know who the customer is and what they're allowed to do."). Not second-person assignment ("You're building a booking app…", presumes the reader's app) and not an abstract role ("As a developer building…"). This named scenario is the section's running example, threaded onward.
3. **How it works + routing away** — still on the overview, right after the problem. A "How It Works" section giving the vendor-neutral solution *shape* (diagram + a few sentences: the app hands sign-in to an identity layer that issues a token the APIs trust), then a `:::tip` routing readers whose real problem is a sibling pattern (organizations → B2B, agents → AI). This replaces a "Who This Is For" fit-checklist (its bullets end up being capability statements; the scenario + routing already establish fit). Routing rules: one `:::tip` bullet per alternative, each linking a real existing page; omit an alternative that has no page yet rather than admitting the gap in reader-facing text.
4. **Build it in the product** — the concepts page. References the overview's shape, then builds real product concepts from an empty instance, one at a time, using one running example. Open it with a whole-picture **how-it-works diagram** as an advance organizer. This step and the manual build (part 6) can be **one theory page, or a fused multi-page learn-and-build tutorial** (Option A + builder audience) — see "Don't Strand the Concept Page."
5. **End-to-end flow** — the flagship sample gets its full treatment: cast, architecture, real payloads, walkthroughs, and actually running it, even if the concept page already used its vocabulary. It earns its place through what names alone can't carry.
6. **Implementation path** *(often redundant — default to dropping)* — a separate "implement it in your own app" page duplicates the sample's per-journey walkthroughs (part 5) and the SDK quickstarts. Keep only if there's real your-own-app-specific content (a distinct setup, a migration) neither covers. To remove an existing one: delete its pages + sidebar category, repoint every inbound link, and drop (don't duplicate) any repoint that would collide or self-link.
7. **Design decisions & alternatives** — at the **end**, framed retrospectively ("the reasoning behind what you saw, and what to pick when your constraints differ"), not "decide these five things before you configure anything."
8. **Expected outcome** — a short close: what the reader now has, and where a part-7 decision can be revisited without unraveling the rest.

### Put the solution shape on the overview, not its own page or the concepts page

Put a brief vendor-neutral shape on the overview right after the problem: a diagram + a few sentences (app hands sign-in to an identity layer that issues a token the APIs trust) plus the one non-visual insight ("the identity journey runs once per sign-in, the API calls on every request after"). This gives the overview a useful back half, puts the solution on page one, and lets the concepts page reference the shape instead of re-deriving it. **Keep it short** — never a per-component prose tour; at that length it belongs nowhere in the funnel. Don't put an abstract architecture on its own page (a builder must clear it before any product specifics) or at the top of the concepts page (already the heaviest).

### Open the concept page with a plain-language how-it-works flow, then build the parts

A reader needs the map before the territory. Open with one whole-picture diagram of **how the solution works at runtime** — a plain step flow (customer signs in → token issued → API checks it) or, better, an interaction between the real parties (app, identity product, backend API passing a request back and forth). Then build each concept in its own section.

- **State the flow as a fact; let the diagram's position frame it.** A whole-picture diagram at the very top already reads as a map; one terse pointer ("each section below builds one piece") is the entire preview signal. Don't dress it up ("here is the whole thing in one view," "this page walks through each piece") — that's page-narration.
- **But don't state it cold either.** Reciting the concrete chain as the first sentence dumps every product noun at once ("an application starts a flow, the flow verifies the user and attaches the role…") and reads as strange. Open instead with a smooth concrete sentence naming what the page does + the example ("This page builds a consumer access solution in `<ProductName />` from an empty instance, one concept at a time. The example is the booking app from the overview, now with a small staff team"), give the diagram a one-line lead-in, and let the diagram carry the flow.
- **Don't float product nouns as a bare chain** ("Application → Flow → User Type → Role → Token → Resource Server"). Fix it two ways: **label request/response arrows in plain words** ("sign-in request," "token with permissions"); and if you preview concepts, **contextualize them inside the product's box** (draw the identity product as a container holding "users & user types, roles, permissions") rather than scattering them along the chain.
- **For a builder audience,** route the request *through* those box components (sign-in → flow → verify user → role → permissions → token). Keep the order faithful to runtime — verify identity first, then authorize, then issue the token — and verify that order against the backend; a wrong order is a wrong claim.
- **The box shows only runtime concepts** (flow, users, roles, permissions that produce the token), not setup-only ones (an org-unit container never appears in a request) and not the external parties (the application is the client outside the box; the resource server is the API called). So call it "these concepts" or "the sign-in concepts," not "the concepts this page builds" — completeness is the sections' job.
- **Earn the second diagram by opening the box.** The overview already shows app/identity/APIs as black boxes; the concept-page diagram's only reason to exist is revealing what's *inside* the identity box. If yours would just redraw the overview's black box, drop it and open on the prose sentence.
- **Reconcile with the end synthesis.** Top = the how-it-works diagram (preview); end ("Putting It All Together") = each runtime step mapped to the concept that plays it, a decoded-token artifact, and the build order (payoff).

### Why design decisions move to the end

A reader who hasn't seen the architecture, concept mapping, or a working example has no context to weigh a tradeoff like "redirect vs. app-native." Decisions read as reasoning, not a checklist, only after the whole shape is seen once. The end also lets the closing tone be "revisit only what doesn't fit."

### Preview the path before the reader commits

The overview's closing "next steps" should list the actual upcoming pages by their real titles (verified against `docs/sidebars.ts`), not a vague "five pages," so a developer can judge the funnel's scope. If you name a technology here, pair it with why it matters (see Voice and Tone).

### Don't hide the overview behind the category title-link; make it a visible leaf

A Docusaurus category can attach a doc as its `link`, opening on the category title. Don't make the substantive *overview* that linked page — it never appears as its own sidebar row and gets skipped. Instead: make the index (category link) a **light map** (one-line framing + cards to the parts), and give the overview its own **`overview.mdx` leaf** as the first item. Label that leaf to **match the section's casual action-verb series** ("Understand It" beside "Build It" / "See It"), not a flat "Overview"; keep the file/URL `overview.mdx` (stable) even when the label differs. Point inbound "the pattern" references at the overview leaf, not the map. **Always register a new page in the sidebar in the same change that creates it** — an unregistered page is an orphan CI flags.

### Sidebar labels must imply the reading order and stand on their own

A reader should infer the section's order from the labels alone (learn → see → decide). Two failures:
- **No internal codename in a nav label.** "See Wayfinder" names the sample before the reader has met it. Label the nav by what the page *is* ("See It in a Sample App") and introduce the proper noun in the page body. **Nav labels are descriptive; page bodies may use the proper noun** — the one place a sidebar label deliberately differs from the page title (so "link text matches title" doesn't apply).
- **Alternatives worded as if sequential.** Pick-one-of-two pages ("Set Up Sample" then "Configure It Yourself") read as step 1 then 2. Signal the either/or with a shared prefix ("Set Up: Import a Bundle" / "Set Up: Configure Manually"). Order-independent siblings (Login, Sign-Up, Recovery) need no such signal — don't manufacture a false sequence either.

When a label is set in both `sidebars.ts` and page frontmatter `sidebar_label`, set both to the same value.

---

## The Running Example: Generic, or the Flagship Sample Itself

The concepts page needs one running example threaded through every section. Two choices, a real tradeoff — it decides whether the concept page and the sample page feel like one story or two.

- **Option A — the flagship sample's own vocabulary (tightest connection, default lean).** Teach with the sample's exact type/role/resource names, so the sample page reads as the concepts made real with no "these are connected" sentence needed. Two honesty checks: use the sample's *type/role/resource* names but not its named *people* (name a `Customer` user type, not "John Doe"; the cast debuts on the sample page); and the sample page must still earn its place via cast, real payloads, architecture, and running it. Reach for A when a reviewer says the two pages "don't feel connected."
- **Option B — a generic example in a *different* domain (max reusability).** A restaurant-booking example when the sample is travel, with generic names. Keeps the concept page vendor-neutral, but costs the connection: different vocabulary, so the reader must be *told* (via "Build it" links) that they map. Pick B only when reusable-teaching value clearly outweighs coupling.

Whichever you pick: keep the **same thread** across every section (don't invent a new example per section), and name a **concrete vertical** ("a travel-booking app: customers book trips"), not a faceless "an app." Under B only, that vertical must differ from the sample's domain.

- **Name the scenario once, up front, then thread it.** "The booking app has two kinds of people, so it needs two user types" (the scenario advancing) reads as one build; "A consumer product typically needs a user type for customers" (a generic statement in the example's vocabulary) reads as disconnected. Keep running identifiers stable across sections and diagrams (`booking-api` stays `booking-api`, not `example-api` three sections later).
- **Frame the example's choices by need, not arbitrary count.** "To let customers register themselves, a registration flow…" beats "the booking app adds three journeys of its own." Count-first framing ("adds three," "defines two roles") is a tell to re-motivate by need.

### Open each concept section with a segue that carries the previous concept forward

Each section begins by picking up where the last left off, framing the new concept as what the previous now makes necessary: "you have X, but X alone can't do Y — that's this concept." (A roles section opening "A permission is just a string until it's attached to a person, and doing that one at a time doesn't scale" earns the concept.) If section N ends with a forward-pointer to N+1 *and* N+1 opens with the same handoff, cut the trailing pointer — keep the opening segue.

- **A segue may reference a later capability as a *goal*, never as an *achieved state*.** "*Before* anyone can sign up, the system needs to know what a customer record looks like" (sign-up as a future goal) is fine. "A customer can *now* sign in, but…" asserts sign-in as done when its machinery comes four sections later — a bug that contradicts the later section that actually delivers it. Re-motivate using only what's on the table. When auditing, read each section's opening and confirm the capability it assumes was delivered *earlier*.
- **Diagrams count, and are worse for it.** A concept-build diagram may only use concepts already introduced. A node reading "Flow: default-flow" when Flows are the *next* section states a forward reference as bare established fact. Fix by swapping in an already-introduced fact ("Grant: authorization code + PKCE") or dropping it. Audit every diagram's labels the same way. Only the end synthesis may use every concept; only the plain-language opener (no product nouns) is exempt.

---

## Order Concepts by What's Immediately Relevant, Not Just What's Foundational

- **Don't open on a "you can ignore this" concept.** A technically-foundational container whose own explanation is "a single-business product never needs a second one" is a poor first beat. Place a concept where it's about to matter, not where it's load-bearing in the data model: if container A only resurfaces at the concept that registers a client app, put A right before that concept. (Moving A later may add a forward reference if A's explanation names a later concept — usually an acceptable trade. Anchor slugs come from heading text, so reordering doesn't break cross-page links; grep for anchor links first anyway.)
- **For two mutually-referential concepts, introduce the self-contained one first.** A flow is self-contained (a journey of steps); an application isn't (it's "the thing that starts a flow and receives its token"). So flows first, applications second — even if the reader's mental model puts "my app" first. This aligns teaching order with build order and the summary list.
- **When a forward reference keeps needing patching in diagrams/segues, reorder instead of patching.** If you keep swapping a diagram label to dodge a not-yet-introduced concept, the two sections are probably in the wrong order; reordering lets the diagram state the real relationship. Bigger edit (rewrite both opening segues, re-audit the newly-first section for references to the now-later one), but correct when the same forward reference surfaces more than once.

---

## The Concept Page Owes "What" and "In What Order", Not "How"

One altitude, two failure directions:
- **Down — diving into mechanism.** A section describing a concept's internal wiring (which node types wire to which, what fields a record stores) has dropped below altitude. Reframe mechanism → capability: "a flow can offer several sign-in methods, or require a second factor," not "a prompt node shows buttons, each routing to an authenticator node, and chaining two requires both before a token issues." Same fact one level up — what you can compose, not how it's wired. This often doubles as the differentiation pitch. Keep it positive (what the mechanism does), not negated.
- **Up — never touching the ground.** A page that explains every concept purely abstractly and never says *how* a reader creates these (console, API, config file) leaves them unable to act. One orienting sentence near the top: "you create each of these through the console, the management APIs, or a declarative config file; this page is the *what*, the next pages the *how*." Verify which mechanisms actually exist first.
- **Name the altitude in the intro.** Say the page shows how to build the solution *at a conceptual level* — what each concept is, why it exists, how each builds on the last, with exact steps deferred — so the absence of copy-paste steps reads as deliberate. Say it once; don't restate the split lower down.
- **Order is part of the "what."** When object A must exist before B references it, state the dependency order and *why* ("the resource server has to exist before a role can grant its permissions"). Verify it's enforced at creation time, not merely conventional — only a hard-enforced order is stated as hard. Make any end-of-page summary list match it.

## Sell the Differentiator Where Its Concept Lives

A use-case section is read by prospects evaluating the product. When a concept is the product's strongest differentiator (a composable flow model), state the capability so its *reach* is visible ("a flow can do more than a basic sign-in: several sign-in methods, multi-factor, consent"). Not marketing — no superlatives, competitor names, or "unlike other products"; the best version is indistinguishable from just explaining the concept accurately. **Frame it positively, by what the one mechanism does, not by negating a rival** ("not a separate feature to turn on," "not a global setting" reads defensive and becomes a tic across bullets).

---

## Don't Strand the Concept Page, but Don't Merge It Away Either

A purely conceptual page reads as slideware; the fix isn't to fuse concept + implementation per concept, because **concepts and implementation sit on different axes**: concepts are a taxonomy (user type, role, resource server, flow), implementation is by journey (add login, sign-up, recovery). They don't map one-to-one — a per-concept "+ implementation" section is thin for foundation concepts and duplicated for journey ones.

Diagnose the axis before bridging:
- **Foundation concepts** (containers, schemas, permission definitions, roles) are set up once. Bridge = a plain link to the primitive's reference + the page-level "created via console/API/config" orientation.
- **Journey-shaped concepts** (flows, the actual sign-in/sign-up/recovery) *are* the implementation axis. Bridge = a direct pointer at the concept to the specific per-journey walkthrough and the running sample.

Two strong shapes, chosen by whether concept page and build share an example:
- **Separate pages, coupled by pointers** — preserves a fast model skim and a clean build reference. Right default under **Option B** (you can't interleave "what a role is" with "create the `Traveler` role" when the theory says `Customer`).
- **A fused, interleaved tutorial** (theory on top of each page, the build step below, across several short pages) — more actionable, the better choice under **Option A** (vocabulary matches, so "what a role is → the call that creates the `Traveler` role" is one motion). Usually what a builder-audience section wants.

**Fused-tutorial requirements** (or it regresses):
- **Multiple short pages, never one wall** (one page carrying all theory + all build is the 900-line monster this whole reference fights).
- **Each page is one learn-and-build beat that ends with something built** (model the users → build the two user types).
- **Theory tight, build visually distinct** (skimmable prose, Steppers/code to dip into) so an evaluator can skim concepts and a builder can run steps.
- **Order pages by build dependency** (create the user record before the page that grants it a role).
- **Advance organizer on the landing, not the last page.** The tutorial category gets a short landing (its `link` doc) with a whole-picture map + the ordered list of what each page builds. The landing's map is a **structural "what you'll build" diagram** (the product entities — user types, resource server + permissions, roles, flows, application — grouped by concept, edge labels that imply each relationship), **not the runtime journey**. Use plain read-aloud verbs forming "Subject verb Object," not jargon: application `starts` a flow, `only signs in` a user type (not "runs"/"admits"); a flow `creates` a user; a user `gets` a role (not "assigned"); a role `grants access to` the resource server.
- **When the section serves two user types with differently-shaped journeys, split the map into one diagram per perspective.** A single graph carrying both a self-service consumer path and an invitation/admin path comes out lopsided (one actor's flow has no app, one role set points nowhere). Two focused diagrams read better, and the split implies distinctions for free (the customer app is customers-only; staff are least-privilege). Give each a one-line lead-in ("Customers arrive on their own…", "Staff arrive by invitation…").
- **The runtime view belongs on the last page, as a temporal sequence diagram** — one request traced through every built piece (customer → app → identity layer → app → API) with `autonumber`. A sequence diagram is the one shape that shows *time*, distinct from the structural maps. Don't pair it with a prose table re-narrating the same sequence. Place it here only, never also on the landing (duplicates it, and breaks "landing map is structural"). This is where protocol detail belongs: trace the real round trip (auth-code redirect, PKCE code-for-token exchange, signature check at the API), verified against the build pages, not a glossed "runs the flow, gets a token"; keep the landing maps lean.
- **End the section, don't just stop.** The last page is the tutorial's close: the runtime sequence, then the one clicking artifact (the token decoded — "minted once at sign-in, carries the role's permissions, presented on every call"), then a short **outcome recap framed as capability, not a parts list** ("customers sign themselves up… a role gates the API… your app stores no passwords"), then the **forward paths** (see it live, the design-decisions page). A parts-list recap just duplicates the landing map.
- **Keep the parts-map honest about non-connections.** If staff roles never grant booking permissions, don't draw that edge for symmetry. And **don't let a secondary/optional journey converge into the main provisioning chain** — if registration `creates` → `gets` role → `grants` access, and recovery *also* arrows into the user node, it reads as if recovery grants the role. Branch such a flow off with a dotted edge and its purpose in the label ("app `also offers` account recovery"), off the create-role-grant spine.

**Signal the reader's real goal is their own app, not the sample,** in two places: a note at the tutorial's *entry* (the identifiers here are the sample's, swap in your own) so a builder isn't reverse-engineering which values are sample-specific; and, in the *application/client-registration* section (where connecting a frontend is the subject), a pointer to the SDK quickstarts. Keep both plain: "your own app registers the same way; its code talks to the product through an SDK instead of a hand-built OAuth2 flow." And **every tutorial page owes its concept framing** — *why* staff roles are narrow, *why* onboarding is invitation-based — not just steps.

**Couple, don't merge, when a real step-by-step build page already exists** (a "Configure It Yourself" against the sample). Give each concept section a tight **Build it** pointer to the *exact step* that creates it, phrased for that concept ("**Build it:** create the resource server in [Set Up the Foundation](...#set-up-the-foundation)"), not a generic "see the setup guide." The anchor may repeat across concepts one step creates together (vary the verb/noun, never copy-paste the sentence). Foundation concepts that create nothing (an org unit already on a fresh instance) get no Build-it line. Name **both paths once** in the intro: the step-by-step build and the finished-outcome shortcut (importing a bundle). Give the build page a **reciprocal pointer** back. Note the intro must say the build steps stand up the named sample (so the concept's `Customer` role built as the sample's `Traveler` isn't a surprise).

**Present the build page with a Stepper** per phase (so it reads as discrete steps, not a wall of numbered lists with buried code). Keep **phase headings at the level the Build-it links target** (Steppers preserve the heading id, so anchors keep resolving); put the Stepper inside each phase. Every step needs a short imperative title (summarizing an untitled instruction sentence into a title is editorial tightening, not invented content).

**Make the build page self-contained** — inline the shared prerequisites (environment, running the platform, downloading the sample) rather than bouncing the reader to a sibling page to "do steps 1-3 there, skip 4, come back." A little duplication across siblings beats an interrupted build path.

**Better: consolidate the sample section onto one page.** Collapse the sample's intro (cast, architecture) + its two setups (import-a-bundle vs. configure-by-hand) into the single "See it in a sample" page: architecture where the reader sets up, environment stated once, both paths side by side. **Order so the quick path runs contiguously and the long alternative goes last**: environment (once) → import the bundle → run the sample → walkthroughs, then the long configure-it-yourself section at the end with a one-line pointer back up. Do **not** put the 700-line manual path in the middle — that strands "run the sample" after it. Keep the two-paths sentence plain ("Import the bundle to create them all at once, or configure it yourself to build each by hand"); skip the AI-scaffolding "Two paths reach the same result… you only need one." When merging: (1) preserve heading slugs the concept page couples into, and don't hide manual steps in a collapsed `<details>` (fragment links into collapsed content don't scroll reliably); (2) content moves up one directory level, so mechanically drop one `../` from every relative link.

**Nest the long alternative in the TOC.** After a merge the manual sections can become top-level `##` siblings, so the TOC reads as one flat list. Demote them one level (`##` → `###` under the `##` Configure-it-yourself parent); if they contain Steppers, push per-step headings `h3`→`h4` too (the doc TOC shows only `h2`–`h3`, so micro-steps drop out while section headings stay). Slugs come from text, so demoting doesn't change anchors (re-verify). Don't create a **skipped level** — only push steps to `h4` where the section sits at `h3`.

**Per-concept reference pages** are right only once each primitive carries enough depth that one page would bloat (mature reference docs converge there).

---

## Bullets vs. Prose: Match the Information's Shape

Shape call, not a leanness call. **Prose** fits one continuous idea or narrative; **bullets** fit multiple distinct parallel items ("N stakeholders/areas, each with a different specific problem"). Cramming parallel items into sentences just moves the untangling onto the reader.
- **Tell:** "Support needs X. Product wants Y, Engineering needs Z…" is a list wearing a sentence. Convert to one bolded bullet per item + its specific friction.
- **Colon-then-comma-list** ("raises an identity question: who is this, are they who they say, what can they do, can you trust the request?"): when the trailing set is parallel and is the point, promote to bullets. The lead-in must be **specific** ("raises the same identity questions:"), not "there are several things to consider:".
- Leanness comes from cutting *duplicate* lists, not from disguising list-shaped content as prose. One tight bullet list is lean; three run-on "who needs what" paragraphs aren't.

**Problem-section conditions** (the overview "situation," the most common offender):
- **Frame each item as a requirement/challenge, not a stakeholder's need.** "Account recovery. Customers forget passwords, so you need a self-service way back in…" is universal; "Support needs…", "Security needs…" presumes an org chart the simple example doesn't have.
- **It's bullet-shaped** — one bullet per challenge, a short bolded label (**Account recovery.**).
- **Each bullet states one specific, distinguishable challenge** ("password resets fill the support queue"), not a restatement of the theme ("needs better identity management"). If two bullets could swap and still make sense, they're not specific enough.
- A short lead-in and closing sentence are fine; don't also keep a separate paragraph re-summarizing "the real problem is coordinating all this."

**Apply the test per paragraph, not per page or diagram.** A "cast of components" intro (five entities, each a one-line role) is bullet-shaped; the paragraph on how they relate (once the diagram carries the relationships) is usually one prose insight. Re-run the test on each paragraph.

**As a diagram gets self-sufficient, trim the prose, don't reformat it.** Once a diagram carries labeled edges/boundaries, accompanying prose usually duplicates it. Cut it, keeping only a *domain-specific* surviving insight — check it isn't just true of software in general ("the customer only ever talks to the application" is true of nearly every client-server system, so it says nothing). If no such rule survives, let the diagram be the section's last word. Re-check the prose every time the diagram changes materially.

**Re-scan the whole page for a fact repeated at the *same level of detail*.** Summary-then-detail is fine (a one-line bullet pointing at a fuller section); the same *depth* stated in three places isn't. List every non-trivial fact and where it lives; keep the full nuance in one place and a bare pointer elsewhere. (Shared vocabulary ≠ same fact: "Protected APIs limit abusive traffic" [preventive] and "Observability surfaces anomalies" [detective] are different capabilities.)

**Check for unpaid promises across pages.** When the abstract page states a specific claim as its own bullet ("which methods are offered is a policy decision," "captures consent, tied to what was approved"), that's a promise the concrete page must *pay off* by showing what it looks like — not just cover adjacent ground. Walk the abstract page's bullets and ask, for each, "does the concrete page show *how* this happens?" A well-written page can still fail here; nothing else catches it. While reconciling, re-verify the abstract wording against what's concretely true (a promise can be framed vaguer than reality: "tied to the terms the customer agreed to" implies a TOS checkbox; the real mechanism was a per-application, permission-scoped grant with its own expiry).

**After trimming a summary, check it still earns its place.** Trimming can overshoot into tautology ("Customer application: the client the customer uses"). Don't add the enumerated detail back — reframe around a *new angle* the detail sections don't state (trust boundaries: who sees what, what each component never touches).

---

## Voice and Tone

Structure can be perfect and the section still fail if the sentences are condescending, generic, or padded. Apply on every pass.

- **Anchor the situation in the reader's active role.** "As a developer building a customer-facing app, you need customers to…" beats "You operate a customer-facing application." Put the reader in motion.
- **Open a concept section by showing the need, not commanding.** Not "Start with the people" (a command that skips the *why*), and not the filler fix ("Everything is built around people, so that's where it begins" — "is built around," "at its core" state ordering abstractly without teaching). Lead with the concrete precondition: "Before anyone can sign up, the system needs to know what a customer record looks like." (Imperatives are correct on the step-by-step walkthrough pages, not here.)
- **Keep one voice.** Once a section opens in second person ("you need…"), don't drop into third-person textbook ("Consumer applications usually grow…") — the register shift reads like two authors. Check every section against the opening voice, not just the next one.
- **Frame sibling-use-case pointers as a conditional recommendation:** "**If [concrete condition in the reader's terms], see [sibling] for [the full pattern].**" Lead with the *if* ("If your product spans multiple separate organizations that each need their own users and config, see Multi-Tenant SaaS Identity"), not a flat description of the other pattern.
- **Don't strand a preposition at the end of a long relative clause,** especially in a gloss. "the user the application is asking on behalf of" makes the reader hold "on behalf of ___" to the last word; use "the user *on whose behalf* the application makes that request." (Short natural terminal prepositions are fine — "not the customer using it.")
- **Avoid "It's easy to think X is just Y, but actually Z"** — it presumes a naive reader. State the fact: "The sign-in screen is only the entry point."
- **Cut filler, don't just shorten.** "to be able to" → "to." Reread hunting for it specifically.
- **No unnecessary long lists (hard, site-wide).** Inline example-lists carry two or three items ("such as X or Y"), not four-plus. Carve-outs: a load-bearing enumeration where every item is the point (`read`/`create`/`cancel`), and real bullet lists. First check for nearby duplication — if the journeys appear as bullets right below, drop the inline "such as signing in, signing up, recovering access, or onboarding staff" entirely.
- **Split a sentence carrying two embedded lists.** Break at the boundary between naming and describing, shortening each list to two examples: "Each journey the app offers, such as sign-in or recovery, has its own flow. A flow's steps are screens that collect input and the actions behind them, like verifying a credential or assigning a role."
- **Don't repeat a salient word in close proximity** ("create a customer-facing application, customers need to create an account"; "change the time, this time"). Reread across sentence joins.
- **Prefer a general accurate claim over a stale enumerated list.** "SDKs across common web, mobile, and backend frameworks" beats "SDKs for React, Next.js, and Vue" (undercounts, goes stale) — unless the set is genuinely small and fixed (redirect vs. app-native). Give the real fallback, framed as a choice: "call the APIs directly for full control," not "…if yours isn't covered."
- **Describe the payoff at the system's scale,** not one artifact. A "by the end you'll have X" teaser should say "working flows, roles that define access, APIs that trust requests," not "a decoded token" (which undersells a multi-page section).
- **Name a technology only with a reason attached.** "It's standard OAuth2/OIDC, so your team's existing tooling and knowledge likely already apply," not a bare "runs on OAuth2/OIDC with SDKs for React, Next.js."
- **Don't repeat a transition phrase verbatim across subsections** ("Concretely, it:" six times) — a topic sentence + bullets needs no connector; cut it, don't vary it. Same for parallel bullets that all *end* on "…, not a global setting" / "…, not a separate feature" — keep the contrast on the one bullet where it lands, state the rest plainly.
- **Read aloud; kill nominalizations and clause pile-ups.** "This is the concrete form of the policy decision" → "when you build the flow, you choose which methods it offers." Rewrite around the verb (arrange/enforce/configure/decide). Break sentences you run out of breath reading.
- **Don't assert a false equation to name a concept.** "Those decisions are consumer access" equates decisions with access. Insert the connecting verb: "handling those decisions is what consumer access means." On the overview bridge, prefer forward-looking "what it takes to build" ("handling those questions is what it takes to build a consumer access solution") over a backward definition.
- **Don't refer to a concrete thing with a vague placeholder noun.** "Can you trust the request that carries the answer?" — *what* answer? Name the referent: "can you trust that a request really came from them?" (Watch for it after rewording to dodge a technical term.)
- **Cut sentences that narrate the page** instead of stating its content. Four flavors: scope preview ("This page lays out the architecture: the components, how a request moves…"), scope caveat ("None of this is product-specific yet" → reframe as the insight: "Strip away any one product's specifics and every consumer access solution follows the same shape"), writing-formula narration ("Each section introduces exactly one new concept, explains the problem before naming it…"), and how-to-consume narration ("read a concept, build it, move on"). **But don't overcorrect into a fact-dump** — the middle is a smooth one-sentence description of what the page does + the example laid out. When a self-sufficient diagram sits there, let it carry the relationships; don't recite them in prose.
- **Open each page with a segue from the previous one, not a jump ahead.** Save the forward pointer for the closing Next Steps. Keep the segue flat, not a narrative callback ("You've seen the problem… This page covers…"). Don't re-list the previous page's content to segue — a one-clause reference + link does it. Define a page by what it *does next*, never by what it *isn't* ("uses a generic Customer/Staff setup," not "not the flagship sample").
- **The overview opens on a concrete scenario** (third-person story), not an abstract role and not pure abstraction ("Your customers create an account…" with no named example gives nothing to hold). Change a presumptuous opening by fixing the *person* (second → third), not by stripping the example. Keep the overview's domain matching the concept page's (same under Option A). **State the scenario, don't announce it** — "A customer signs up for…", not "Imagine…", "Picture…", "Say you're…". **Make it do work:** use it to expose the hidden complexity and plant the section's pillars — "To the customer it's just using the app. To your backend, every action is an identity decision: who is this, are they who they say, what can they do, can you trust the request came from them?" (those four questions = identity, authN, authZ, API trust). A benign narrative earns recognition; reframing the benign as deceptively hard earns attention.
- **Calibrate warmth to the funnel position.** The overview can carry conversational warmth (it's still persuading). Deeper pages (architecture, concepts) are read by the committed — flatter, matter-of-fact. It's *stacking* conversational devices on a reference-heavy page that reads as blog.
- **Don't diminish the product with belittling quantifiers.** Cut "a small set of rules," "just a few options," "a handful of settings" — make the reference definite and let the list speak ("the rules `<ProductName />` enforces on its behalf:"). "just/simply/merely" also diminishes the *mechanism* ("a journey is just steps you arrange" undercuts a composable model) — lead with the payoff instead ("arranging steps is where a flow gets its range").
- **A confident, earned claim isn't automatically promotional.** "Call the APIs directly for full control" is fine; only flag actual hyperbole/superlatives ("unparalleled," "seamless," "effortless"). Don't sand a true sentence blander because one word pattern-matches marketing.

---

## Diagram Design

Diagrams belong where structure or process needs visualizing. Hold the line at **one shape diagram in the overview's How It Works** (not in the problem-framing above it, which stays prose); per-concept diagrams live on the concepts page.

### The solution diagram must let the reader say "this is what I'm building"

- **Each box states its *job*, not just its name** ("Identity layer · runs sign-in, sign-up & recovery, issues a token," not "Identity layer"), and the round trip is legible (app hands off sign-in and gets a signed **token** back → token to the APIs → APIs trust it and check its permissions). If a reader can't narrate the picture, it's too thin.
- **Don't reduce the identity layer to a directory.** Drawing two co-equal auth boxes ("built-in directory" + "external providers") understates it. It's the centrepiece: runs the journeys, manages accounts/profiles/roles, adds MFA, issues tokens. External login is *one optional way to verify at sign-in* — hang it off the layer labelled "optionally delegate sign-in," not a co-equal sibling. Mirror in prose: lead with the full sweep, then "check the credential itself, or delegate to a provider; either or both."
- **Fill the identity-layer box with real product-level jobs**, not a low-level feature catalogue (Authenticate: password/passkey/MFA… reads as a "feature dump") and not a generic auth mechanism ("verify who they are → look up what they can do → mint token" describes *any* login, not this product). Use the jobs the section actually builds, each mapping to a build page: **runs the user journeys** (sign-in, sign-up, recovery, onboarding) *as flows*; **manages the accounts** (customers and staff); **assigns permissions** *through roles*. List ~three job statements (bold verb-phrase + plain detail); they're parallel responsibilities, don't chain them with arrows; keep lower-level detail (credentials, MFA, consent) out — that's the build pages. Test: every line names something the reader will build or use.
- **Highlight the pieces the reader owns and wires** — the customer application and the identity layer get a shared accent (primary border + faint tint); customer, providers, backend APIs stay neutral. The accent is a legend without a legend.
- **Number the steps when the diagram is a sequence** (badges 1–4 on flow labels); leave optional branches unnumbered so they read as asides. The prose should walk the same numbered beats.
- **Make the token a first-class artifact** — its own accented node on the path out of the identity layer, labelled with what it carries ("signed token · carries their permissions") and where it's born ("minted by the identity layer at sign-in"). Two points readers ask: (1) the identity layer mints it, at sign-in — a provider may *verify* but never issues the app's token, so keep the provider on a "verify only" branch off the token's path; (2) the same token the app receives is the one it presents to the APIs.
- **Every diagram gets a one-sentence intro** — no bare jump from heading to `mermaid` block.
- **Avoid edges that cross because two unrelated nodes share a rank.** Fix the rank, don't nudge labels. Often the real flow gives the fix free: a cross-cutting concern ("Operations") *receives* from what it watches (rank it after them), not reaching in from a shared rank.

### Density and shape

- **Density over fragmentation.** A diagram earns its place only if it makes a fact take *less* effort than the sentence. Collapse node-per-attribute into one node with a multi-line label; don't make the reader trace three arrows to reconstruct "the Customer type has these three fields."
- **Edge labels are complete phrases** ("Authenticates the customer."), not clipped fragments ("authenticates via"). If full labels start colliding, the diagram needs fewer edges, not shorter labels.
- **Shape must match meaning:**
  - A **process/flow diagram** uses flowchart grammar (stadium/pill for start/end, rectangles for steps, a distinct shape for system logic vs. a screen). Mermaid's generic icon-node feature breaks this (every node the same shape) — reads as an icon grid, not a process.
  - Icons aren't the problem, *replacing the shape vocabulary* is. A hand-built diagram can add an icon *inside* a shaped node (pill for actor, rectangle for system, dashed border for a cross-cutting concern) and improve a process diagram. Keep the shape distinctions; the icon is additive.
  - A **concept/entity diagram** has no process grammar to violate — icons/denser labels can help. Don't migrate concept-diagram icon styling into a process diagram; re-evaluate per diagram.
  - **One shape, one meaning,** even in a static diagram. A cylinder reads as "datastore" — don't use it for both an internal DB and an external service the system merely calls (a stadium/pill for the external boundary carries "internal vs. external" in the shape).
  - **A diagram label can introduce unglossed jargon**, and it's worse there (no room for a gloss/link). "Verifies credentials or federates" → "hands off to an external provider."
  - **A prose hedge can be wrong on a diagram label if the arrow shape contradicts it.** "validates locally, or by asking the identity layer" pasted on a self-loop (`API->>API`, meaning "acting alone") now contradicts the shape. Drop the qualifier from the label (state it generically), let prose carry the conditional.
  - **Icon matches the verb the prose already uses** — if a component "watches" the system, an eye, not a pulse/`Activity` icon (which reads as analytics).
- **Color:** no per-diagram overrides — it's one site-wide theme (`themeConfig.mermaid` in `docusaurus.config.ts`); confirm with the user before changing shared config, and use the project's *verified* palette. With mermaid's `base` theme, **pin every visible variable** (`primaryColor`, `primaryTextColor`, `primaryBorderColor`, `lineColor`, `secondaryColor`, `tertiaryColor`, `edgeLabelBackground`, and the sequence equivalents `actorBkg`/`actorBorder`/`actorTextColor`/`signalColor`/`signalTextColor`) as one low-saturation set — unset ones get auto-derived to something jarring. One `themeVariables` object applies to both light and dark mode, so use a subtly-dark "card" palette that reads on either.
- **Keep connector style consistent** — if most edges are smooth curves, don't route one as a right-angle polyline to dodge an obstacle; use a Bezier with control points pushed clear.

### Layout and routing

- **Show the round trip, not just the outbound call.** If a component gets something back (a token, a response), show both directions — a bidirectional line or two parallel lines. Omitting the return is an accuracy gap.
- **Route a round trip as two parallel lanes, not one straight chain plus a big return arc.** When an artifact (a token pill) sits between two boxes: request along the top (app → identity layer), response along the bottom with the artifact on it (identity layer → token → app), stacked and parallel. If the artifact blocks the top lane, nudge it down a few px. A straight line paired with a swooping one reads as a mistake.
- **A relationship that observes rather than calls needs no arrow.** A cross-cutting "watches" node (observability) is containment, not flow — if routing it keeps dodging other nodes, that's the signal it was never arrow-shaped. Draw a dashed boundary around what it observes, with a tag, no arrows. (When a connector genuinely does call and must dodge, exit a *different* edge of the source than its siblings and use a clear Bezier.)
- **When swapping a diagram's implementation, re-check the prose for now-stale visual descriptions** ("the user directory is drawn as a database because…" is false once the new diagram uses one card shape for every node). Hunt for sentences describing *how the diagram looks* vs. *what the architecture does*.
- **Know when to abandon mermaid for a hand-built diagram.** Mermaid can't cleanly lay out a wide container-with-internals plus back-and-forth request/response arrows — edges tangle and you don't control routing. After two or three messy rewrites, hand-build a React/SVG component (absolutely-positioned Oxygen UI `Box`/`Typography` cards + an SVG connector overlay). Reserve it for a page's *main* diagram. **Place a client that talks to two independent backends in the center as the hub** (app between identity product and resource server) so the two real relationships each get a short uncrossed connector and no false B→C link is drawn.
- **Custom HTML/SVG diagrams scale to fit width, not just scroll.** Measure the wrapper with a `ResizeObserver`, `transform: scale(...)` capped at 1, and fall back to horizontal scroll only below a min scale (~0.55) where labels would go illegible. **Balance the aspect ratio** — a wide, short canvas scales tiny with dead bands; give small nodes a **vertical spine** (customer → application → APIs) alongside a tall box so both columns use the height. Pair with a **collision check**: list every node/label rectangle and verify pairwise none overlap or exceed the canvas.
- **Verify diagram syntax against the actual toolchain, not memory** — version-specific quirks (shape-name case, icon-vs-container properties, subgraph direction). Read the installed library's source/types if the render looks wrong. **Watch for reserved words as node ids** (`end`, `call`, `click`, `class`, `style`, `graph`, `subgraph`, `direction`, `default`) — `call` in `issue --> call[...]` throws a parse error; rename to `callapi`. These only surface at render time, never in a structural lint.

---

## The Jargon-Literacy Gate

The single highest-impact check for a domain outsider, and the easiest to skip (it shows up in no structure or style review). Walk every page top to bottom and flag every domain term/protocol/acronym at its **first appearance anywhere in the section** (not the current page):

1. **If explained elsewhere in the docs, link at the first use** — where "elsewhere" means a page the reader has actually passed in funnel reading order, not just somewhere on the site. A term first used on page 3 can't lean on a gloss that only exists on page 6.
2. **If explained nowhere,** add a one-clause inline gloss ("a token — a signed piece of data proving who the request is from") or flag the doc gap. Never let it pass on "everyone knows this."
3. **Watch term overloads** — words meaning something different here (in IAM "client" is the application, not the customer; "grant" is a mechanism). One-line clarification at first use.
4. **Do it as its own explicit pass,** separate from `style.md` (which checks tone/AI-vocabulary/voice, not assumed knowledge).
5. **Watch vague umbrella labels on diagram nodes and headings.** Could a reader who's seen only the label guess its scope? "Operations" fails (competes with IT-ops, business ops, DevOps) for something doing audit + monitoring + config governance. Check whether a sibling page already renamed it, and whether a precise standard term exists that's neither too broad nor too narrow ("Observability" fit; "Analytics" would drop the audit/config parts).

A section that reads fine to an insider and as a wall of unexplained acronyms to an outsider has failed this gate, however well-written.

---

## Concrete-Artifact Requirement

At least one page (usually the concepts or end-to-end page) must show a **real artifact** — a decoded token/payload, a request/response pair, a real config snippet, a screenshot — not only box-and-arrow diagrams. A diagram alone can't let a reader confirm "this is what the thing actually looks like." **Link to it precisely**: give the artifact its own subheading so a teaser elsewhere lands on it, not at the top of a section the reader must scroll past.

---

## Capability Coverage Audit

Restructuring from a feature catalog to this funnel has one failure no other check catches: a real, backend-supported capability silently vanishes because it lived only in a bullet cut for being "catalog-style." Run this whenever restructuring, and before publishing a new section:

1. **Enumerate the capabilities** a previous version, a competitor's docs, or product marketing named for this domain. Pull the actual list, don't rely on memory.
2. **Verify each against the codebase** (not the old docs' word) — search for the real implementation and report SUPPORTED / PARTIALLY SUPPORTED / NOT FOUND with file:line, same standard as any technical claim.
3. **For each SUPPORTED capability not named anywhere,** find where it belongs without reintroducing a catalog — usually one fit-criteria bullet, or the industry term for a mechanism already described generically. **PARTIALLY SUPPORTED gets its own wording:** if the codebase has the mechanism but not a first-class named feature, document the mechanism ("chaining two authenticator checks into one flow requires both before a token issues"), not the feature ("supports MFA").
4. **For each NOT FOUND, do not add it.** An old page naming it isn't evidence. If it seems like a real missing capability, surface it as a product gap, separate from the docs.
5. **Some named items are legitimately out of scope** (localization, privacy controls not specific to this domain) — note them as deliberately excluded, not silently absent.

---

## Coverage Checklist

Confirm each explicitly before calling a section done:

- [ ] **Failure modes** — at least a pointer to what happens when something breaks (expired credential, downstream unavailable, a step failing partway). Not deep, but not silent.
- [ ] **Security/compliance signal** — at least a link to where it's addressed.
- [ ] **Cross-page label consistency** — every link's visible text matches the target page's actual title (a link saying "Run and Observe" for a page titled "Run & Observe" erodes trust).
- [ ] **Sidebar labels imply order and stand alone** — read the tree with no page open (see "Sidebar labels must imply the reading order").
- [ ] **No dead-end routing** — every "choose a different pattern if…" links a real page; omit an alternative with no page rather than naming the gap.
- [ ] **Every technical claim verified** (apply `edit.md`'s standard to every product-specific claim on the concepts and decisions pages).
- [ ] **Copyable artifacts run as written.** Verify API calls, flow JSON, and walkthrough steps against the real schema/backend: request bodies use only supported fields (flat vs. nested per the OpenAPI spec), every variable or ID (`$TOKEN`, a resource-server id) is obtained/exported before first use, an example flow's `onFailure` routes to an error node not the success prompt, and a walkthrough narrates only what the configured flow actually does (no "records consent" when the flow has no consent executor).
- [ ] **Token validation not stated as unconditionally local.** "The API validates the token locally" is true only for a self-contained token (JWT); an opaque token needs an introspection callback — both are real paths. On a vendor-neutral page, hedge ("locally or via introspection, depending on the token type"); on a page committed to one concrete token type, dropping the qualifier is fine. This surfaced wrong three times in one section — check it explicitly wherever a page describes what an API does with a token.
- [ ] **Count claims match the list beside them** and every other place the section states the same count. Count the items, then grep siblings (a closing "Next Steps" often keeps a correct count after an earlier one drifted).
- [ ] **Overview stays lean but complete** — problem → How It Works (one diagram) → routing tip → next steps, no duplicate fit-checklist. The closing previews the real upcoming pages (new information), not a bare single link.
- [ ] **Versioned copies mirrored.** If the site is versioned, a section restructure must also replace the section subtree under each `versioned_docs/version-*/` and update the versioned sidebar JSON to match `sidebars.ts`; keep it byte-identical to `content/` (relative links and `@site` imports resolve the same, so a straight copy works).
- [ ] **Cross-section links resolve.** Sibling-pattern routing links from the overview leaf (`../../<pattern>/…`) are a routine off-by-one; the build is the only reliable check.

---

## Scoring Rubric

Score out of 10; justify each deduction with a specific quote and location, not a general impression.

- **Funnel shape and ordering (2 pts):** problem-first title, third-person situation, solution shape leading straight into product concepts (no standalone abstract-architecture page), decisions at the end, outcome close. Deduct for front-loaded decisions, a slow path to product specifics, and Voice-and-Tone violations (condescension, register shifts, filler, bare name-drops).
- **Jargon literacy (3 pts):** the biggest swing. Full marks require every first-use term linked or glossed and every overload flagged. Well-written but assuming protocol/domain fluency throughout caps this at ~7 regardless of prose quality.
- **Concrete grounding (2 pts):** at least one real artifact somewhere, plus dense, correctly-shaped diagrams (not fragmented or icon-decorated on process steps).
- **Coverage completeness (2 pts):** failure modes, security signal, no dead-end links, cross-page consistency. Also deduct when the concept page leaves the reader knowing the *model* but not the *mechanism* (console/API/config) or the *build order*, and when a promised capability never gets its concrete payoff.
- **Technical accuracy (1 pt):** every claim traceable to verified behavior. Deduct for a diagram contradicting its prose, an absolute where the truth is "usually" ("never created by hand" when an admin can), or a placeholder that isn't a valid instance (an `iss` value that isn't a URL).

A 9+ section gets full or near-full marks on **jargon literacy** specifically — the category every prior pass undersold until someone role-played a domain outsider. Don't let strong prose and a clean shape substitute for checking whether an unfamiliar reader would stall on a term.
