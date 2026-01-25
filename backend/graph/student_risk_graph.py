from typing import TypedDict
from langgraph.graph import StateGraph



class StudentState(TypedDict):
    attendance: float
    grade: float
    risk: str
    action: str
    explanation: str


# 2. Define a node (function)
def analyze_risk(state: StudentState) -> StudentState:
    attendance = state["attendance"]
    grade = state["grade"]

    if attendance < 65 and grade < 6:
        state["risk"] = "HIGH"
    elif attendance < 75 or grade < 7:
        state["risk"] = "MEDIUM"
    else:
        state["risk"] = "LOW"

    return state





def low_risk_agent(state: StudentState) -> StudentState:
    state["action"] = "No action needed"
    state["explanation"] = (
        "Attendance and grade are within acceptable ranges, "
        "indicating no immediate academic risk."
    )
    return state


def medium_risk_agent(state: StudentState) -> StudentState:
    state["action"] = "Issue warning and monitor performance"
    state["explanation"] = (
        "Either attendance or grade is below the expected threshold, "
        "which may impact performance if not addressed."
    )
    return state


def high_risk_agent(state: StudentState) -> StudentState:
    state["action"] = "Immediate counseling and parent notification"
    state["explanation"] = (
        "Attendance is below 65% and grade is below 6.0, "
        "indicating a high likelihood of academic failure."
    )
    return state


def route_by_risk(state: StudentState) -> str: #This function decides which agent to call next.
    return state["risk"]

graph = StateGraph(StudentState)

graph.add_node("analyze_risk", analyze_risk)
graph.add_node("low_risk_agent", low_risk_agent)
graph.add_node("medium_risk_agent", medium_risk_agent)
graph.add_node("high_risk_agent", high_risk_agent)

graph.set_entry_point("analyze_risk")

graph.add_conditional_edges(
    "analyze_risk",
    route_by_risk,
    {
        "LOW": "low_risk_agent",
        "MEDIUM": "medium_risk_agent",
        "HIGH": "high_risk_agent",
    }
)

graph.set_finish_point("low_risk_agent")
graph.set_finish_point("medium_risk_agent")
graph.set_finish_point("high_risk_agent")

student_risk_graph = graph.compile()


