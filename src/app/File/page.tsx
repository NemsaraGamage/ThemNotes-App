"use client";

import { useEffect, useState } from "react";
import Navbar from "../Components/NavBar";
import { useRouter } from "next/navigation";
import { Download, FilePenLine, Trash2 } from "lucide-react";

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

      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Function to remove HTML tags from content
  const stripHtmlTags = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // Function to handle downloading a note
  const handleDownload = (note: Note) => {
    if (!note.title.trim() && !note.content.trim()) {
      alert("Note is empty!");
      return;
    }

    // Convert HTML content to plain text
    const plainTextContent = stripHtmlTags(note.content);

    // Create a Blob object with the text content
    const blob = new Blob([plainTextContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    // Create a download link
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title.trim() || "Untitled"}.txt`; // Set filename as title
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
              <FilePenLine
                size={21}
                onClick={() => handleOpenNote(note)}
                className="file-edit-btn"
              />
              <Download
                size={21}
                className="file-down-btn"
                onClick={() => handleDownload(note)}
              />
              <Trash2
                size={21}
                onClick={() => handleDelete(note.id)}
                className="file-delete-btn"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
