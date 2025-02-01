from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from database import db
from models import User
import jwt
import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "your_default_secret_key") 
profile_bp = Blueprint("profile", __name__)



@profile_bp.route("/profile", methods=["GET"])
def get_profile():
    """Fetch user profile from token"""
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Token missing"}), 401

    try:
        token = token.split(" ")[1]  # Extract token after "Bearer "
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = decoded.get("user_id")
        user = User.query.get(user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "username": user.username,
            "email": user.email,
            "bio": user.bio if user.bio else "No bio available"
        }), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

def register_user(data):
    """Registers a new user with hashed password"""
    username = data.get("username", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not username or not email or not password:
        return {"error": "All fields are required"}, 400

    if User.query.filter_by(email=email).first():
        return {"error": "Email already exists"}, 409

    try:
        hashed_password = generate_password_hash(password)
        user = User(username=username, email=email, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        return {"message": "User registered successfully"}, 201
    except Exception as e:
        db.session.rollback()
        return {"error": f"Registration failed: {str(e)}"}, 500

def login_user(data):
    """Logs in a user and returns a JWT token"""
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not email or not password:
        return {"error": "Email and password are required"}, 400

    user = User.query.filter_by(email=email).first()

    if user is None:
        return {"error": "User does not exist"}, 404

    if not check_password_hash(user.password, password):
        return {"error": "Invalid credentials"}, 401

    try:
        # Generate JWT token
        token_payload = {
            "user_id": user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=12)
        }
        token = jwt.encode(token_payload, SECRET_KEY, algorithm="HS256")

        return {"message": "Login successful", "token": token, "user_id": user.id}, 200

    except Exception as e:
        return {"error": f"Token generation failed: {str(e)}"}, 500

def reset_password(data):
    """Resets user password securely"""
    email = data.get("email", "").strip()
    new_password = data.get("new_password", "").strip()

    if not email or not new_password:
        return {"error": "Email and new password are required"}, 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return {"error": "User not found"}, 404

    try:
        user.password = generate_password_hash(new_password)
        db.session.commit()
        return {"message": "Password reset successfully"}, 200
    except Exception as e:
        db.session.rollback()
        return {"error": f"Password reset failed: {str(e)}"}, 500

def get_user_profile(user_id):
    """Fetches the user profile, including the bio"""
    user = User.query.get(user_id)
    if user:
        return jsonify({
            "username": user.username,
            "email": user.email,
            "bio": user.bio if user.bio else "No bio available"
        }), 200
    return jsonify({"error": "User not found"}), 404

def update_user_bio(user_id, data):
    """Updates the user's bio"""
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    new_bio = data.get("bio", "").strip()
    if not new_bio:
        return jsonify({"error": "Bio cannot be empty"}), 400

    try:
        user.bio = new_bio
        db.session.commit()
        return jsonify({"message": "Bio updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to update bio: {str(e)}"}), 500

def get_current_user():
    """Extracts the user ID from the JWT token and returns the user object"""
    token = request.headers.get('Authorization')

    if not token:
        return None

    try:
        token_parts = token.split(" ")
        if len(token_parts) != 2 or token_parts[0] != "Bearer":
            return None  # Invalid token format

        decoded = jwt.decode(token_parts[1], SECRET_KEY, algorithms=["HS256"])
        user_id = decoded.get("user_id")
        if not user_id:
            return None

        return User.query.get(user_id)

    except jwt.ExpiredSignatureError:
        return None  # Token expired
    except jwt.InvalidTokenError:
        return None  # Invalid token
