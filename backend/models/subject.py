from pydantic import BaseModel

class Subject(BaseModel):
    subject_name: str
    attendance: float
    grade: float
