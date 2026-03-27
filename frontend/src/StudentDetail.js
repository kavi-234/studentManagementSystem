import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function StudentDetail() {
  const { telephone } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`http://localhost:5036/api/student/${telephone}`);
        if (!response.ok) {
          throw new Error("Student not found");
        }
        const data = await response.json();
        setStudent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (telephone) {
      fetchStudent();
    }
  }, [telephone]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!student) {
    return <div>No student data.</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Student Detail</h2>
      <p><strong>Full Name:</strong> {student.fullName}</p>
      <p><strong>Address:</strong> {student.address}</p>
      <p><strong>Date of Birth:</strong> {student.dateOfBirth}</p>
      <p><strong>Gender:</strong> {student.gender}</p>
      <p><strong>Email:</strong> {student.email}</p>
      <p><strong>Telephone:</strong> {student.telephone}</p>
    </div>
  );
}

export default StudentDetail;
