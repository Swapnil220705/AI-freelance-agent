from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.project import Project
from models.milestone import Milestone
from agents.requirement_agent import generate_milestones

router = APIRouter()

@router.post("/generate-milestones")
def generate_project_milestones(project_id: str, description: str, db: Session = Depends(get_db)):

    result = generate_milestones(description)

    for m in result["milestones"]:
        milestone = Milestone(
            project_id=project_id,
            title=m["title"],
            description=m["description"],
            payout_percentage=m["payout_percentage"],
            status="pending"
        )

        db.add(milestone)

    db.commit()

    return {"message":"Milestones generated"}

@router.post("/project/create")
def create_project(title: str, description: str, budget: int, db: Session = Depends(get_db)):

    project = Project(
        title=title,
        description=description,
        budget=budget,
        status="planning"
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project

@router.get("/project/{project_id}/milestones")
def get_project_milestones(project_id: str, db: Session = Depends(get_db)):

    milestones = db.query(Milestone).filter(Milestone.project_id == project_id).all()

    return milestones