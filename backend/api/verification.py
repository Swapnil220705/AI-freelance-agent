from fastapi import APIRouter
from services.verification_service import verify_repository

router = APIRouter()

@router.post("/verify")
def verify_code(repo_url: str):

    result = verify_repository(repo_url)

    return result