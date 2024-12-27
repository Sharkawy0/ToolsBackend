import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function OrderOptions() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};
  const courierId = localStorage.getItem("courierId");
  const [assignedOrders, setAssignedOrders] = useState([]); 
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    if (courierId) {
      axios
        .get(`http://127.0.0.1:5000:3000/assigned-orders/${courierId}`)
        .then((response) => {
          setAssignedOrders(response.data); 
          setError(null); // Clear error if data is fetched successfully
        })
        .catch((error) => {
          console.error("Error fetching assigned orders:", error);
          setError("Failed to load assigned orders.");
        });
    }
  }, [courierId]);

  const goToMyOrders = () => {
    navigate("/my-orders");
  };

  const goToOrderDetails = () => {
    if (!orderId) {
      alert("Order ID is missing. Unable to navigate to order details.");
      return;
    }
    navigate(`/order-details/${orderId}`);
  };

  const goToAssignOrders = () => {
    if (!orderId) {
      alert("Order ID is missing. Unable to navigate to assign orders page.");
      return;
    }
    navigate("/assign-order", { state: { orderId } });
  };

  const goToAssignedOrders = () => {
    if (!courierId) {
        alert("   ");
        //navigate("/"); // Navigate to the homepage if not logged in
        return;
      }
    navigate("/assigned-orders"); 
  };

  const handleManageOrdersClick = () => {
    navigate('/manage-orders');
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", textAlign: "center" }}>
      <div>
        <h1>Order Created Successfully!</h1>
        <p>What would you like to do next?</p>
        <button onClick={goToMyOrders}>View All Orders</button>
        {"  "}
        <button onClick={goToOrderDetails}>View Order Details</button>
        {" "}
        <button onClick={goToAssignOrders}>Assign Order</button>
        {"  "}
        <button onClick={goToAssignedOrders}>Assigned Orders</button>
        {"  "}
        <button onClick={handleManageOrdersClick}> Manage Orders </button>
        {error && <p>{error}</p>} {/* Display error if there is one */}

        {assignedOrders.length > 0 && (
          <div>
            <h3>Assigned Orders</h3>
            <ul>
              {assignedOrders.map((order) => (
                <li key={order.id}>{order.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderOptions;