# Python study planner

Laplora's optional study planner uses a small Python 3.12 serverless function to turn scheduling preferences into a flexible four-week calendar. It does not predict SAT scores and does not alter the existing score simulation.

## Request boundary

The browser submits a JSON `POST /api/study_plan` with exactly these fields:

```json
{
  "weeklyHours": 3,
  "availableDays": ["Monday", "Wednesday", "Saturday"],
  "studyMethods": ["mistake-review", "targeted-practice"],
  "practiceTestFrequency": "every-four-weeks",
  "mathSharePercent": 50
}
```

Scores, goals, test dates, consistency, and preparation history are not included. The endpoint rejects unknown keys, limits request size, validates preference values, returns `Cache-Control: no-store`, and does not log request paths or payloads in the application handler. It has no database, persistent storage, or analytics integration. The browser holds the returned schedule in page memory and it clears when the tab is refreshed.

The planner distributes time in quarter-hour increments across selected days, limits planning to six hours per day, and reserves 135 minutes for each scheduled full-length test. If test time does not fit the requested weekly hours, it asks the student to adjust the schedule. “Not sure yet” methods receive a clearly described default of targeted practice plus mistake review. These are organization suggestions, not evidence-backed prescriptions.

The founder approved this narrow transient-processing exception to the original all-local input rule on October 17, 2026. Vercel still processes ordinary network metadata under its own service and security practices; anonymous preferences do not make network activity untraceable.

## Local development and tests

Use Python 3.12 and Node 24.19.0:

```sh
npm ci
npm run dev:api  # terminal 1, listens on 127.0.0.1:8000
npm run dev      # terminal 2, Vite proxies /api to Python
```

Run the API tests with:

```sh
python -m unittest discover -s tests/python -v
```

The browser test stubs the endpoint and confirms the submitted body contains only the five scheduling fields. GitHub Actions runs Python API tests alongside Node/browser verification.

In production, `api/study_plan.py` is the Vercel Python function and imports the pure planner in `api/study_planner.py`. Deployment verification must confirm the Vercel project builds that function alongside the current Vite frontend. No new secret or environment variable is needed.
