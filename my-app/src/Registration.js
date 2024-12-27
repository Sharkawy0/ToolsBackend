import React, { useState } from "react";
import axios from "axios";

function Registration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);  // Log form data

    try {
      // Send form data via POST request
      const response = await axios.post(
        "http://127.0.0.1:5000/register", 
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      console.log("Response:", response.data);  // Log server response
      alert(response.data.message);  // Show success message

      // Optionally reset form data after successful registration
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
      });

      // You can redirect to a different page here if needed
      // e.g., window.location.href = "/login";
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);  // Log errors if any
      alert(error.response?.data?.error || "Registration failed");  // Show error alert
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // full viewport height
        textAlign: "center", // optional: to center the text inside the form
      }}
    >
      <div>
        <h1>Registration Page</h1>
        <form onSubmit={handleSubmit}>
          <div>
            Name :{" "}
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <br />
          <div>
            Email:{" "}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <br />
          <div>
            Phone:{" "}
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <br />
          <div>
            Password:{" "}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <br />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Registration;