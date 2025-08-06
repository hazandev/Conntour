
import sys
import traceback
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
import datetime
import os

class ErrorLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            return await call_next(request)
        except Exception:
            exc_type, exc_value, exc_traceback = traceback.sys.exc_info()
            tb_info = traceback.extract_tb(exc_traceback)
            
            if tb_info:
                filename, line, _, _ = tb_info[-1]
                file_name_only = os.path.basename(filename)
            else:
                file_name_only = "N/A"
                line = "N/A"

            timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            error_type = exc_type.__name__ if exc_type else "UnknownException"
            
            description = str(exc_value)
            if len(description.split()) > 30:
                description = " ".join(description.split()[:30]) + "..."
            
            log_message = f"{timestamp} – {error_type} in {file_name_only}:{line} at {request.url.path} – {description}"

            print(log_message, file=sys.stderr)

            return JSONResponse(
                status_code=500,
                content={"detail": "An unexpected error occurred. Please check the logs."},
            )
