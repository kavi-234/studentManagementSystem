import React, { useState } from "react";
import "./StudentForm.css";

function StudentForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    dob: "",
    gender: "",
    email: "",
    telephone: "",
  });

  const [students, setStudents] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdd = () => {
    setStudents([...students, formData]);
    setFormData({
      fullName: "",
      address: "",
      dob: "",
      gender: "",
      email: "",
      telephone: "",
    });
  };

  const handleSubmit = async () => {
    if (students.length === 0) {
      alert("Please add at least one student before submitting.");
      return;
    }

    try {
      for (const s of students) {
        const response = await fetch("http://localhost:5036/api/student", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: s.fullName,
            address: s.address,
            dateOfBirth: s.dob,
            gender: s.gender,
            email: s.email,
            telephone: s.telephone,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save a student");
        }
      }

      alert("Students submitted successfully.");
    } catch (error) {
      console.error(error);
      alert("There was an error submitting students.");
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <h2>Student Registration</h2>

        <div className="form-grid">
          <label>Full Name</label>
          <input name="fullName" value={formData.fullName} onChange={handleChange} />

          <label>Address</label>
          <input name="address" value={formData.address} onChange={handleChange} />

          <label>Date of Birth</label>
          <div className="dob-gender">
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} />


          <div className="gender">
          <span>Gender</span>
          <label>
            <input type="radio" name="gender" value="Male" onChange={handleChange} />
           Male
         </label>
         <label>
         <input type="radio" name="gender" value="Female" onChange={handleChange} />
          Female
         </label>
        </div>
</div>

          <label>Email</label>
          <input name="email" value={formData.email} onChange={handleChange} />

          <label>Telephone</label>
          <input name="telephone" value={formData.telephone} onChange={handleChange} />
        </div>

        <div className="add-btn-container">
          <button className="add-btn" onClick={handleAdd}>
            Add
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Email</th>
              <th>Telephone</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, index) => (
              <tr key={index}>
                <td>{s.fullName}</td>
                <td>{s.dob}</td>
                <td>{s.email}</td>
                <td>{s.telephone}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="submit-container">
          <button className="submit-btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentForm;