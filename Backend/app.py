from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow frontend to access backend

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
    print(notes)
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

# API: Delete a note
@app.route('/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    cursor.execute("DELETE FROM notes WHERE id = %s RETURNING id;", (note_id,))
    deleted_id = cursor.fetchone()
    
    if deleted_id:
        db.commit()
        return jsonify({"message": "Note deleted", "id": note_id})
    else:
        return jsonify({"error": "Note not found"}), 404

# API: Update an existing note
@app.route('/notes/<int:note_id>', methods=['PUT'])
def update_note(note_id):
    data = request.get_json()
    title, content = data['title'], data['content']
    
    cursor.execute("UPDATE notes SET title = %s, content = %s WHERE id = %s RETURNING id;", 
                   (title, content, note_id))
    updated_id = cursor.fetchone()
    
    if updated_id:
        db.commit()
        return jsonify({"message": "Note updated", "id": note_id})
    else:
        return jsonify({"error": "Note not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
