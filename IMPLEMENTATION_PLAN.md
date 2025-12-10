# XPASS Visual Overhaul: "Future Prime"

## Goal Description
Elevate the visual identity of XPASS (Landing Page and Apps) to a "technological, futuristic, minimalist, and luxurious" standard. The goal is to create a "WOW" effect that attracts premium partners and users, using a sophisticated Dark Mode with Neon Orange accents and advanced Glassmorphism.

## User Review Required
> [!IMPORTANT]
> This redesign will significantly change the look and feel of the application. Please review the proposed style direction below.

## Design Concept: "Onyx & Neon"
- **Backgrounds:** Deep Black (#000000) and Dark Charcoal (#0A0A0A) instead of generic grays.
- **Accents:** High-voltage Orange (#FF5200) used sparingly for calls-to-action and glows.
- **Materials:** "Premium Glass" - High blur, subtle white borders (1px), noise textures for tactility.
- **Typography:**
  - **Headings:** `Oswald` or `Inter` (Condensed/Wide) - Bold, Uppercase, Tracking-wide.
  - **Body:** `Inter` or `Outfit` - Clean, legible.
  - **Data:** `JetBrains Mono` or `Space Mono` - For numbers and technical details (futuristic feel).

## Proposed Changes

### 0. Architecture Migration (Firestore -> PostgreSQL)
**CRITICAL:** Switching database engine to support complex queries (Yield Management) and transactional integrity.

#### [NEW] [Data Connect Configuration](file:///d:/xpass/dataconnect.yaml)
- **Setup:** [ ] Initialize Firebase Data Connect project.
- **Schema:** [ ] Translate `DATABASE_SCHEMA.md` (NoSQL) to `schema.gql` (Relational).
- **Connectors:** [ ] Define queries and mutations for the apps.

#### [MODIFY] [App Integration](file:///d:/xpass/xpass-app-aluno/src/lib/firebase.js)
- **SDK:** [ ] Replace `firebase/firestore` with generated Data Connect SDKs.

### 1. Landing Page (`xpass-landing`)
Transform the landing page into an immersive experience.

#### [MODIFY] [App.jsx](file:///d:/xpass/xpass-landing/src/App.jsx)
- **Hero Section:** [x] Implement a "Spotlight" effect (radial gradient following mouse or static ambient glow).
- **Hero Section:** [x] Giant, cinematic typography for the main value proposition.
- **Hero Section:** [x] "Holographic" cards for features (floating, slight tilt on hover).
- **Partner Section:** [x] Minimalist carousel with monochrome logos that light up on hover.
- **Footer:** [x] Clean, massive footer with oversized links.

### 2. Student App (`xpass-app-aluno`)
Make the app feel like a futuristic digital wallet/pass.

#### [MODIFY] [App.jsx](file:///d:/xpass/xpass-app-aluno/src/App.jsx)
- **Home Dashboard:** [x]
  - **Balance Card:** Replace the standard card with a "Digital Energy Core" design (glowing ring or bar representing credits).
  - **Navigation:** Floating bottom bar with blur effect (removing the solid border).
  - **Partner List:** Cards with zero borders, using only shadow and subtle background difference to separate from the black background.

### 3. Partner App (`xpass-app-parceiro`)
Create a "Command Center" feel.

#### [MODIFY] [FinancialDashboard.jsx](file:///d:/xpass/xpass-app-parceiro/src/components/FinancialDashboard.jsx)
- **Stats:** [x] Large, thin numbers with glowing charts.
- **Transaction List:** [x] Minimalist table with mono fonts for values.

### 4. Business Logic Refinement (Market Intelligence)
Incorporating insights from Gurupass/ClassPass analysis.

#### [MODIFY] [Cloud Functions](file:///d:/xpass/functions/index.js)
- **Rollover System:** [x] Implement logic to carry over unused credits (up to 1x monthly plan) during subscription renewal. ✅ DONE
- **Dynamic Pricing:** [x] Add support for `offPeakPrice` in booking calculations (Yield Management). ✅ DONE

#### [MODIFY] [Database Schema](file:///d:/xpass/DATABASE_SCHEMA.md)
- **Partners:** [x] Add `offPeakPrice` (optional) to partner/class documents. ✅ Already in schema.gql
- **Partners:** [ ] Add `category` support for 'Wellness', 'Physio', 'Massage'.
- **Subscriptions:** [x] Add `rolloverCap` field to plan definitions. ✅ Already in schema.gql

## Verification Plan
### Manual Verification
- **Visual Check:** Verify the "premium feel" on both Desktop (Landing) and Mobile (Apps) viewports.
- **Performance:** Ensure animations (blur, glow) do not hinder performance on mobile devices.
