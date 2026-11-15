#!/usr/bin/env python3
"""Confirm that the GitHub Pages release is served over the public HTTPS URL."""
import sys
import time
import urllib.error
import urllib.request

URL = "https://grobovchik797.github.io/self-development-platform/"
EXPECTED = [
    'lang="ru"',
    "<title>Саморазвитие",
    'name="robots" content="noindex,nofollow,noarchive"',
    "const LESSONS",
    "const CHAPTERS",
]

for attempt in range(1, 13):
    try:
        request = urllib.request.Request(
            URL, headers={
                "User-Agent": "Samorazvitie-Pages-Healthcheck/1.0",
                "Cache-Control": "no-cache",
            }
        )
        with urllib.request.urlopen(request, timeout=12) as response:
            code = response.status
            location = response.geturl()
            body = response.read(250_000).decode("utf-8", errors="replace")
        missing = [token for token in EXPECTED if token not in body]
        if code != 200 or missing:
            raise RuntimeError(
                f"status={code}, url={location}, chars={len(body)}, missing={missing}"
            )
        print(f"PASS: Public GitHub Pages serves the actual Samorazvitie HTML (HTTP {code}; {len(body)} characters) at {location}")
        sys.exit(0)
    except (urllib.error.URLError, RuntimeError, TimeoutError) as error:
        print(f"Attempt {attempt}/12: {type(error).__name__}: {error}", flush=True)
        if attempt < 12:
            time.sleep(7)
print("FAIL: live URL did not serve the expected site; deploy is not verified.")
sys.exit(1)
