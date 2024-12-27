import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request with form data (email and password)
      const response = await axios.post(
        "http://127.0.0.1:5000/login", 
        formData, 
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      console.log("Login Success:", response.data);
      alert(response.data.message); // Show success message on login success

      // Save the authentication token in localStorage
      localStorage.setItem("userToken", response.data.token);
      localStorage.setItem("userEmail", formData.email); 

      // Clear form data
      setFormData({
        email: "",
        password: "",
      });

      // Redirect to the create-order page
      navigate("/create-order");
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Login failed"); // Show error message if login fails
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full viewport height
        textAlign: "center", // Center the text inside the form
      }}
    >
      <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;