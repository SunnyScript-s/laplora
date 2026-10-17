import json
import threading
import unittest
from http.server import ThreadingHTTPServer
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from api.study_plan import handler
from api.study_planner import PlannerError, build_plan


def preferences(**overrides):
    return {
        "weeklyHours": 3,
        "availableDays": ["Monday", "Wednesday", "Saturday"],
        "studyMethods": ["mistake-review", "targeted-practice"],
        "practiceTestFrequency": "every-four-weeks",
        "mathSharePercent": 50,
        **overrides,
    }


class StudyPlannerTests(unittest.TestCase):
    def test_builds_four_weeks_and_budgets_a_practice_test(self):
        plan = build_plan(preferences())
        self.assertEqual(len(plan["weeks"]), 4)
        self.assertEqual([week["totalMinutes"] for week in plan["weeks"]], [180] * 4)
        week_one = plan["weeks"][0]
        activities = [activity for day in week_one["sessions"] for activity in day["activities"]]
        self.assertIn("Full SAT practice test and brief reflection", [item["focus"] for item in activities])
        self.assertEqual(sum(day["durationMinutes"] for day in week_one["sessions"]), 180)

    def test_unsure_methods_get_a_practical_default_and_note(self):
        plan = build_plan(preferences(studyMethods=["unsure"], practiceTestFrequency="none"))
        methods = {activity["method"] for day in plan["weeks"][0]["sessions"] for activity in day["activities"]}
        self.assertEqual(methods, {"Targeted questions and skill practice", "Review missed and uncertain questions"})
        self.assertTrue(any("not sure" in note.lower() for note in plan["notes"]))

    def test_rejects_score_fields_and_unknown_payload_data(self):
        for key in ("mathScore", "targetScore", "baselineDate"):
            with self.subTest(key=key), self.assertRaises(PlannerError):
                build_plan(preferences(**{key: 600}))

    def test_rejects_invalid_or_infeasible_schedules(self):
        cases = [
            preferences(weeklyHours=1.5, practiceTestFrequency="weekly"),
            preferences(weeklyHours=7, availableDays=["Monday"]),
            preferences(weeklyHours=1.1),
            preferences(weeklyHours=float("nan")),
            preferences(weeklyHours=float("inf")),
            preferences(availableDays=[]),
            preferences(studyMethods=[]),
        ]
        for payload in cases:
            with self.subTest(payload=payload), self.assertRaises(PlannerError):
                build_plan(payload)


class StudyPlannerHttpTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.url = f"http://127.0.0.1:{cls.server.server_port}/api/study_plan"

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.thread.join()
        cls.server.server_close()

    def post(self, payload):
        request = Request(self.url, data=json.dumps(payload).encode(), headers={"Content-Type": "application/json"})
        try:
            return urlopen(request)
        except HTTPError as error:
            return error

    def test_http_endpoint_returns_no_store_headers_and_plan(self):
        response = self.post(preferences())
        data = json.loads(response.read())
        self.assertEqual(response.status, 200)
        self.assertEqual(response.headers["Cache-Control"], "no-store, max-age=0")
        self.assertEqual(len(data["weeks"]), 4)

    def test_http_endpoint_rejects_score_payloads(self):
        response = self.post(preferences(mathScore=600))
        self.assertEqual(response.status, 422)
        self.assertIn("scheduling preferences only", json.loads(response.read())["error"])


if __name__ == "__main__":
    unittest.main()
