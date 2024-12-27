import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function AssignOrder() {
  const location = useLocation();
  const { orderId } = location.state || {}; // Access orderId from navigation state
  const [courierId, setCourierId] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!orderId) {
    return <p>Order ID is missing. Unable to assign the order.</p>;
  }

  const handleAssignOrder = async () => {
    if (!courierId) {
      alert("Please provide a Courier ID.");
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/assign-order/${orderId}`,
        { courierId }
      );
      setSuccessMessage(response.data.message);
      setError(null);
    } catch (error) {
      console.error("Error assigning order:", error);
      setError(error.response?.data?.error || "Failed to assign the order.");
      setSuccessMessage(null);
    }
  };

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <h3>Assign Order</h3>
      <input
        type="text"
        placeholder="Courier ID"
        value={courierId}
        onChange={(e) => setCourierId(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <button onClick={handleAssignOrder}>Assign</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
}

export default AssignOrder;