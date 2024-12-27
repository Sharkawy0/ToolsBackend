import React, { useState, useEffect } from "react";
import axios from "axios";

function AssignedOrders({ courierId }) {
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedOrders = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/assigned-orders/${courierId}`);
        console.log("Assigned Orders Response:", response.data);
        setAssignedOrders(response.data);
      } catch (error) {
        alert("Error fetching assigned orders: " + (error.response?.data?.error || error.message));
      } finally {
        setIsLoading(false);
      }
    };

    if (courierId) {
      fetchAssignedOrders();
    }
  }, [courierId]);

  return (
    <div>
      <h2>Assigned Orders</h2>
      {isLoading ? (
        <p>Loading assigned orders...</p>
      ) : assignedOrders.length === 0 ? (
        <p>No assigned orders available</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Pickup Location</th>
              <th>Dropoff Location</th>
              <th>Status</th>
              <th>Delivery Time</th>
              <th>Package Details</th>
            </tr>
          </thead>
          <tbody>
            {assignedOrders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.pickup_location}</td>
                <td>{order.dropoff_location}</td>
                <td>{order.status}</td>
                <td>{order.delivery_time}</td>
                <td>{order.package_details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AssignedOrders;