from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from middlewares.error_handler import ErrorLoggingMiddleware

app = FastAPI(
    title="Space Explorer API",
    description="An API for exploring space images and managing search history.",
    version="1.0.0",
)

# Error Handling Middleware
app.add_middleware(ErrorLoggingMiddleware)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the Space Explorer API!"}

# Optional: Add uvicorn runner for direct execution
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
