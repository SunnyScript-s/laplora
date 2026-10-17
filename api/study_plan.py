"""Vercel Python function for the stateless study-week planner."""

import json
from http.server import BaseHTTPRequestHandler

from api.study_planner import PlannerError, build_plan


class handler(BaseHTTPRequestHandler):  # Vercel's Python runtime discovers this class.
    def _respond(self, status: int, body: dict) -> None:
        encoded = json.dumps(body, separators=(",", ":")).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.send_header("Cache-Control", "no-store, max-age=0")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(encoded)

    def do_POST(self) -> None:  # noqa: N802 - BaseHTTPRequestHandler API
        if self.path != "/api/study_plan":
            self._respond(404, {"error": "Not found."})
            return
        try:
            try:
                length = int(self.headers.get("Content-Length", "0"))
            except ValueError:
                self._respond(400, {"error": "Please send a small valid JSON request."})
                return
            if length <= 0 or length > 10_000:
                self._respond(413 if length > 10_000 else 400, {"error": "Please send a small valid JSON request."})
                return
            if "application/json" not in self.headers.get("Content-Type", ""):
                self._respond(415, {"error": "Send planner preferences as JSON."})
                return
            payload = json.loads(self.rfile.read(length))
            self._respond(200, build_plan(payload))
        except (json.JSONDecodeError, UnicodeDecodeError):
            self._respond(400, {"error": "The planner request was not valid JSON."})
        except PlannerError as error:
            self._respond(422, {"error": str(error)})

    def do_GET(self) -> None:  # noqa: N802
        if self.path == "/api/study_plan":
            self._respond(405, {"error": "Use POST to build a study plan."})
        else:
            self._respond(404, {"error": "Not found."})

    def log_message(self, _format: str, *_args: object) -> None:
        # Request bodies and paths are intentionally excluded from local server logs.
        return
