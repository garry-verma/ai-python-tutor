from flask_sqlalchemy import SQLAlchemy

# Initialize SQLAlchemy
db = SQLAlchemy()

def init_db(app):
    """Initialize the database with the Flask app."""
    try:
        db.init_app(app)
        with app.app_context():
            db.create_all()  # Ensure tables are created
        print("✅ Database initialized successfully!")
    except Exception as e:
        print(f"❌ Error initializing the database: {e}")
