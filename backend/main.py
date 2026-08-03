"""Convenience wrapper so `uvicorn main:app` works from the `backend` folder."""
from app.main import app  # re-export the FastAPI application

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
