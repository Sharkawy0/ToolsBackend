import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Registration from "./Registration";
import Login from "./Login";
import Home from "./Home";
import CreateOrder from "./CreateOrder";
import MyOrders from "./MyOrders";
import OrderDetails from "./OrderDetails";
import OrderOptions from "./OrderOptions";
import AssignedOrders from "./AssignedOrders";
import OrderStatusUpdate from "./OrderStatusUpdate";
import ManageOrders from './ManageOrders';
import AssignOrder from "./AssignOrder"; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // State to store assigned orders
  const [assignedOrders, setAssignedOrders] = useState([]);

  // Check authentication on app load
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsAuthenticated(!!token); // Set to true if token exists
    //const courierId = localStorage.getItem("courierId");
    //setIsAuthenticated(!!courierId); // Set to true if token exists
  }, []);

  // Handle registration
  const handleRegistration = async (formData) => {
    try {
      const response = await axios.post("http://localhost:5000/register", formData);
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.error || "Registration failed");
    }
  };

  // Handle login
  const handleLogin = async (formData, navigate) => {
    try {
      const response = await axios.post("http://localhost:5000/login", formData);
      localStorage.setItem("userToken", response.data.token); // Store token
      localStorage.setItem("courierId", response.data.courierId); // Store courier ID if applicable
      console.log(response.data.courierId); // Log the correct courierId
      //console.log(courierId); // Check if courierId is being set correctly
      localStorage.setItem("userEmail", formData.email); // Save user email
      setIsAuthenticated(true); // Update auth state
      alert(response.data.message);
      navigate("/home"); // Navigate to home page
    } catch (error) {
      alert(error.response?.data?.error || "Login failed");
    }
  };

  // Handle create order
  // Handle create order
const handleCreateOrder = async (formData, navigate) => {
  const userEmail = localStorage.getItem("userEmail");
  const orderData = { ...formData, user_email: userEmail };

  try {
    const response = await axios.post(
      "http://localhost:5000/create-order",
      orderData
    );
    alert(response.data.message);

    // Navigate to Order Options page and pass orderId
    navigate("/order-options", { state: { orderId: response.data.order_id } });

  } catch (error) {
    alert(error.response?.data?.error || "Order creation failed");
  }
};


  // Handle logout
  const handleLogout = () => {
    localStorage.clear(); // Clear all localStorage items
    setIsAuthenticated(false);
    alert("Logged out successfully");
  };

  // Handle fetching assigned orders
  const handleAssignedOrders = async () => {
    const courierId = localStorage.getItem("courierId");
    console.log("Courier ID from localStorage:", courierId); // Check if courierId is stored correctly
    
    if (!courierId) {
      alert("Courier ID is missing. Please log in again.");
      return;
    }

    try { 
      const response = await axios.get(
        `http://localhost:5000/assigned-orders/${courierId}`
      );
      setAssignedOrders(response.data); // Set the assigned orders state
    } catch (error) {
      alert(error.response?.data?.error || "Failed to fetch assigned orders");
    }
  };

  // Handle manage orders button click
  const handleManageOrdersClick = () => {
    Navigate("/manage-orders");
  };

  return (
    <Router>
      <Routes>
        {/* Registration Page */}
        <Route
          path="/register"
          element={<Registration onRegister={handleRegistration} />}
        />

        {/* Login Page */}
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />

        {/* Home Page */}
        <Route
          path="/home"
          element={
            isAuthenticated ? (
              <Home onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Create Order Page */}
        <Route
          path="/create-order"
          element={
            isAuthenticated ? (
              <CreateOrder onCreateOrder={handleCreateOrder} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Order Options Page */}
        <Route
          path="/order-options"
          element={isAuthenticated ? <OrderOptions /> : <Navigate to="/login" />}
        />

        {/* My Orders Page */}
        <Route
          path="/my-orders"
          element={isAuthenticated ? <MyOrders /> : <Navigate to="/login" />}
        />

        {/* Order Details Page */}
        <Route
          path="/order-details/:orderId"
          element={isAuthenticated ? <OrderDetails /> : <Navigate to="/login" />}
        />

        <Route
          path="/manage-orders"
          element={isAuthenticated ? <ManageOrders /> : <Navigate to="/login" />}
        />

        {/* Assign Orders Page */}
        <Route
          path="/assign-order"
          element={
            isAuthenticated ? <AssignOrder/ > : <Navigate to="/login" />
          }
        />


        {/* Assigned Orders Page */}
        <Route
        path="/assigned-orders"
        element={
          isAuthenticated ? (
            <AssignedOrders orders={assignedOrders} onFetchAssignedOrders={handleAssignedOrders} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

        {/* Default Redirect */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/home" : "/login"} />}
        />

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;