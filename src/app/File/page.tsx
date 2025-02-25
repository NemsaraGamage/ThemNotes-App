"use client";

import { useEffect, useState } from "react";
import Navbar from "../Components/NavBar";

interface Note {
  id: number;
  title: string;
  content: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.log("Fetching notes...");
    fetch("http://localhost:5000/notes")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched notes:", data);
        setNotes(data);
      })
      .catch((err) => console.error("Error fetching notes:", err));
  }, []);

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="notepad-background-files">
      <Navbar />

      <h1>All Notes</h1>

      {/* Search Field */}
      <div className="file-search-bar">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Importing the notes */}
      <div className="file-saved-notes">
        {filteredNotes.length === 0 ? (
          <p>No notes available.</p>
        ) : (
          filteredNotes.map((note) => (
            <div key={note.id}>
              <h3>{note.title}</h3>
              <p dangerouslySetInnerHTML={{ __html: note.content }} />
            </div>
          ))
        )}
      </div>

    </div>
  );
}
