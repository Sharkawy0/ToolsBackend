from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

app = Flask(__name__)

# MongoDB configuration
client = MongoClient("mongodb+srv://mohamedsharkawi:Mangos0763@cluster0.swjp0xk.mongodb.net/RefinedDatabase?retryWrites=true&w=majority", serverSelectionTimeoutMS=5000)
db = client['RefinedDatabase']  # Create or connect to 'RefinedDatabase' database
users_collection = db['users']  # Create or connect to 'users' collection
orders_collection = db['orders']  # Create or connect to 'orders' collection

# Helper function for role-based access control
def role_required(required_role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user_id = request.headers.get('User-ID')
            user = users_collection.find_one({"_id": ObjectId(user_id)})
            if not user or user.get('role') != required_role:
                return "Unauthorized access", 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator



# Feature #1: User Registration
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not all(k in data for k in ("name", "email", "phone", "password", "role")):
        return "Missing fields", 400

    hashed_password = generate_password_hash(data['password'])
    user = {
        "name": data["name"],
        "email": data["email"],
        "phone": data["phone"],
        "password": hashed_password,
        "role": data["role"],  # 'admin', 'courier', or 'user'
    }

    users_collection.insert_one(user)
    return "User registered successfully", 201

# Feature #2: User Login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not all(k in data for k in ("email", "password")):
        return "Missing fields", 400

    user = users_collection.find_one({"email": data['email']})  # Corrected this line
    if user and check_password_hash(user['password'], data['password']):  # Compare with the provided password
        return f"Login successful. User ID: {user['_id']}", 200
    return "Invalid email or password", 401

# Feature #3: Create Order
@app.route('/orders', methods=['POST'])
@role_required('user')
def create_order():
    data = request.get_json()
    if not all(k in data for k in ("pickup_location", "dropoff_location", "package_details", "delivery_time")):
        return "Missing fields", 400

    order = {
        "user_id": request.headers.get('User-ID'),
        "pickup_location": data['pickup_location'],
        "dropoff_location": data['dropoff_location'],
        "package_details": data['package_details'],
        "delivery_time": data['delivery_time'],
        "status": "Pending",
        "courier_id": None
    }

    orders_collection.insert_one(order)
    return "Order created successfully", 201

# Feature #5: My Orders
@app.route('/orders/my', methods=['GET'])
@role_required('user')
def my_orders():
    user_id = request.headers.get('User-ID')
    orders = list(orders_collection.find({"user_id": user_id}))
    response = ""
    for order in orders:
        response += f"Order ID: {str(order['_id'])}\nPickup Location: {order['pickup_location']}\nDropoff Location: {order['dropoff_location']}\nPackage Details: {order['package_details']}\nDelivery Time: {order['delivery_time']}\nStatus: {order['status']}\nCourier ID: {order.get('courier_id', 'None')}\n\n"
    return response, 200

# Feature #6: Order Details
@app.route('/orders/<order_id>', methods=['GET'])
@role_required('user')
def order_details(order_id):
    order = orders_collection.find_one({"_id": ObjectId(order_id)})
    if not order:
        return "Order not found", 404

    response = f"Order ID: {str(order['_id'])}\nPickup Location: {order['pickup_location']}\nDropoff Location: {order['dropoff_location']}\nPackage Details: {order['package_details']}\nDelivery Time: {order['delivery_time']}\nStatus: {order['status']}\nCourier ID: {order.get('courier_id', 'None')}\n"
    return response, 200

# Feature #7: Assigned Orders
@app.route('/courier/orders', methods=['GET'])
@role_required('courier')
def assigned_orders():
    courier_id = request.headers.get('User-ID')
    orders = list(orders_collection.find({"courier_id": courier_id}))
    response = ""
    for order in orders:
        response += f"Assigned Order ID: {str(order['_id'])}\nPickup Location: {order['pickup_location']}\nDropoff Location: {order['dropoff_location']}\nStatus: {order['status']}\n\n"
    return response, 200

# Feature #8: Update Order Status
@app.route('/orders/<order_id>/status', methods=['PATCH'])
@role_required('courier')
def update_order_status(order_id):
    data = request.get_json()
    if "status" not in data:
        return "Missing status field", 400

    order = orders_collection.find_one({"_id": ObjectId(order_id)})
    if not order:
        return "Order not found", 404

    orders_collection.update_one({"_id": ObjectId(order_id)}, {"$set": {"status": data['status']}})
    return "Order status updated successfully", 200

# Feature #9: Manage Orders (Admin)
@app.route('/admin/orders', methods=['GET'])
@role_required('admin')
def manage_orders():
    orders = list(orders_collection.find())
    response = ""
    for order in orders:
        response += f"Order ID: {str(order['_id'])}\nPickup Location: {order['pickup_location']}\nDropoff Location: {order['dropoff_location']}\nPackage Details: {order['package_details']}\nDelivery Time: {order['delivery_time']}\nStatus: {order['status']}\nCourier ID: {order.get('courier_id', 'None')}\n\n"
    return response, 200

# Feature #10: Assign/Reassign Orders (Admin)
@app.route('/admin/orders/<order_id>/assign', methods=['PATCH'])
@role_required('admin')
def assign_order(order_id):
    data = request.get_json()
    if "courier_id" not in data:
        return "Missing courier_id field", 400

    order = orders_collection.find_one({"_id": ObjectId(order_id)})
    if not order:
        return "Order not found", 404

    orders_collection.update_one({"_id": ObjectId(order_id)}, {"$set": {"courier_id": data['courier_id']}})
    return "Order assigned/reassigned successfully", 200

if __name__ == '__main__':
      app.run( debug=True)