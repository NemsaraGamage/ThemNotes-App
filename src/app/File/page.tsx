"use client";

import { useEffect, useState } from "react";
import Navbar from "../Components/NavBar";
import { useRouter } from "next/navigation";
import { FilePenLine, Trash2 } from "lucide-react";

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

  // searchbar
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // handles the forwarding the notes from the file page to the editor
  const router = useRouter();

  const handleOpenNote = (note: Note) => {
    router.push(
      `/CreateNotes?id=${note.id}&title=${encodeURIComponent(
        note.title
      )}&content=${encodeURIComponent(note.content)}`
    );
  };

  // Deleting any note
  const handleDelete = async (noteId: number) => {
    try {
        const res = await fetch(`http://127.0.0.1:5000/notes/${noteId}`, { 
            method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete note");

        setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
        console.error("Error deleting note:", error);
    }
  };

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
              
              <FilePenLine size={21} onClick={() => handleOpenNote(note)} className="file-edit-btn" />
              <Trash2 size={21}  onClick={() => handleDelete(note.id)} className="file-delete-btn" />
            </div>
          ))
        )}
      </div>

    </div>
  );
}
