# import sqlite3

# DB_NAME = "students.db"

# def get_connection():
#     return sqlite3.connect(DB_NAME)

# # def init_db():
# #     conn = get_connection()
# #     cursor = conn.cursor()
    
    
# #     cursor.execute("""
# #         CREATE TABLE IF NOT EXISTS student_decisions (
# #             id INTEGER PRIMARY KEY AUTOINCREMENT,
# #             student_id INTEGER,
# #             risk TEXT,
# #             action TEXT,
# #             explanation TEXT,
# #             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# #         )
# #     """)





#     conn.commit()
#     conn.close()



#     conn.commit()
#     conn.close()


import sqlite3

DB_NAME = "students.db"


def get_connection():
    return sqlite3.connect(DB_NAME)


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Students table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY,
        name TEXT,
        attendance REAL,
        grade REAL
    )
    """)

    # Subjects table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        subject_name TEXT,
        attendance REAL,
        grade REAL,
        FOREIGN KEY (student_id) REFERENCES students(id)
    )
    """)

    # Decision history table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_decisions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        risk TEXT,
        action TEXT,
        intervention TEXT,
        explanation TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id)
    )
    """)

    conn.commit()
    conn.close()
