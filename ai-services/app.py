from fastapi import FastAPI
from pydantic import BaseModel
from matcher import match_skills

app = FastAPI()


class MatchRequest(BaseModel):
    student_skills: list[str]
    job_skills: list[str]


@app.get("/")
def home():
    return {"message": "AI Job Recommendation Service is Running!"}


@app.post("/match")
def match(request: MatchRequest):
    result = match_skills(
        request.student_skills,
        request.job_skills
    )

    return result
