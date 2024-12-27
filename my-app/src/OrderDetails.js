import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import OrderStatusUpdate from './OrderStatusUpdate'; // Adjust the path as necessary

function OrderDetails() {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/order-details/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });
        setOrderDetails(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
        alert(error.response?.data?.error || "Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const cancelOrder = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/cancel-order/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      alert(response.data.message);
      navigate("/my-orders");
    } catch (error) {
      console.error("Error canceling order:", error);
      alert(error.response?.data?.error || "Failed to cancel order.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!orderDetails) return <div>No order details available.</div>;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Order Details</h1>
      <p><strong>Pickup Location:</strong> {orderDetails?.pickup_location || "N/A"}</p>
      <p><strong>Dropoff Location:</strong> {orderDetails?.dropoff_location || "N/A"}</p>
      <p><strong>Package Details:</strong> {orderDetails?.package_details || "N/A"}</p>
      <p><strong>Delivery Time:</strong> {orderDetails?.delivery_time || "N/A"}</p>
      <p><strong>Status:</strong> {orderDetails?.status || "N/A"}</p>
      {orderDetails?.courier_info && (
        <p><strong>Courier Info:</strong> {orderDetails.courier_info}</p>
      )}
      {orderDetails?.status === "Pending" && (
        <button onClick={cancelOrder} style={{ marginTop: "20px" }}>
          Cancel Order
        </button>
      )}

    </div>
  );
}

export default OrderDetails;