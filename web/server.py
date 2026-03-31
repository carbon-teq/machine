import marimo
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

notebooks_dir = os.path.join(os.path.dirname(__file__), "notebooks")

server = marimo.create_asgi_app(include_code=True).with_dynamic_directory(
    path="/api/notebooks", 
    directory=notebooks_dir
)

app.mount("/", server.build())

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8082)
