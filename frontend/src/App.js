


// import { useEffect, useState } from "react";

// function App() {
// const [students, setStudents] = useState([]);
// const [riskMap, setRiskMap] = useState({});
// const [actionMap, setActionMap] = useState({});
// const [selectedStudent, setSelectedStudent] = useState(null);
// const [decisionHistory, setDecisionHistory] = useState([]);

// const loadDecisionHistory = (studentId) => {
//   setSelectedStudent(studentId);

//   fetch(`http://127.0.0.1:8000/student-decisions/${studentId}`)
//     .then((res) => res.json())
//     .then((data) => setDecisionHistory(data));
// };



//   useEffect(() => {
//   fetch("http://127.0.0.1:8000/students")
//     .then((res) => res.json())
//     .then((data) => {
//       setStudents(data);

//       data.forEach((student) => {
//         fetch(`http://127.0.0.1:8000/analyze-student/${student.id}`)
//           .then((res) => res.json())
//               .then((result) => {
//         setRiskMap((prev) => ({
//           ...prev,
//           [student.id]: result.risk,
//         }));

//         setActionMap((prev) => ({
//           ...prev,
//           [student.id]: result.action,
//         }));
//       });

//       });
//     });
// }, []);


//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold text-blue-600 mb-6">
//         Student Management Dashboard
//       </h1>

//       <div className="bg-white shadow rounded p-4">
//         {students.length === 0 ? (
//           <p className="text-gray-500">No students found</p>
//         ) : (
//           <table className="w-full border">
//           <thead className="bg-gray-200">
//   <tr>
//     <th className="border p-2">ID</th>
//     <th className="border p-2">Name</th>
//     <th className="border p-2">Attendance</th>
//     <th className="border p-2">Grade</th>
//     <th className="border p-2">Risk</th>
//     <th className="border p-2">Action</th>
//   </tr>
// </thead>
// <tbody>
//   {students.map((s) => (
//     <tr key={s.id}>
//       <td className="border p-2">{s.id}</td>
//       <td className="border p-2">{s.name}</td>
//       <td className="border p-2">{s.attendance}</td>
//       <td className="border p-2">{s.grade}</td>
//       <td className="border p-2">
//         {riskMap[s.id] ? (
//           <span
//             className={`px-3 py-1 rounded text-white text-sm ${
//               riskMap[s.id] === "HIGH"
//                 ? "bg-red-500"
//                 : riskMap[s.id] === "MEDIUM"
//                 ? "bg-yellow-500"
//                 : "bg-green-500"
//             }`}
//           >
//             {riskMap[s.id]}
//           </span>
//         ) : (
//           "Analyzing..."
//         )}
//       </td>
//       <td className="border p-2 text-sm">
//   {actionMap[s.id] ? actionMap[s.id] : "Deciding..."}
// </td>

//     </tr>
//   ))}
// </tbody>

//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;import { useEffect, useState } from "react";
import React, { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);
  const [riskMap, setRiskMap] = useState({});
  const [actionMap, setActionMap] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [decisionHistory, setDecisionHistory] = useState([]);
  const [searchId, setSearchId] = useState("");


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
              setRiskMap((prev) => ({
                ...prev,
                [student.id]: result.risk,
              }));

              setActionMap((prev) => ({
                ...prev,
                [student.id]: result.action,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f2ea] to-[#eef3fb] p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-[#1e3a8a]">
          RVU Student Management
        </h1>
        <p className="text-gray-600 mt-2">
          Agent-based academic risk monitoring dashboard
        </p>
      </div>

      {/* Risk Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/60 backdrop-blur-lg shadow-lg rounded-2xl p-6 border border-white">
          <p className="text-sm text-gray-500">High Risk</p>
          <p className="text-3xl font-bold text-red-500">
            {riskCounts.HIGH}
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-lg shadow-lg rounded-2xl p-6 border border-white">
          <p className="text-sm text-gray-500">Medium Risk</p>
          <p className="text-3xl font-bold text-yellow-500">
            {riskCounts.MEDIUM}
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-lg shadow-lg rounded-2xl p-6 border border-white">
          <p className="text-sm text-gray-500">Low Risk</p>
          <p className="text-3xl font-bold text-green-500">
            {riskCounts.LOW}
          </p>
        </div>
      </div>

      <div className="mb-6 flex justify-center">
  <input
    type="text"
    placeholder="Search by Student ID..."
    value={searchId}
    onChange={(e) => setSearchId(e.target.value)}
    className="w-full md:w-1/3 px-4 py-2 rounded-xl border border-gray-300 
               bg-white/70 backdrop-blur-md shadow-sm
               focus:outline-none focus:ring-2 focus:ring-blue-300"
  />
</div>


      {/* Student Table */}
      <div className="bg-white/60 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-700 border-b">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Attendance</th>
              <th className="p-3">Grade</th>
              <th className="p-3">Risk</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
           {filteredStudents.map((s) => (

              <tr
                key={s.id}
                onClick={() => loadDecisionHistory(s.id)}
                className={`cursor-pointer hover:bg-blue-50 transition ${
                  selectedStudent === s.id ? "bg-blue-100/60" : ""
                }`}
              >
                <td className="p-3">{s.id}</td>
                <td className="p-3 font-medium">{s.name}</td>
                <td className="p-3">{s.attendance}</td>
                <td className="p-3">{s.grade}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs ${
                      riskMap[s.id] === "HIGH"
                        ? "bg-red-500"
                        : riskMap[s.id] === "MEDIUM"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  >
                    {riskMap[s.id]}
                  </span>
                </td>

                <td className="p-3 text-sm text-gray-700">
                  {actionMap[s.id]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Decision History */}
      {selectedStudent && (
        <div className="mt-10 bg-white/60 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-white">
          <h2 className="text-2xl font-semibold text-[#1e3a8a] mb-4">
            Decision History — Student ID {selectedStudent}
          </h2>

          <table className="w-full">
            <thead className="border-b text-gray-600">
              <tr>
                <th className="p-3 text-left">Risk</th>
                <th className="p-3 text-left">Action</th>
                <th className="p-3 text-left">Explanation</th>
                <th className="p-3 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {decisionHistory.map((d, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-3">{d.risk}</td>
                  <td className="p-3">{d.action}</td>
                  <td className="p-3 text-sm">{d.explanation}</td>
                  <td className="p-3 text-sm text-gray-500">
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
