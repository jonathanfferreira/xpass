# 📊 Market Intelligence: Gurupass vs. ClassPass

This document summarizes the key findings from the market intelligence report and outlines strategic implications for XPASS.

## 1. Competitor Analysis

### Gurupass (The Local Hero)
*   **Model:** "Unlimited" plans with daily credit caps (e.g., "Unlimited 20" = 20 credits/day).
*   **Pricing:** Static/Stable.
*   **Strategy:** Hyper-local dominance in regional hubs (e.g., Joinville, SC).
*   **Target:** B2C, Routine-focused users (Gym rats).
*   **Pros:** Simplicity, predictability, strong regional coverage.
*   **Cons:** "Unlimited" is misleading (daily cap), no rollover mentioned.

### ClassPass (The Global Giant)
*   **Model:** Monthly Credit Subscription.
*   **Pricing:** Dynamic (AI-driven based on demand).
*   **Strategy:** Global mobility, Premium Lifestyle (Wellness + Fitness).
*   **Target:** B2B2C, Digital Nomads, Variety seekers.
*   **Pros:** **Rollover** (Golden Handcuff), access to premium/luxury studios.
*   **Cons:** Price volatility, support issues.

## 2. Strategic Implications for XPASS

### A. The "Rollover" Advantage
*   **Insight:** ClassPass's rollover policy is a massive retention tool. Users don't cancel because they don't want to lose accumulated credits.
*   **Action:** Implement a Rollover policy for XPASS subscriptions (e.g., roll over up to 1x monthly plan value).

### B. Pricing Model: Hybrid Approach
*   **Insight:** Gurupass wins on predictability, ClassPass on yield management.
*   **Action:**
    *   **Base:** Keep standard partner prices stable (Gurupass style) to avoid user frustration.
    *   **Premium:** Introduce "Off-peak" discounts for partners who want to fill empty slots (ClassPass style), but keep the "Standard" price as the ceiling.

### C. Regional Dominance
*   **Insight:** Gurupass succeeds by dominating specific cities (Joinville) rather than spreading thin.
*   **Action:** Focus partner acquisition efforts on saturating specific neighborhoods/cities to create a "moat" against competitors.

### D. Transparency
*   **Insight:** The "Unlimited" nomenclature of Gurupass is confusing.
*   **Action:** Stick to the "Credits" model (Energy Balance) but make it crystal clear. Consider "Daily Packs" vs "Monthly Packs".

## 3. Xpass Specific Strategy (The "Movement" Niche)

### A. Yield Management (The "Empty Slot" Economy)
*   **Concept:** Don't fight for the lowest price; fight for the *empty slot*.
*   **Execution:** A Jazz class at 10 AM is a sunk cost for the studio. Xpass fills it for 50% of the credit cost. The partner wins (revenue > 0), the user wins (cheaper access).

### B. Wellness Integration (Beyond Sweat)
*   **Concept:** Dancers and athletes need recovery.
*   **Execution:** Expand the partner network to include Physiotherapy, Sports Massage, and Cryotherapy.
*   **Retention:** If a user is injured or tired, they don't cancel; they spend credits on recovery.

### C. The "Credit" Superiority
*   **Concept:** "Unlimited" models (Gympass) are risky for niche studios (high usage = loss).
*   **Execution:** The Credit model guarantees margin. 100 Credits sold = Fixed Revenue. Usage determines the *distribution* of that revenue, but the platform's health is protected.

## 4. Recommended Features to Prioritize

1.  **Rollover Logic:** Update Cloud Functions to handle credit rollover on subscription renewal.
2.  **Dynamic Pricing Support:** Add `offPeakPrice` field to `classes` or `partners` schema.
3.  **Regional Filtering:** Enhance the "Explore" tab to highlight "Nearby Dominance".
