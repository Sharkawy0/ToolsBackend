import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userEmail = localStorage.getItem("userEmail");
    setIsAuthenticated(!!token && !!userEmail); // Check both token and email
  
    if (isAuthenticated) {
      const fetchOrders = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:5000/my-orders", {
            headers: {
              "User-Email": userEmail, // Ensure correct key is used
            },
          });
  
          // Check and log the response to see the structure
          console.log("API Response:", response.data);
  
          // Ensure the response data contains an orders array
          const orders = Array.isArray(response.data.orders) ? response.data.orders : [];
  
          console.log("Orders:", orders);  // Log orders response
          setOrders(orders); // Update orders state with fetched data
          setLoading(false); // Set loading to false when data is fetched
        } catch (error) {
          console.error("Error fetching orders:", error);
          setError("Failed to fetch orders"); // Handle error case
          setLoading(false); // Set loading to false on error
        }
      };
  
      fetchOrders();
    } else {
      setLoading(false); // Ensure loading stops if not authenticated
    }
  }, [isAuthenticated]); // Re-run effect when isAuthenticated changes  

  //if (!isAuthenticated) return <Navigate to="/login" />; // Redirect if not authenticated
  if (loading) return <div>Loading your orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Pickup Location</th>
              <th>Dropoff Location</th>
              <th>Package Details</th>
              <th>Delivery Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{order.pickup_location}</td>
                <td>{order.dropoff_location}</td>
                <td>{order.package_details}</td>
                <td>{new Date(order.delivery_time).toLocaleString()}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyOrders;