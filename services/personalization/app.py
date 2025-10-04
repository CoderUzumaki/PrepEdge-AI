---

## **2. Backend Starter (FastAPI)** — `services/personalization/app.py`
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from datetime import datetime

app = FastAPI(title="Personalization Service")

# ---- Schemas ----
class Event(BaseModel):
    user_id: str
    activity_type: str
    topic: str
    subtopic: str
    timestamp: datetime
    accuracy: float
    time_taken_seconds: int
    attempts: int
    difficulty: str
    exercise_id: str

class Task(BaseModel):
    description: str
    completed: bool = False

class WeekPlan(BaseModel):
    week_no: int
    topics: List[str]
    tasks: List[Task]
    goal: str

class Roadmap(BaseModel):
    user_id: str
    weeks: List[WeekPlan]

# ---- Mock Database ----
mock_events = []
mock_roadmaps = {
    "u1": Roadmap(
        user_id="u1",
        weeks=[
            WeekPlan(
                week_no=1,
                topics=["arrays", "two-pointer"],
                tasks=[
                    Task(description="Solve 3 practice problems"),
                    Task(description="Watch 2 concept videos"),
                    Task(description="Take revision quiz")
                ],
                goal="Reach avg_accuracy ≥ 0.75"
            )
        ]
    )
}

# ---- Endpoints ----
@app.post("/events")
def add_event(event: Event):
    mock_events.append(event.dict())
    return {"message": "Event recorded", "total_events": len(mock_events)}

@app.get("/user/{user_id}/path", response_model=Roadmap)
def get_roadmap(user_id: str):
    if user_id not in mock_roadmaps:
        raise HTTPException(status_code=404, detail="No roadmap found for this user")
    return mock_roadmaps[user_id]