# Laplora — V1 Development Plan

<aside>
🚀

**Target:** Build and publicly beta-launch Laplora V1 as an SAT/PSAT score-growth simulator.

**Start:** October 13, 2026 · **Target public beta:** February 2, 2027

</aside>

# Project Vision

**Laplora** is a student-focused mathematical simulation platform that models possible SAT score growth under different study plans.

Instead of creating its own knowledge quiz in V1, Laplora starts from a score the student already has from an **SAT, PSAT/NMSQT, PSAT 10, or official full-length practice test**. The student adds information about their goal, timeline, and study habits. Laplora then models possible score trajectories and lets the student compare different study scenarios.

> **Laplora is a simulation, not a guaranteed SAT prediction.** Results should be presented as modeled outcomes based on the student's inputs and Laplora's documented assumptions.
> 

## Why SAT/PSAT for V1

- The SAT Suite already provides standardized total and section scores.
- Students have a clear reason to care about improvement.
- The audience is much broader than a CS-only simulator.
- Users can return after later practice tests or official tests and compare real progress with the model.
- Laplora can eventually improve its assumptions using anonymized/consented longitudinal results.

## V1 Core System

**Existing SAT/PSAT Score → Section Scores → Goal + Test Date → Study Habits → Mathematical Model → Simulated Score Trajectory → Scenario Comparison → Graphs + Insights**

---

# V1 Input Design

## Required Inputs

Keep the first form useful but not overwhelming.

- **Baseline type:** SAT, PSAT/NMSQT, PSAT 10, or official full-length practice test.
- **Baseline date:** when the score was earned.
- **Reading & Writing score.**
- **Math score.**
- **Target SAT score.**
- **Target test date.**
- **Realistic study hours per week.**
- **Expected consistency:** how often the student realistically follows the plan.
- **Current SAT-prep history:** just starting, some preparation, or already preparing consistently.
- **Study mix:** targeted questions/skill lessons, full-length practice tests, review of mistakes, tutoring/class, or a mixture.
- **Full-length practice-test frequency.**

## Optional Advanced Inputs

Do not force these on every user in V1.

- Reading & Writing domain performance.
- Math domain performance.
- Previous SAT/PSAT/practice-test scores and dates.
- Whether the student regularly reviews missed questions.
- Planned breaks/weeks with reduced study.

## Inputs to Avoid in V1

Avoid weak or invasive variables that make the form longer without clearly improving the model, such as GPA, school name, income, college list, IQ-style ratings, or asking the student to guess their own intelligence.

---

# Phase 1 — Define the SAT Product

## Week 1 — Oct 13–19: Product Definition + SAT Research

**Goal:** Define exactly what Laplora V1 does and understand the SAT data it will use.

- [ ]  Write the one-paragraph problem statement.
- [ ]  Define the target user: high-school students preparing for the SAT, including students using PSAT or official practice results as a baseline.
- [ ]  Define Laplora as educational, mathematical, simulation-based, experimental, and student-focused.
- [ ]  Define what it is NOT: a guaranteed score predictor, College Board product, tutoring replacement, admissions predictor, or promise of a specific score increase.
- [ ]  Research current SAT/PSAT score ranges and section structure using official College Board sources.
- [ ]  Research the Reading & Writing and Math content domains.
- [ ]  Research what information students receive after official Bluebook practice tests.
- [ ]  Decide exactly which baseline test types V1 accepts.
- [ ]  Create a Future Ideas list so new ideas do not constantly expand V1.

**Deliverable:** **Laplora SAT V1 Product Specification**

## Week 2 — Oct 20–26: Finalize Inputs + User Flow

**Goal:** Decide what information Laplora needs before designing the model.

- [ ]  Evaluate every proposed input: Does it have a reasonable relationship to score growth? Can a student answer it accurately? Does it change the simulation enough to justify asking?
- [ ]  Finalize required vs optional inputs.
- [ ]  Define validation rules for SAT and PSAT score ranges.
- [ ]  Decide how PSAT baselines will be handled when the target is an SAT score.
- [ ]  Decide how old baseline scores should be treated.
- [ ]  Design the full user flow.
- [ ]  Sketch the form order so it feels like a short guided setup rather than a giant questionnaire.

**Suggested flow:**

**Choose baseline → Enter section scores → Set target + date → Describe study plan → Run simulation → Explore results → Compare scenarios**

**Deliverable:** **Laplora Input Specification + User Flow V1**

---

# Phase 2 — Design the Mathematical Model

## Week 3 — Oct 27–Nov 2: Research SAT Improvement Factors

**Goal:** Research what the model should consider before assigning numbers to anything.

Research questions such as:

- [ ]  How should starting score affect room for improvement?
- [ ]  Should improvement become harder near the top of the 1600 scale?
- [ ]  How should time until the test affect the possible trajectory?
- [ ]  How should weekly study time influence growth?
- [ ]  How should diminishing returns work for very high weekly hours?
- [ ]  How should consistency differ from raw study hours?
- [ ]  Should targeted practice and mistake review affect the model differently from simply doing more questions?
- [ ]  How should repeated full-length practice tests be represented?
- [ ]  How much uncertainty exists between practice scores and future test performance?

Keep notes separating **evidence** from **your modeling assumptions**.

**Deliverable:** **SAT Growth Research Notes**

## Week 4 — Nov 3–9: Design the Score Model

**Goal:** Create the conceptual model before programming it.

Model Reading & Writing and Math **separately**, then combine them into a total trajectory.

- [ ]  Define the baseline for each section.
- [ ]  Define the maximum valid score.
- [ ]  Define a time step, such as weekly progress.
- [ ]  Decide how study hours affect each time step.
- [ ]  Add diminishing returns.
- [ ]  Decide how consistency modifies effective study.
- [ ]  Decide how study type modifies effective practice.
- [ ]  Decide how remaining room to 800 affects growth.
- [ ]  Decide how target date limits the number of simulated weeks.
- [ ]  Document every experimental coefficient/weight instead of pretending it is proven.

**Deliverable:** **Laplora SAT Model V0.1 — Written Specification**

## Week 5 — Nov 10–16: Add Uncertainty + Scenario Logic

**Goal:** Avoid making Laplora look falsely precise.

Instead of treating one exact future score as guaranteed, research how to communicate uncertainty.

- [ ]  Decide whether V1 should display a central modeled trajectory plus an estimated range.
- [ ]  Define Current Plan, Increased Practice, and Custom Scenario behavior.
- [ ]  Decide what happens when the target appears unrealistic under the current assumptions.
- [ ]  Design wording such as “modeled trajectory,” “estimated range,” and “under these assumptions.”
- [ ]  Define score rounding so the interface does not imply fake precision.
- [ ]  Define how the model handles a student already near 800 in one section.

**Deliverable:** **Simulation Rules V0.1**

---

# Phase 3 — Build the Core Engine

## Week 6 — Nov 17–23: Build Input + Validation Logic

**Goal:** Make the simulator accept clean, valid student data.

- [ ]  Build the data structure for user inputs.
- [ ]  Validate test type and score ranges.
- [ ]  Validate target date.
- [ ]  Validate study hours and consistency.
- [ ]  Handle missing optional information.
- [ ]  Calculate weeks until target test date.
- [ ]  Keep calculations separate from visual code where possible.

**Learning focus:** Python fundamentals, functions, dictionaries, validation, dates, debugging, and Git.

**Deliverable:** **Working Laplora Input Engine**

## Week 7 — Nov 24–30: Build Simulation Engine V0.1

**Goal:** Turn the written model into working software.

- [ ]  Generate Reading & Writing trajectory points.
- [ ]  Generate Math trajectory points.
- [ ]  Combine them into total-score trajectory points.
- [ ]  Respect section and total score limits.
- [ ]  Generate results across the entire timeline.
- [ ]  Return the data in a clean format that the frontend can graph.
- [ ]  Keep the engine testable without the finished website.

**Deliverable:** **Laplora SAT Simulation Engine V0.1**

## Week 8 — Dec 1–7: Stress-Test the Model

**Goal:** Try to make the simulation produce ridiculous results.

Create test profiles such as:

- [ ]  900 baseline, beginner prep, several months remaining.
- [ ]  1200 baseline, moderate study.
- [ ]  1400 baseline, high consistency.
- [ ]  1500+ baseline with little remaining room.
- [ ]  Strong Math / weaker Reading & Writing.
- [ ]  Strong Reading & Writing / weaker Math.
- [ ]  Very short time until test day.
- [ ]  Very long preparation period.
- [ ]  0 study hours.
- [ ]  Unrealistically high study hours.
- [ ]  Low consistency with high planned hours.

Look for impossible scores, overly fast improvement, flat behavior that ignores important inputs, and one variable dominating everything.

**Deliverable:** **Laplora SAT Model V0.2 + Test Report**

---

# Phase 4 — Design the Laplora Experience

## Week 9 — Dec 8–14: UX + Frutiger Aero/Futuristic Design System

**Goal:** Design a recognizable visual identity that still feels credible for an education product.

### Visual Direction

Think **professional futuristic Frutiger Aero**, not a parody of the aesthetic.

Explore:

- [ ]  Bright sky/atmospheric backgrounds used carefully.
- [ ]  Aqua/water/glass-inspired surfaces.
- [ ]  Soft green/blue environmental accents.
- [ ]  Translucent or glass-like cards.
- [ ]  Rounded UI with clean spacing.
- [ ]  Subtle gloss/highlights rather than excessive shiny effects.
- [ ]  Modern futuristic typography that remains easy to read.
- [ ]  Clean charts and data visualization.
- [ ]  Depth through gradients, blur, shadows, and layered surfaces.
- [ ]  Consistent icon style.

### Brand Rule

The site should still look believable if shown to a student, parent, teacher, counselor, or college-admissions professional.

### Wireframe

Design:

**Landing → Baseline → Goal → Study Plan → Simulation Loading → Results Dashboard → Scenario Comparison → How It Works**

**Deliverable:** **Laplora Design System + Wireframes**

## Week 10 — Dec 15–21: Build the Frontend Foundation

**Goal:** Build the actual interface without trying to perfect every animation yet.

- [ ]  Responsive navigation.
- [ ]  Landing page.
- [ ]  Guided simulation setup.
- [ ]  Score input components.
- [ ]  Target-date/target-score inputs.
- [ ]  Study-plan controls.
- [ ]  Results dashboard shell.
- [ ]  Mobile layout.
- [ ]  Reusable UI components.

**Learning focus:** semantic HTML, CSS, Flexbox/Grid, responsive design, JavaScript DOM/events, and frontend organization.

**Deliverable:** **Working Laplora Frontend**

## Week 11 — Dec 22–28: Data Visualization + Results

**Goal:** Make the simulation visually understandable.

Results should prioritize:

- [ ]  Current baseline total.
- [ ]  Reading & Writing baseline.
- [ ]  Math baseline.
- [ ]  Target score and test date.
- [ ]  Main score-over-time trajectory graph.
- [ ]  Reading & Writing and Math trajectories.
- [ ]  Modeled score/range by test date.
- [ ]  Difference between current plan and target.
- [ ]  Clear summary of the assumptions used.

The chart should communicate uncertainty and never look like Laplora knows the student's exact future score.

**Deliverable:** **Results Dashboard V1**

---

# Phase 5 — Animation + Scenario Comparison

## Week 12 — Dec 29–Jan 4: Motion System

**Goal:** Add animations that make Laplora feel polished rather than distracting.

Possible motion:

- [ ]  Smooth page/step transitions during setup.
- [ ]  Score numbers counting into place.
- [ ]  Graph line drawing in when results load.
- [ ]  Cards softly entering as results appear.
- [ ]  Subtle floating/background environmental motion.
- [ ]  Hover/focus feedback on interactive controls.
- [ ]  Animated comparison when a study variable changes.
- [ ]  Reduced-motion support for users who prefer less animation.

**Rule:** Animation should communicate progress, hierarchy, interaction, or change. Do not animate everything just because you can.

**Deliverable:** **Laplora Motion System V1**

## Week 13 — Jan 5–11: Scenario Comparison

**Goal:** Make the simulator useful for decision-making.

Allow a student to compare plans such as:

**Current Plan**

3 hrs/week · 70% consistency

**More Consistent**

3 hrs/week · 90% consistency

**More Practice**

6 hrs/week · 85% consistency

- [ ]  Compare trajectories on one graph.
- [ ]  Clearly show which inputs changed.
- [ ]  Allow a custom scenario.
- [ ]  Make comparison easy to reset.
- [ ]  Avoid telling students that one path guarantees a score.

**Deliverable:** **Scenario Comparison V1**

---

# Phase 6 — Credibility + Transparency

## Week 14 — Jan 12–18: Build “How Laplora Works”

**Goal:** Make the model explainable.

Create sections explaining:

- [ ]  What data Laplora asks for and why.
- [ ]  How baseline SAT/PSAT scores are used.
- [ ]  Why Math and Reading & Writing are modeled separately.
- [ ]  How study habits affect the model.
- [ ]  What assumptions are experimental.
- [ ]  How uncertainty is represented.
- [ ]  Why simulated results are not guarantees.
- [ ]  What Laplora does NOT know about a student.
- [ ]  Privacy/data-handling explanation appropriate to whatever V1 actually stores.

Also make it clear that Laplora is an independent project and not an official College Board product.

**Deliverable:** **How Laplora Works + Limitations**

---

# Phase 7 — Test + Launch

## Week 15 — Jan 19–25: Private Beta

**Goal:** Test with real students.

Find roughly **5–10 students** who have taken a PSAT, SAT, or official SAT practice test.

Watch for:

- [ ]  Do they understand which score to enter?
- [ ]  Does the setup feel too long?
- [ ]  Do they understand the graph?
- [ ]  Do they think the modeled result is a guarantee?
- [ ]  Is scenario comparison actually useful?
- [ ]  Do they trust the site enough to enter their scores?
- [ ]  Does the Frutiger Aero/futuristic design feel cool or distracting?
- [ ]  Do animations improve the experience or slow it down?
- [ ]  Does it work well on phones and laptops?

**Deliverable:** **Private Beta Feedback Report**

## Week 16 — Jan 26–Feb 1: Launch Preparation

**Goal:** Prepare a stable public beta.

- [ ]  Fix major bugs.
- [ ]  Fix confusing input wording.
- [ ]  Re-test score validation.
- [ ]  Re-test model edge cases.
- [ ]  Improve mobile responsiveness.
- [ ]  Polish animations without adding unnecessary effects.
- [ ]  Finish README.
- [ ]  Finish How Laplora Works.
- [ ]  Add feedback form.
- [ ]  Check accessibility basics.
- [ ]  Check performance/loading speed.
- [ ]  Make disclaimers visible without making the site feel scary.
- [ ]  Create launch screenshots/demo.
- [ ]  Tag the GitHub release/version.

**Deliverable:** **Laplora V1 Release Candidate**

# February 2, 2027 — Public Beta 🚀

Release **Laplora V1 Public Beta**.

Ask early users:

- Did the simulator make sense?
- Would you return after your next practice test?
- Was scenario comparison useful?
- What input felt unnecessary?
- What information did you wish Laplora knew?
- Did the prediction feel believable without feeling guaranteed?
- What would make Laplora useful enough to keep using?

---

# After V1

## V1.1 — Better Calibration

Use testing and, only where appropriate with consent/privacy protections, repeated user results to compare modeled vs actual score changes. Improve coefficients instead of endlessly adding features.

## V1.2 — Progress Tracking

Potential features:

- Saved baseline tests.
- New practice-test entries.
- Actual-vs-modeled trajectory.
- Study-plan history.
- Score timeline.
- Updated simulations after each new score.

## V1.3 — Domain-Aware Modeling

Use optional SAT domain performance to make simulations more detailed.

Reading & Writing domains can include:

- Information and Ideas
- Craft and Structure
- Expression of Ideas
- Standard English Conventions

Math domains can include:

- Algebra
- Advanced Math
- Problem-Solving and Data Analysis
- Geometry and Trigonometry

Do not claim domain precision beyond what the available score data supports.

## V1.4 — Accounts + Database

Only add accounts when saved history is genuinely useful.

Learn:

- SQL/database basics
- Authentication concepts
- Data privacy/security basics
- User data deletion/export concepts

## V2 — Probabilistic Simulation

Deepen the math with:

- Probability distributions
- Variance and standard deviation
- Confidence/uncertainty concepts
- Monte Carlo simulation
- Percentiles
- Uncertainty bands

Potential result: many simulated score trajectories rather than one deterministic line.

## Future Laplora Models

SAT does not have to be Laplora forever. If the simulation framework works, future products could use different inputs and entirely different models for other measurable goals.

Do **not** assume the SAT formula works for another domain.

---

# Technical Learning While Building

## Python

Prioritize:

- Variables and types
- Conditionals
- Loops
- Functions
- Lists/dictionaries
- Modules
- Date/time handling
- Validation
- Testing
- Basic statistics
- Debugging

## HTML

Learn:

- Semantic structure
- Forms
- Inputs
- Labels
- Buttons
- Accessibility basics

## CSS

Learn:

- Box model
- Flexbox
- Grid
- Responsive design
- CSS variables
- Gradients
- Blur/transparency
- Transitions
- Keyframe animations
- Reduced-motion media query

## JavaScript

Learn:

- Variables/functions
- Arrays/objects
- Events
- DOM manipulation
- Form handling
- Validation
- Async/fetch basics
- Updating charts/UI from data

## Git/GitHub

Use Git throughout development:

- Meaningful commits
- Branches for larger features
- Issues for bugs/features
- README
- Tags/releases
- Commit history showing the project evolve

---

# Math to Learn

## V1

- Algebra
- Functions
- Percentages
- Weighted effects
- Rates of change
- Diminishing returns
- Normalization
- Graphs/time series
- Mean/median
- Basic variance/uncertainty concepts

## Later

- Probability distributions
- Standard deviation
- Regression
- Monte Carlo simulation
- Model calibration
- Error metrics
- Statistical validation

---

# Development Rules

## 1. Understand What I Build

I should be able to explain the model, inputs, code structure, design decisions, assumptions, and limitations.

## 2. Separate Evidence From Assumptions

If research supports something, cite it in my notes. If I chose a parameter experimentally, label it as an assumption.

## 3. Don't Outsource the Project

Use tutorials, documentation, AI explanations, and debugging help to learn. Do not have AI generate the entire Laplora codebase while I simply paste it.

## 4. Keep a Development Journal

After major sessions record:

- Date
- What I built
- What I learned
- Research used
- Problems encountered
- How I solved them
- Modeling/design decisions
- Git commit(s)
- Next task

## 5. Commit Meaningful Progress

Examples:

- `Create SAT baseline input validation`
- `Add separate Math and Reading Writing trajectories`
- `Implement diminishing returns in study model`
- `Build scenario comparison graph`
- `Add reduced-motion support`

## 6. Protect Credibility

Never market a simulated score as guaranteed. The interesting part of Laplora is not pretending to know the future. It is building a transparent model that lets students explore how different assumptions and study plans change the modeled outcome.

---

# Start Here

Before opening VS Code, complete **Week 1**.

Write one clear answer to:

> **What should Laplora V1 help an SAT student understand that their normal score report does not?**
> 

Then research the SAT score system and begin defining the inputs the model actually needs.