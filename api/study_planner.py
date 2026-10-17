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


def build_plan(payload: Any) -> dict[str, Any]:
    """Return an in-memory four-week plan. No persistence, score data, or logging."""
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
    sessions_by_week: list[dict[str, Any]] = []
    method_index = 0

    for week in range(1, 5):
        allocations = {day: 0 for day in days}
        activities: dict[str, list[dict[str, Any]]] = {day: [] for day in days}
        remaining = weekly_minutes
        if week in test_weeks:
            # Reserve the longest selected day for a complete timed test and review.
            test_day = days[(week - 1) % len(days)]
            activities[test_day].append({
                "durationMinutes": 135,
                "focus": "Full SAT practice test and brief reflection",
                "method": METHODS["full-length-tests"],
            })
            allocations[test_day] += 135
            remaining -= 135

        # Distribute remaining time in 15-minute blocks, balancing day load.
        while remaining:
            eligible = [day for day in days if allocations[day] < 360]
            if not eligible:
                raise PlannerError("Those hours do not fit your selected days. Choose more available days or fewer weekly hours.")
            day = min(eligible, key=lambda item: (allocations[item], DAYS.index(item)))
            block = min(45, remaining, 360 - allocations[day])
            block -= block % 15
            if block == 0:
                block = 15
            method_key = effective_methods[method_index % len(effective_methods)]
            method_index += 1
            if math_share == 0:
                focus = "Reading & Writing skill practice"
            elif math_share == 100:
                focus = "Math skill practice"
            else:
                focus = f"Math and Reading & Writing practice · aim for {math_share}% Math overall"
            activities[day].append({
                "durationMinutes": block,
                "focus": focus,
                "method": METHODS[method_key],
            })
            allocations[day] += block
            remaining -= block

        sessions = []
        for day in days:
            if activities[day]:
                sessions.append({"day": day, "activities": activities[day], "durationMinutes": allocations[day]})
        sessions_by_week.append({"week": week, "sessions": sessions, "totalMinutes": weekly_minutes})

    notes = ["This is a flexible study schedule, not a score prediction."]
    if methods == ["unsure"]:
        notes.append("Since you are not sure which methods to use, the plan alternates targeted practice and mistake review.")
    if test_weeks:
        notes.append("Each full-length test is budgeted at 2 hours 15 minutes; use official practice materials when available.")
    return {"weeks": sessions_by_week, "weeklyMinutes": weekly_minutes, "notes": notes}
