import git
import os
import subprocess
import shutil
from agents.code_judge import llm_code_review

REPO_DIR = "temp_repo"


def clone_repo(repo_url):

    if os.path.exists(REPO_DIR):
        shutil.rmtree(REPO_DIR)

    git.Repo.clone_from(repo_url, REPO_DIR)

    return REPO_DIR

def run_tests(repo_path):

    try:
        result = subprocess.run(
            ["pytest"],
            cwd=repo_path,
            capture_output=True,
            text=True
        )

        passed = result.returncode == 0

        return {
            "tests_passed": passed,
            "test_output": result.stdout
        }

    except Exception as e:
        return {
            "tests_passed": False,
            "error": str(e)
        }

def check_code_quality(repo_path):

    result = subprocess.run(
        ["radon", "cc", repo_path],
        capture_output=True,
        text=True
    )

    return result.stdout

def verify_repository(repo_url):

    repo_path = clone_repo(repo_url)

    test_result = run_tests(repo_path)

    quality = check_code_quality(repo_path)

    with open(f"{repo_path}/README.md","r") as f:
        code_sample = f.read()

    llm_score = llm_code_review(code_sample)

    return {
        "tests_passed": test_result["tests_passed"],
        "quality": quality,
        "llm_score": llm_score
    }