import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // full viewport height
        textAlign: "center", // optional: to center the text inside the form
        flexDirection: "column", // stacks the elements vertically
      }}
    >
      <div>
        <h1>Welcome to the Home Page</h1>
        <ul>
            <Link to="/register"><button type="submit">Register</button></Link> &nbsp; &nbsp; &nbsp;
            <Link to="/login"><button type="submit">Login</button></Link> &nbsp; &nbsp; &nbsp;
            <Link to="/create-order"><button type="submit">Create Order</button></Link> &nbsp; &nbsp; &nbsp;
            <Link to="/order-options"><button type="submit">Order Options</button></Link>
        </ul>
      </div>
    </div>
  );
}

export default Home;