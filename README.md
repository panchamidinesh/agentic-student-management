# Agentic Student Management System

An agent-based academic monitoring system designed to help faculty identify at-risk students, recommend interventions, and track decision history through a structured multi-agent workflow.

---

## 🚀 Project Overview

This project implements an **agentic student management platform** where multiple decision-making agents collaboratively analyze student data such as attendance and grades to determine academic risk, actions, and interventions.

The system is built with a **FastAPI backend**, a **React + Tailwind CSS frontend**, and an **SQLite database** for persistence. It is designed to be extensible, allowing future enhancements like subject-level risk analysis and advanced analytics.

---

## 🧠 Agentic Architecture

The backend uses **LangGraph** to orchestrate multiple agents, each with a single responsibility:

1. **Risk Analysis Agent**
   - Evaluates attendance and grade to classify students as HIGH, MEDIUM, or LOW risk.

2. **Action Agents**
   - Decide the recommended academic action based on the risk level.

3. **Intervention Agent**
   - Suggests concrete intervention steps such as counseling, mentoring, or monitoring.

Each agent updates a shared state, forming a clear and modular decision pipeline.

---

## 🖥️ Features

- Secure login for teaching staff
- Student risk classification (High / Medium / Low)
- Action and intervention recommendations
- Decision history tracking
- Persistent database storage
- Premium, responsive dashboard UI
- Search by student ID
- Extensible design for future subject-wise analysis

---

## 🛠️ Tech Stack

**Backend**
- Python
- FastAPI
- LangGraph
- SQLite

**Frontend**
- React
- Tailwind CSS

**Tools**
- Git & GitHub
- VS Code

---

## ⚙️ Setup Instructions

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # On Windows
pip install -r requirements.txt
uvicorn main:app --reload
