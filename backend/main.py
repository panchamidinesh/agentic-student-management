from fastapi import FastAPI
from models.student import Student

app = FastAPI()

students = []

@app.get("/")
def root():
    return {"message": "Student Agent System Backend is running"}

@app.post("/students")
def add_student(student: Student):
    students.append(student)
    return {"status": "Student added", "student": student}

@app.get("/students")
def get_students():
    return students
