import React, { useState } from "react";
import "./StudentForm.css";

function StudentForm() {
  const initialFormData = {
    fullName: "",
    address: "",
    dob: "",
    gender: "",
    email: "",
    telephone: "",
  };

  const [formData, setFormData] = useState({
    ...initialFormData,
  });

  const [students, setStudents] = useState([]);
  const [errors, setErrors] = useState({});

  const validateStudent = (data) => {
    const validationErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const tenDigitPhoneRegex = /^\d{10}$/;

    if (!data.fullName.trim()) {
      validationErrors.fullName = "Full name is required.";
    } else if (data.fullName.trim().length < 2) {
      validationErrors.fullName = "Full name must be at least 2 characters.";
    }

    if (!data.address.trim()) {
      validationErrors.address = "Address is required.";
    }

    if (!data.dob) {
      validationErrors.dob = "Date of birth is required.";
    } else {
      const selectedDate = new Date(data.dob);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        validationErrors.dob = "Date of birth cannot be in the future.";
      }
    }

    if (!data.gender) {
      validationErrors.gender = "Gender is required.";
    }

    if (!data.email.trim()) {
      validationErrors.email = "Email is required.";
    } else if (!emailRegex.test(data.email.trim())) {
      validationErrors.email = "Enter a valid email address.";
    }

    if (!data.telephone.trim()) {
      validationErrors.telephone = "Telephone is required.";
    } else if (!tenDigitPhoneRegex.test(data.telephone.trim())) {
      validationErrors.telephone = "Telephone must contain exactly 10 digits.";
    } else if (students.some((s) => s.telephone === data.telephone.trim())) {
      validationErrors.telephone = "This telephone number already exists in the list.";
    }

    return validationErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const normalizedValue =
      name === "telephone" ? value.replace(/\D/g, "").slice(0, 10) : value;

    setFormData((prev) => ({ ...prev, [name]: normalizedValue }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAdd = () => {
    const trimmedFormData = {
      ...formData,
      fullName: formData.fullName.trim(),
      address: formData.address.trim(),
      email: formData.email.trim(),
      telephone: formData.telephone.trim(),
    };

    const validationErrors = validateStudent(trimmedFormData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStudents((prev) => [...prev, trimmedFormData]);
    setFormData({ ...initialFormData });
    setErrors({});
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
          <div className="field-group">
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? "input-error" : ""}
            />
            {errors.fullName && <small className="error-text">{errors.fullName}</small>}
          </div>

          <label>Address</label>
          <div className="field-group">
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? "input-error" : ""}
            />
            {errors.address && <small className="error-text">{errors.address}</small>}
          </div>

          <label>Date of Birth</label>
          <div className="dob-gender">
          <div className="field-group">
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className={errors.dob ? "input-error" : ""}
            />
            {errors.dob && <small className="error-text">{errors.dob}</small>}
          </div>


          <div className="gender">
          <span>Gender</span>
          <label>
            <input type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleChange} />
           Male
         </label>
         <label>
         <input type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleChange} />
          Female
         </label>
         {errors.gender && <small className="error-text">{errors.gender}</small>}
        </div>
</div>

          <label>Email</label>
          <div className="field-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <small className="error-text">{errors.email}</small>}
          </div>

          <label>Telephone</label>
          <div className="field-group">
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              maxLength={10}
              placeholder="10-digit number"
              className={errors.telephone ? "input-error" : ""}
            />
            {errors.telephone && <small className="error-text">{errors.telephone}</small>}
          </div>
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