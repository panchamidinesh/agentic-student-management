# from fastapi import FastAPI
# from models.student import Student

# app = FastAPI()

# students = []

# @app.get("/")
# def root():
#     return {"message": "Student Agent System Backend is running"}

# @app.post("/students")
# def add_student(student: Student):
#     students.append(student)
#     return {"status": "Student added", "student": student}

# @app.get("/students")
# def get_students():
#     return students


# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from models.student import Student
# from graph.student_risk_graph import student_risk_graph
# from db.database import init_db, get_connection
# from typing import List




# app = FastAPI()
# init_db()


# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # students = []

# @app.get("/students")
# def get_students():
#     conn = get_connection()
#     cursor = conn.cursor()

#     cursor.execute("SELECT id, name, attendance, grade FROM students")
#     rows = cursor.fetchall()

#     conn.close()

#     return [
#         {
#             "id": row[0],
#             "name": row[1],
#             "attendance": row[2],
#             "grade": row[3]
#         }
#         for row in rows
#     ]




# @app.post("/students/bulk")
# def add_students_bulk(students_list: List[Student]):
#     conn = get_connection()
#     cursor = conn.cursor()

#     for student in students_list:
#         cursor.execute(
#             "INSERT OR REPLACE INTO students (id, name, attendance, grade) VALUES (?, ?, ?, ?)",
#             (student.id, student.name, student.attendance, student.grade)
#         )

#     conn.commit()
#     conn.close()

#     return {
#         "status": "Bulk insert successful",
#         "count": len(students_list)
#     }



# # @app.get("/students")
# # def get_students():
# #     return students


# @app.get("/analyze-student/{student_id}")
# def analyze_student(student_id: int):
#     conn = get_connection()
#     cursor = conn.cursor()

#     cursor.execute(
#         "SELECT id, name, attendance, grade FROM students WHERE id = ?",
#         (student_id,)
#     )
    
#         @app.get("/student-decisions/{student_id}")
#     def get_student_decisions(student_id: int):
#         conn = get_connection()
#         cursor = conn.cursor()

#         cursor.execute(
#             """
#             SELECT risk, action, explanation, created_at
#             FROM student_decisions
#             WHERE student_id = ?
#             ORDER BY created_at DESC
#             """,
#             (student_id,)
#         )

#         rows = cursor.fetchall()
#         conn.close()

#         return [
#             {
#                 "risk": row[0],
#                 "action": row[1],
#                 "explanation": row[2],
#                 "timestamp": row[3]
#             }
#             for row in rows
#         ]


#     row = cursor.fetchone()
#     conn.close()

#     if not row:
#         return {"error": "Student not found"}

#     result = student_risk_graph.invoke({
#         "attendance": row[2],
#         "grade": row[3],
#         "risk": "",
#         "action": "",
#         "explanation": ""
#     })
    
    
#     conn = get_connection()
# cursor = conn.cursor()

# cursor.execute(
#     """
#     INSERT INTO student_decisions 
#     (student_id, risk, action, explanation)
#     VALUES (?, ?, ?, ?)
#     """,
#     (
#         row[0],
#         result["risk"],
#         result["action"],
#         result["explanation"]
#     )
# )

# conn.commit()
# conn.close()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from models.student import Student
from graph.student_risk_graph import student_risk_graph
from db.database import init_db, get_connection

app = FastAPI()
init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- STUDENTS --------------------

@app.get("/students")
def get_students():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, name, attendance, grade FROM students")
    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "id": row[0],
            "name": row[1],
            "attendance": row[2],
            "grade": row[3],
        }
        for row in rows
    ]


@app.post("/students/bulk")
def add_students_bulk(students_list: List[Student]):
    conn = get_connection()
    cursor = conn.cursor()

    for student in students_list:
        cursor.execute(
            "INSERT OR REPLACE INTO students (id, name, attendance, grade) VALUES (?, ?, ?, ?)",
            (student.id, student.name, student.attendance, student.grade),
        )

    conn.commit()
    conn.close()

    return {
        "status": "Bulk insert successful",
        "count": len(students_list),
    }

# -------------------- ANALYSIS --------------------

@app.get("/analyze-student/{student_id}")
def analyze_student(student_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id, name, attendance, grade FROM students WHERE id = ?",
        (student_id,),
    )
    row = cursor.fetchone()

    if not row:
        conn.close()
        return {"error": "Student not found"}

    result = student_risk_graph.invoke(
        {
            "attendance": row[2],
            "grade": row[3],
            "risk": "",
            "action": "",
            "explanation": "",
        }
    )

    cursor.execute(
        """
        INSERT INTO student_decisions
        (student_id, risk, action, explanation)
        VALUES (?, ?, ?, ?)
        """,
        (
            row[0],
            result["risk"],
            result["action"],
            result["explanation"],
        ),
    )

    conn.commit()
    conn.close()

    return {
        "id": row[0],
        "name": row[1],
        "risk": result["risk"],
        "action": result["action"],
        "explanation": result["explanation"],
    }

# -------------------- DECISION HISTORY --------------------

@app.get("/student-decisions/{student_id}")
def get_student_decisions(student_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT risk, action, explanation, created_at
        FROM student_decisions
        WHERE student_id = ?
        ORDER BY created_at DESC
        """,
        (student_id,),
    )

    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "risk": row[0],
            "action": row[1],
            "explanation": row[2],
            "timestamp": row[3],
        }
        for row in rows
    ]
