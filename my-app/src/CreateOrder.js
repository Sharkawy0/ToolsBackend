import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateOrder() {
  const [formData, setFormData] = useState({
    pickup_location: "",
    dropoff_location: "",
    package_details: "",
    delivery_time: "",
    status: "In Progress", // Default status
  });
  const [loading, setLoading] = useState(false); // To handle loading state
  const navigate = useNavigate(); // For navigation

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Order Data:", formData);

    const userEmail = localStorage.getItem("userEmail"); // Retrieve email from localStorage
    if (!userEmail) {
      alert("User email is missing. Please log in again.");
      navigate("/login");
      return;
    }

    const orderData = { ...formData, user_email: userEmail }; // Append user email to order data
    setLoading(true); // Show loading indicator

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/create-order",
        orderData,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("userToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Order Response:", response.data); // Log response for debugging
      alert(response.data.message); // Show success message

      // Navigate to the Order Options page with order ID
      const orderId = response.data?.order_id;
      if (!orderId) {
        alert("Order created successfully, but the order ID is missing.");
        return;
      }
      navigate("/order-options", { state: { orderId } });
    } catch (error) {
      console.error("Error creating order:", error); // Log error
      alert(error.response?.data?.error || "Failed to create the order.");
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full viewport height
        textAlign: "center", // Center text inside the form
      }}
    >
      <div>
        <h1>Create Order</h1>
        <form onSubmit={handleSubmit}>
          {/* Pickup Location */}
          <div>
            <label htmlFor="pickup_location">Pickup Location:</label>
            <input
              type="text"
              id="pickup_location"
              name="pickup_location"
              placeholder="Enter Pickup Location"
              value={formData.pickup_location}
              onChange={handleChange}
              required
            />
          </div>
          <br />

          {/* Dropoff Location */}
          <div>
            <label htmlFor="dropoff_location">Dropoff Location:</label>
            <input
              type="text"
              id="dropoff_location"
              name="dropoff_location"
              placeholder="Enter Dropoff Location"
              value={formData.dropoff_location}
              onChange={handleChange}
              required
            />
          </div>
          <br />

          {/* Package Details */}
          <div>
            <label htmlFor="package_details">Package Details:</label>
            <textarea
              id="package_details"
              name="package_details"
              placeholder="Enter Package Details"
              value={formData.package_details}
              onChange={handleChange}
              required
            />
          </div>
          <br />

          {/* Delivery Time */}
          <div>
            <label htmlFor="delivery_time">Delivery Time:</label>
            <input
              type="datetime-local"
              id="delivery_time"
              name="delivery_time"
              value={formData.delivery_time}
              onChange={handleChange}
              required
            />
          </div>
          <br />

          {/* Submit Button */}
          <button type="submit" disabled={loading}>
            {loading ? "Creating Order..." : "Create Order"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateOrder;