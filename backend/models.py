from database import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    bio = db.Column(db.String(255), nullable=True)  # Added bio field to the User model

    # Relationship to track progress
    progress = db.relationship('Progress', backref='user', lazy=True)

    def to_dict(self):
        """Serialize user to a dictionary for API response."""
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "bio": self.bio  # Include bio in the dictionary
        }

class Lesson(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)

    # Relationship to homework
    homework = db.relationship('Homework', backref='lesson', lazy=True)

class Homework(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lesson.id'), nullable=False)
    question = db.Column(db.String(300), nullable=False)
    answer = db.Column(db.String(200), nullable=False)

    # Method to evaluate student answer
    def evaluate(self, student_answer):
        correct = student_answer.strip().lower() == self.answer.strip().lower()
        return {
            "correct": correct,
            "correct_answer": self.answer
        }

class Progress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lesson.id'), nullable=False)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "lesson_id": self.lesson_id,
            "completed_at": self.completed_at.strftime("%Y-%m-%d %H:%M:%S")
        }
