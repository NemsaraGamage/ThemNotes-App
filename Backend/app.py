from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)  # Allow frontend to access backend

# Connect to PostgreSQL
db = psycopg2.connect(
    dbname="noteverse",
    user="postgres",
    password="12345",  
    host="localhost",
    port="5432"
)
cursor = db.cursor()

# API: Get all notes
@app.route('/notes', methods=['GET'])
def get_notes():
    cursor.execute("SELECT * FROM notes")
    notes = [{"id": row[0], "title": row[1], "content": row[2]} for row in cursor.fetchall()]
    return jsonify(notes)


# API: Save a new note
@app.route('/notes', methods=['POST'])
def save_note():
    data = request.get_json()
    title, content = data['title'], data['content']
    cursor.execute("INSERT INTO notes (title, content) VALUES (%s, %s) RETURNING id;", (title, content))
    note_id = cursor.fetchone()[0]
    db.commit()
    return jsonify({"message": "Note created", "id": note_id})


if __name__ == '__main__':
    app.run(debug=True)
