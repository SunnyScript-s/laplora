"""Build a practical four-week study schedule from scheduling preferences only."""

from __future__ import annotations

import math
from typing import Any

DAYS = ("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")
METHODS = {
    "targeted-practice": "Targeted questions and skill practice",
    "full-length-tests": "Full-length practice test",
    "mistake-review": "Review missed and uncertain questions",
    "tutoring-class": "Tutoring or class work",
    "unsure": "Not sure yet",
}
FREQUENCIES = {"none", "every-four-weeks", "every-two-weeks", "weekly"}
REQUIRED_KEYS = {
    "weeklyHours", "availableDays", "studyMethods", "practiceTestFrequency", "mathSharePercent"
}


class PlannerError(ValueError):
    """A safe, user-displayable input or scheduling error."""


def _validate(payload: Any) -> tuple[int, list[str], list[str], str, int]:
    if not isinstance(payload, dict) or set(payload) != REQUIRED_KEYS:
        raise PlannerError("The planner accepts scheduling preferences only. Please review your entries and try again.")

    hours = payload["weeklyHours"]
    if (isinstance(hours, bool) or not isinstance(hours, (int, float))
            or not math.isfinite(hours) or not 0 <= hours <= 40):
        raise PlannerError("Weekly hours must be between 0 and 40.")
    minutes = round(hours * 60)
    if abs(hours * 60 - minutes) > 1e-7 or minutes % 15:
        raise PlannerError("Weekly hours must use 15-minute increments.")

    days = payload["availableDays"]
    if (not isinstance(days, list) or not days or len(days) > 7
            or any(not isinstance(day, str) or day not in DAYS for day in days)
            or len(set(days)) != len(days)):
        raise PlannerError("Choose one or more different days of the week.")
    days = sorted(days, key=DAYS.index)

    methods = payload["studyMethods"]
    if (not isinstance(methods, list) or not methods
            or any(not isinstance(method, str) or method not in METHODS for method in methods)
            or len(set(methods)) != len(methods)
            or ("unsure" in methods and len(methods) > 1)):
        raise PlannerError("Choose at least one valid study method.")

    frequency = payload["practiceTestFrequency"]
    if not isinstance(frequency, str) or frequency not in FREQUENCIES:
        raise PlannerError("Choose a valid practice-test frequency.")
    allocation = payload["mathSharePercent"]
    if isinstance(allocation, bool) or not isinstance(allocation, int) or not 0 <= allocation <= 100:
        raise PlannerError("Math allocation must be a whole percentage from 0 to 100.")
    return minutes, days, methods, frequency, allocation


def _build_week(weekly_minutes: int, days: list[str], methods: list[str],
                math_share: int, has_test: bool, applies_to_weeks: list[int]) -> dict[str, Any]:
    allocations = {day: 0 for day in days}
    activities: dict[str, list[dict[str, Any]]] = {day: [] for day in days}
    test_minutes = 135 if has_test else 0
    if has_test:
        test_day = days[0]
        activities[test_day].append({
            "kind": "test", "durationMinutes": test_minutes,
            "focus": "Full SAT practice test and brief reflection",
            "method": METHODS["full-length-tests"],
            "mathMinutes": 0, "readingWritingMinutes": 0,
        })
        allocations[test_day] = test_minutes

    flexible_minutes = weekly_minutes - test_minutes
    remaining = flexible_minutes
    assigned_flexible = 0
    assigned_math = 0
    method_index = 0
    while remaining:
        eligible = [day for day in days if allocations[day] < 360]
        if not eligible:
            raise PlannerError("Those hours do not fit your selected days. Choose more available days or fewer weekly hours.")
        day = min(eligible, key=lambda item: (allocations[item], DAYS.index(item)))
        block = min(45, remaining, 360 - allocations[day])
        method_key = methods[method_index % len(methods)]
        method_index += 1

        # Cumulative rounding keeps each activity whole-minute and the exact
        # weekly Math/R&W totals consistent with the selected allocation.
        assigned_flexible += block
        next_math = (assigned_flexible * math_share + 50) // 100
        math_minutes = next_math - assigned_math
        assigned_math = next_math
        reading_writing_minutes = block - math_minutes
        focus = ("Math and Reading & Writing practice" if math_minutes and reading_writing_minutes
                 else "Math practice" if math_minutes else "Reading & Writing practice")
        activities[day].append({
            "kind": "practice", "durationMinutes": block,
            "focus": focus, "method": METHODS[method_key],
            "mathMinutes": math_minutes,
            "readingWritingMinutes": reading_writing_minutes,
        })
        allocations[day] += block
        remaining -= block

    sessions = [
        {"day": day, "activities": activities[day], "durationMinutes": allocations[day]}
        for day in days if activities[day]
    ]
    return {
        "appliesToWeeks": applies_to_weeks,
        "sessions": sessions,
        "totalMinutes": weekly_minutes,
        "mathMinutes": assigned_math,
        "readingWritingMinutes": flexible_minutes - assigned_math,
        "practiceTestMinutes": test_minutes,
    }


def build_plan(payload: Any) -> dict[str, Any]:
    """Return only distinct four-week schedule patterns, with no persistence."""
    weekly_minutes, days, methods, frequency, math_share = _validate(payload)
    test_weeks = {
        "none": set(),
        "every-four-weeks": {1},
        "every-two-weeks": {1, 3},
        "weekly": {1, 2, 3, 4},
    }[frequency]
    if weekly_minutes < 135 and test_weeks:
        raise PlannerError("A full-length practice test needs about 2 hours 15 minutes. Choose more weekly time or a less frequent test schedule.")
    if weekly_minutes > len(days) * 360:
        raise PlannerError("That schedule exceeds the six-hour daily planning limit. Choose more available days or fewer weekly hours.")

    effective_methods = (["targeted-practice", "mistake-review"]
                         if methods == ["unsure"] else [m for m in methods if m != "full-length-tests"])
    if not effective_methods:
        effective_methods = ["mistake-review", "targeted-practice"]

    week_groups: dict[bool, list[int]] = {}
    for week in range(1, 5):
        week_groups.setdefault(week in test_weeks, []).append(week)
    plans = [
        _build_week(weekly_minutes, days, effective_methods, math_share, has_test, covered_weeks)
        for has_test, covered_weeks in week_groups.items()
    ]

    notes = ["This is a flexible study schedule, not a score prediction."]
    if methods == ["unsure"]:
        notes.append("Since you are not sure which methods to use, the plan alternates targeted practice and mistake review.")
    if test_weeks:
        notes.append("A full-length test takes 2 hours 15 minutes of the weekly total. Math and Reading & Writing study minutes are shown for the flexible practice time left after the test.")
    return {"plans": plans, "weeklyMinutes": weekly_minutes, "notes": notes}
