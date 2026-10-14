# Laplora guided user flow V0.1

Week 2 written deliverable · V0.1 choices approved October 14, 2026. The guided interface is not implemented yet; input validation and the pure engine are implemented separately.

## Step 1 — Your starting point

Choose official administration or official full-length practice, then identify SAT, PSAT/NMSQT, or PSAT 10. Explain where scores can be found and distinguish scored practice from Bluebook's unscored preview. Collect the baseline date and two section scores; show the derived total and correct assessment range.

Keep score fields empty initially. Use visible labels, brief help text, and inline errors linked with aria-describedby. On an invalid submission, focus the first error and provide an accessible error summary. On a valid move to another step, move focus to its heading. Changing assessment preserves entered values but revalidates them immediately; do not silently clamp or erase scores.

If the proposed below-SAT-floor PSAT policy is approved, explain that limitation here before the student fills out the rest of the form. Offer the route to enter another baseline. Preserve their existing observation while they go back.

## Step 2 — Your goal

Collect target SAT total and test date. Show the exact preparation time, including a partial week. Explain an already-achieved/lower goal without changing the student's data. Surface the old-baseline assumption and long-horizon warning in understandable language.

## Step 3 — Your preparation plan

Ask for weekly hours, realistic consistency, current prep history, study methods, and full-length practice frequency. Define consistency using an example: 75% means following roughly three quarters of the planned preparation on average. Offer numeric entry alongside sliders; no drag-only interaction.

Explain that weekly hours include practice tests and review. Keep section allocation at a disclosed equal split by default, with an optional advanced control if approved. Clearly state that V0.1 cannot quantify differences between methods or prep-history categories; these fields support context and guidance.

## Review — Check the assumptions

Summarize the baseline type/date, section totals, exam date, hours, consistency, and section allocation. Let each part be edited without losing the other answers. Show the experimental status, chosen model version, and its key limitations near the Run simulation control.

Do not require an account, collect identifying information, or add a checkbox solely to imply the model is validated. State that inputs stay in memory and refreshing clears them.

## Results — Understand the trajectory

Show the observed baseline separately from the hypothetical simulation start. Present total and section trajectories, exact endpoint date, target marker, and assumption range only if approved. Include a textual summary and a date/section/total table as chart alternatives. Keep assumption controls and caveats near the chart, with fuller explanations in How Laplora Works.

Use phrases such as “Under these assumptions, the central model reaches…” and “Your actual result may be higher or lower.” Do not use predicted chances, guaranteed points, or precision below the approved display rounding.

The client calculation should be fast. Do not add an artificial waiting period. A brief progress state may explain work if a real calculation takes time; announce completion without unexpectedly moving the user.

## Compare — Change one plan at a time

Keep baseline, target, start date, and model assumptions fixed across plans. Identify every changed study input. Provide a Current Plan, an Increased Practice preset, and a Custom Scenario. Explain when a descriptive field does not affect the numerical curve. Allow comparison reset without clearing the baseline or initial plan.

## Navigation and accessibility rules

- Back/Next preserves in-memory values; browser navigation behavior must be explicit when routes are implemented.
- Submit only valid step data; errors identify the field and corrective action.
- Fieldsets/legends group related controls; native controls remain usable with a keyboard.
- Step progress has a text equivalent. Focus states remain visible through glass panels.
- Responsive layout uses one primary column on narrow screens; no horizontal overflow or inaccessible chart-only information.
- Reduced-motion mode avoids count-up/line-drawing/page-transition effects while preserving the same content.
- Start over confirms clearing an entered plan; refreshing has the documented in-memory behavior.

## Mentoring exercise

Sketch the three input steps on paper. Explain which fields are required for a calculation and which are descriptive context. Describe how a student can correct the baseline test type without losing their study plan. This is the difference between a usable guided form and a large questionnaire.
