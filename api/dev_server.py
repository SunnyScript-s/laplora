"""Run the Python API locally: python -m api.dev_server."""

from http.server import ThreadingHTTPServer

from api.study_plan import handler


if __name__ == "__main__":
    ThreadingHTTPServer(("127.0.0.1", 8000), handler).serve_forever()
