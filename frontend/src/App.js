import React, { useEffect, useState } from "react";
import Login from "./login";

function App() {
  const [students, setStudents] = useState([]);
  const [riskMap, setRiskMap] = useState({});
  const [actionMap, setActionMap] = useState({});
  const [interventionMap, setInterventionMap] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [decisionHistory, setDecisionHistory] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const [subjectsMap, setSubjectsMap] = useState({});
// const [loadingSubjects, setLoadingSubjects] = useState(false);




  const loadDecisionHistory = (studentId) => {
    setSelectedStudent(studentId);
    fetch(`http://127.0.0.1:8000/student-decisions/${studentId}`)
      .then((res) => res.json())
      .then((data) => setDecisionHistory(data));
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/students")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        data.forEach((student) => {
          fetch(`http://127.0.0.1:8000/analyze-student/${student.id}`)
            .then((res) => res.json())
            .then((result) => {
              setRiskMap((prev) => ({ ...prev, [student.id]: result.risk }));
              setActionMap((prev) => ({ ...prev, [student.id]: result.action }));
              setInterventionMap((prev) => ({
                ...prev,
                [student.id]: result.intervention,
              }));
            });
        });
      });
  }, []);






  const riskCounts = {
    HIGH: Object.values(riskMap).filter((r) => r === "HIGH").length,
    MEDIUM: Object.values(riskMap).filter((r) => r === "MEDIUM").length,
    LOW: Object.values(riskMap).filter((r) => r === "LOW").length,
  };

  const filteredStudents = students.filter((s) =>
    searchId === "" ? true : s.id.toString().includes(searchId)
  );

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] p-10">
  <div className="mb-14 relative">
  {/* Logout Button */}
  <button
    onClick={() => setIsAuthenticated(false)}
    className="absolute right-0 top-0 px-4 py-2 rounded-xl
               bg-red-100 text-red-700 font-medium
               hover:bg-red-200 transition"
  >
    Logout
  </button>

  {/* Title */}
  <div className="text-center">
    <h1 className="text-5xl font-semibold tracking-tight text-[#1e3a8a]">
      RVU Student Management
    </h1>
    <p className="mt-3 text-sm uppercase tracking-widest text-gray-500">
      Agent-based academic risk monitoring
    </p>
  </div>
</div>


      {/* Risk Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[
          ["High Risk", riskCounts.HIGH, "bg-red-500"],
          ["Medium Risk", riskCounts.MEDIUM, "bg-yellow-400"],
          ["Low Risk", riskCounts.LOW, "bg-green-500"],
        ].map(([label, value, color]) => (
          <div
            key={label}
            className="relative bg-white rounded-2xl p-6 shadow-md
                       hover:-translate-y-1 hover:shadow-xl transition-all"
          >
            <div className={`absolute left-0 top-0 h-full w-1 ${color} rounded-l-2xl`} />
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-2 text-4xl font-bold text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex justify-center mb-12">
        <div className="relative w-full md:w-1/2">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by Student ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl
                       bg-white shadow-md border border-gray-200
                       focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <table className="w-full">
          <thead className="border-b text-gray-600">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Attendance</th>
              <th className="p-3 text-left">Grade</th>
              <th className="p-3 text-left">Risk</th>
              <th className="p-3 text-left">Action & Intervention</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => (
              <tr
                key={s.id}
                onClick={() => loadDecisionHistory(s.id)}
                className={`group cursor-pointer even:bg-gray-50
                            hover:bg-blue-50 transition ${
                              selectedStudent === s.id ? "bg-blue-50" : ""
                            }`}
              >
                <td className="p-3">{s.id}</td>
                <td className="p-3 font-semibold text-gray-800">{s.name}</td>
                <td className="p-3">{s.attendance}</td>
                <td className="p-3">{s.grade}</td>

                <td className="p-3">
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-semibold
                      ${
                        riskMap[s.id] === "HIGH"
                          ? "bg-red-100 text-red-700"
                          : riskMap[s.id] === "MEDIUM"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                  >
                    {riskMap[s.id]}
                  </span>
                </td>

                <td className="p-3 space-y-1">
                  <p className="font-medium text-gray-800">
                    {actionMap[s.id]}
                  </p>
                  <p className="text-xs italic text-gray-500">
                    {interventionMap[s.id]}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Decision History */}
{selectedStudent && (
  <div className="mt-14 bg-white rounded-2xl shadow-xl p-8">
    <h2 className="text-2xl font-semibold text-[#1e3a8a] mb-6">
      Decision History — Student ID {selectedStudent}
    </h2>

    <table className="w-full">
      <thead className="border-b text-gray-500">
        <tr>
          <th className="p-3 text-left">Risk</th>
          <th className="p-3 text-left">Action</th>
          <th className="p-3 text-left">Intervention</th>
          <th className="p-3 text-left">Explanation</th>
          <th className="p-3 text-left">Time</th>
        </tr>
      </thead>
      <tbody>
        {decisionHistory.map((d, idx) => (
          <tr key={idx} className="border-b last:border-none">
            <td className="p-3">{d.risk}</td>
            <td className="p-3">{d.action}</td>
            <td className="p-3">{d.intervention}</td>
            <td className="p-3 text-sm text-gray-600">
              {d.explanation}
            </td>
            <td className="p-3 text-sm text-gray-400">
              {d.timestamp}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}





    </div>

    

    
  );
}

export default App;
