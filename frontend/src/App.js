import StudentForm from "./StudentForm";
import StudentDetail from "./StudentDetail";
import StudentList from "./StudentList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home or main form page, e.g. http://localhost:3000/ */}
        <Route path="/" element={<StudentForm />} />

        {/* Student detail page, e.g. http://localhost:3000/student/123456 */}
        <Route path="/student/:telephone" element={<StudentDetail />} />

        {/* Student list / search page */}
        <Route path="/students" element={<StudentList />} />
      </Routes>
    </Router>
  );
}

export default App;
