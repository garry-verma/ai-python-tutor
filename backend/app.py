from flask import Flask,Blueprint, request, jsonify
from flask_migrate import Migrate
from database import db, init_db
from models import User, Lesson, Homework, Progress
from auth import register_user, login_user, reset_password, get_current_user,profile_bp
from config import Config
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
from functools import wraps
import jwt
import sys
import io
import subprocess
# Load environment variables
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "your_default_secret_key")
# Load API Key and other config from environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

app = Flask(__name__)
CORS(app)

# Load configuration from environment
app.config.from_object(Config)
app.register_blueprint(profile_bp)
profile_bp = Blueprint("profile", __name__)
# Initialize database
init_db(app)
migrate = Migrate(app, db)
# Helper function to check if user is authenticated (JWT token)
def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Token is missing!"}), 403
        try:
            user = get_current_user(token)  # Decodes the JWT token and retrieves the user
        except Exception as e:
            return jsonify({"error": str(e)}), 403
        return f(user, *args, **kwargs)
    return decorator


# Register user route
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    try:
        return jsonify(register_user(data)), 201  # Return created status
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Login user route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    try:
        return jsonify(login_user(data)), 200  # Return success status
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Reset password route
@app.route('/reset_password', methods=['POST'])
def reset_password_route():
    data = request.get_json()
    try:
        return jsonify(reset_password(data)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/execute', methods=['POST'])
def execute_python_code():
    try:
        # Assuming the Python code is sent in the request body as 'code'
        code = request.json.get('code')
        if not code:
            return jsonify({'error': 'No code provided'}), 400

        # Here, you might execute the code in a safe manner using subprocess
        # Example: subprocess to run code (but be careful with eval or exec in production!)
        result = subprocess.run(['python', '-c', code], capture_output=True, text=True)

        # Return the output of the executed code
        return jsonify({'output': result.stdout, 'error': result.stderr}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500



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

# AI Tutor - Ask a Question (Using Gemini AI)
@app.route('/ask_tutor', methods=['POST'])
def ask_tutor():
    data = request.get_json()
    question = data.get("question", "")

    if not question:
        return jsonify({"error": "Question cannot be empty"}), 400

    # Call Gemini AI API
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "contents": [{"parts": [{"text": question}]}],
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 256}
    }

    response = requests.post(f"{GEMINI_API_URL}?key={GEMINI_API_KEY}", headers=headers, json=payload)

    if response.status_code == 200:
        try:
            response_data = response.json()
            answer = response_data["candidates"][0]["content"]["parts"][0]["text"]
        except (KeyError, IndexError):
            answer = "I'm not sure about that."
    else:
        answer = "Sorry, I couldn't fetch an answer at the moment."

    return jsonify({"answer": answer})

# Fetch a lesson
@app.route('/get_lesson/<int:id>', methods=['GET'])
def get_lesson(id):
    lesson = Lesson.query.get(id)
    if lesson:
        return jsonify({"lesson": lesson.content}), 200
    return jsonify({"error": "Lesson not found"}), 404

# Submit homework
@app.route('/submit_homework', methods=['POST'])
def submit_homework():
    data = request.get_json()
    homework = Homework.query.get(data.get("homework_id"))

    if not homework:
        return jsonify({"error": "Homework not found"}), 404

    try:
        return jsonify(homework.evaluate(data["solution"])), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Get user progress
@app.route('/get_progress', methods=['GET'])
def get_progress():
    progress = Progress.query.all()
    if progress:
        return jsonify([p.to_dict() for p in progress]), 200
    return jsonify({"error": "No progress found"}), 404

# Fetch current user profile
@app.route('/api/user', methods=['GET'])
@token_required
def get_user_profile(user):
    
    return jsonify({
        "username": user.username,
        "email": user.email,
        "bio": user.bio
    })

# Update user profile
@app.route('/api/user/update', methods=['POST'])
@token_required
def update_user_profile(user):
    data = request.get_json()
    new_bio = data.get("bio", "")
    
    # Update bio if provided
    if new_bio:
        user.bio = new_bio
        db.session.commit()
        return jsonify({"message": "Profile updated successfully", "new_bio": new_bio}), 200
    
    return jsonify({"error": "Bio is required"}), 400

if __name__ == "__main__":
    app.run(debug=True)
