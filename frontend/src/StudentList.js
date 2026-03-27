import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./StudentForm.css";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTelephone, setSearchTelephone] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:5036/api/student");
        if (!response.ok) {
          throw new Error("Failed to load students");
        }
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const term = searchTelephone.trim();

    if (!term) {
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter((s) =>
      (s.telephone || "").toLowerCase().includes(term.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const handleDelete = async (telephone) => {
    if (!telephone) return;

    const shouldDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!shouldDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5036/api/student/${encodeURIComponent(telephone)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      const updatedStudents = students.filter((s) => s.telephone !== telephone);
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
      setSuccessMessage("Student deleted successfully");
      setTimeout(() => setSuccessMessage(""), 2500);
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  if (loading) {
    return <div className="container">Loading students...</div>;
  }

  if (error) {
    return <div className="container">{error}</div>;
  }

  return (
    <div className="container">
      <div className="form-box">
        <h2>Student List</h2>

        {successMessage && <div className="success-alert">{successMessage}</div>}

        <form className="search-row" onSubmit={handleSearch}>
          <label htmlFor="telephone-search">Telephone</label>
          <input
            id="telephone-search"
            type="text"
            value={searchTelephone}
            onChange={(e) => setSearchTelephone(e.target.value)}
            placeholder="Enter telephone number"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Email</th>
              <th>Telephone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s.id}>
                <td>{s.fullName}</td>
                <td>
                  {s.dateOfBirth
                    ? String(s.dateOfBirth).substring(0, 10)
                    : ""}
                </td>
                <td>{s.email}</td>
                <td>{s.telephone}</td>
                <td>
                  <div className="action-icons">
                    <Link
                      to={`/student/${encodeURIComponent(s.telephone || "")}`}
                      className="action-link"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      className="icon-btn delete-btn"
                      onClick={() => handleDelete(s.telephone)}
                      aria-label="Delete student"
                      title="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentList;
