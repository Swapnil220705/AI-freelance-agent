from fastapi import FastAPI
from database import engine
from api import projects
from api import verification

app = FastAPI(title="Autonomous Freelance Agent")
app.include_router(projects.router)

@app.get("/")
def root():
    return {"message": "AI Freelance Agent Running"}

@app.get("/db-test")
def db_test():
    return {"database": "connected"}

app.include_router(verification.router)