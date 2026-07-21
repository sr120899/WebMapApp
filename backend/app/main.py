from pathlib import Path

from fastapi import FastAPI
from starlette.exceptions import HTTPException
from starlette.staticfiles import StaticFiles
from starlette.types import Scope

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

app = FastAPI(title="WebMapApp API")


@app.get("/health")
def health_check():
    return {"status": "healthy"}


class SPAStaticFiles(StaticFiles):
    """Falls back to index.html for unknown paths, so client-side routes work."""

    async def get_response(self, path: str, scope: Scope):
        try:
            return await super().get_response(path, scope)
        except HTTPException as exc:
            if exc.status_code != 404:
                raise
            return await super().get_response("index.html", scope)


app.mount(
    "/",
    SPAStaticFiles(directory=STATIC_DIR, html=True, check_dir=False),
    name="static",
)
