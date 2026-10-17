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
    def test_groups_repeated_weeks_and_budgets_a_practice_test(self):
        plan = build_plan(preferences(mathSharePercent=35))
        self.assertEqual(len(plan["plans"]), 2)
        week_one, regular_weeks = plan["plans"]
        self.assertEqual(week_one["appliesToWeeks"], [1])
        self.assertEqual(regular_weeks["appliesToWeeks"], [2, 3, 4])
        self.assertEqual((week_one["mathMinutes"], week_one["readingWritingMinutes"], week_one["practiceTestMinutes"]), (16, 29, 135))
        self.assertEqual((regular_weeks["mathMinutes"], regular_weeks["readingWritingMinutes"], regular_weeks["practiceTestMinutes"]), (63, 117, 0))
        activities = [activity for day in week_one["sessions"] for activity in day["activities"]]
        self.assertIn("Full SAT practice test and brief reflection", [item["focus"] for item in activities])
        self.assertEqual(sum(day["durationMinutes"] for day in week_one["sessions"]), 180)
        for week in plan["plans"]:
            self.assertEqual(sum(week[key] for key in ("mathMinutes", "readingWritingMinutes", "practiceTestMinutes")), 180)
            self.assertEqual(sum(activity["durationMinutes"] for day in week["sessions"] for activity in day["activities"]), 180)

    def test_only_distinct_week_patterns_are_returned(self):
        cases = {
            "none": [[1, 2, 3, 4]],
            "weekly": [[1, 2, 3, 4]],
            "every-two-weeks": [[1, 3], [2, 4]],
            "every-four-weeks": [[1], [2, 3, 4]],
        }
        for frequency, expected in cases.items():
            with self.subTest(frequency=frequency):
                plan = build_plan(preferences(practiceTestFrequency=frequency))
                self.assertEqual([week["appliesToWeeks"] for week in plan["plans"]], expected)

    def test_allocation_edges_use_only_the_selected_section(self):
        for percent, expected in ((0, (0, 180)), (100, (180, 0))):
            with self.subTest(percent=percent):
                plan = build_plan(preferences(mathSharePercent=percent, practiceTestFrequency="none"))
                self.assertEqual((plan["plans"][0]["mathMinutes"], plan["plans"][0]["readingWritingMinutes"]), expected)

    def test_unsure_methods_get_a_practical_default_and_note(self):
        plan = build_plan(preferences(studyMethods=["unsure"], practiceTestFrequency="none"))
        methods = {activity["method"] for day in plan["plans"][0]["sessions"] for activity in day["activities"]}
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
        self.assertEqual([week["appliesToWeeks"] for week in data["plans"]], [[1], [2, 3, 4]])

    def test_http_endpoint_rejects_score_payloads(self):
        response = self.post(preferences(mathScore=600))
        self.assertEqual(response.status, 422)
        self.assertIn("scheduling preferences only", json.loads(response.read())["error"])


if __name__ == "__main__":
    unittest.main()
