'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { Markdown } from 'tiptap-markdown';
import { Bold, Italic, Strikethrough, AlignLeft, Heading1, Heading2, List, ListOrdered, 
  Heading3, Heading4, House, Save, Download, ArrowLeft, Underline, Highlighter, Baseline,
  Sun,
  Moon,
  Trash2, } from 'lucide-react'; // Import icons
import UnderlineExtension from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Color from "@tiptap/extension-color";
import TextStyle from '@tiptap/extension-text-style';
import { motion } from 'framer-motion';
import Switch from '@mui/material/Switch';
interface Note {
  id: number;
  title: string;
  content: string;
}

const NoteEditor: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLightMode, setIsLightMode] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);

  // Tools for the toolbar
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Markdown,
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      UnderlineExtension,
      Highlight.configure({ multicolor: true }),
      Color,
    ],
    content: "Start writing...",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const [color, setColor] = useState("#000000");

  // goes to the homepage
  const handleGoHome = () => {
    router.push('/'); 
    console.log('Home page loaded')
  };

  // Fetch saved notes on load
  useEffect(() => {
    fetch('http://localhost:5000/notes')
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(err => console.error('Error fetching notes:', err));
  }, []);

  // Save note to backend
  const handleSave = async () => {
    if (!title.trim()) return alert('Title cannot be empty!');
    
    const newNote = { title, content };

    try {
      let res;
      if (selectedNoteId) {
        // Update the existing note if one is selected
        res = await fetch(`http://localhost:5000/notes/${selectedNoteId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newNote),
        });
      } else {
        // Create a new note if none is selected
        res = await fetch('http://localhost:5000/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newNote),
        });
      }

      if (!res.ok) throw new Error('Failed to save note');
      
      const data = await res.json();
      if (selectedNoteId) {
        // Update the note in the state instead of adding a new one
        setNotes(notes.map(note => note.id === selectedNoteId ? { ...note, title, content } : note));
      } else {
        // If it's a new note, add it to the state
        setNotes([...notes, { id: data.id, title, content }]);
      }

      setTitle('');
      editor?.commands.setContent('');
      setSelectedNoteId(null); // Reset the selected note after saving
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  // Handle selecting a note to edit
  const handleNoteClick = (note: Note) => {
    setTitle(note.title);
    editor?.commands.setContent(note.content);
    setSelectedNoteId(note.id); // Track which note is being edited
  };

  // Toggle dark/light mode
  const handleThemeToggle = () => {
    setIsLightMode(!isLightMode);
  };

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    } else {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    }
  }, [isLightMode]);

  // Delete a list
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
    <>
      
      <div className="note-container">

        {/* Show Previous Notes */}
        <div className="note-saved">
          <h3>Previous Notes</h3>
          <motion.div
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, ease: "easeIn" }} 
          >
            <ul className='notes_list_container'>
              {notes.map(note => (
                <li
                  className='notes_list'
                  key={note.id}
                  onClick={() => handleNoteClick(note)} // Populate editor when a note is clicked
                >
                  {note.title}
                  <div className='list-tools'>
                    <Trash2 onClick={() => handleDelete(note.id)} className='delete-note-icon' size={17} />
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>    
        </div>

        {/* Editor Section */}
        <div className="note-items">

          <div className={`${isLightMode ? 'light-mode-editor' : 'dark-mode-editor'}`}>

            <div className="notes-navbar-container">
              <button onClick={handleGoHome} className="notes-navbar-icons">
                <ArrowLeft strokeWidth={2.5} size={21} />
                &nbsp;&nbsp;
                <House strokeWidth={2.5} size={21} />
                &nbsp;&nbsp;
              </button>

              <div className='mode_icon'>
                {isLightMode ?  <Moon style={{ color: '#555555'  }} strokeWidth={2.5} size={22} /> : <Sun style={{ color: '#F8F8FF' }} strokeWidth={2.5} size={22} /> }
              </div>
              
              <Switch
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  '& .MuiSwitch-thumb': {
                    backgroundColor: '#000', // Black when switched ON
                  },
                  '& + .MuiSwitch-track': {
                    backgroundColor: '#333333', // Light gray track when ON
                  },
                },
                '& .MuiSwitch-switchBase': {
                  '& .MuiSwitch-thumb': {
                    backgroundColor: '#fff', // White when switched OFF
                  },
                },
                '& .MuiSwitch-track': {
                  backgroundColor: '#444',  // Dark track when OFF
                },
              }} 
              checked={isLightMode} onChange={handleThemeToggle} />
             
            </div>

            {/* title input */}
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            
            <div className='editor-content-container'>

              {/* Toolbar for formatting */}
              {editor && (
                <div className="toolbar-container">
                  <button onClick={() => editor.chain().focus().toggleBold().run()} className="toolbar-icons">
                    <Bold strokeWidth={3} size={16} />
                  </button>

                  <button onClick={() => editor.chain().focus().toggleItalic().run()} className="toolbar-icons">
                    <Italic size={16} />
                  </button>

                  <button onClick={() => editor.chain().focus().toggleStrike().run()} className="toolbar-icons">
                    <Strikethrough size={16} />
                  </button>

                  <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="toolbar-icons">
                    <Underline size={16} />
                  </button>

                  <div className="color-picker-wrapper">
                    <button className="toolbar-icons">
                      <Baseline size={16} />
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => {
                          setColor(e.target.value);
                          editor.chain().focus().setColor(e.target.value).run();
                        }}
                        className="hidden-color-input"
                      />
                    </button>
                  </div>

                  <button onClick={() => editor.chain().focus().toggleHighlight().run()} className="toolbar-icons">
                    <Highlighter size={16} />
                  </button>

                  <button onClick={() => editor.chain().focus().setParagraph().run()} className="toolbar-icons">
                    <AlignLeft size={16} />
                  </button>

                  <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="toolbar-icons">
                    <Heading1 size={16} />
                  </button>

                  <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="toolbar-icons">
                    <Heading2 size={16} />
                  </button>

                  <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="toolbar-icons">
                    <Heading3 size={16} />
                  </button>

                  <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="toolbar-icons">
                    <Heading4 size={16} />
                  </button>

                  <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="toolbar-icons">
                    <List size={16} />
                  </button>

                  <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="toolbar-icons">
                    <ListOrdered size={16} />
                  </button>
                  
                </div>
              )}

              {/* editor */}
              <div className="editor-container">
                <EditorContent className='editor' editor={editor} />
              </div>

              {/* bottom bar options */}
              <div className="bottom-navbar">
                <button onClick={handleSave} className="notes-bottom-navbar-icons">
                  <Save strokeWidth={2.5} size={21} />
                </button>
                <button className="notes-bottom-navbar-icons">
                  <Download strokeWidth={2.5} size={21} />
                </button>
              </div>

            </div>
          </div>
  
        </div>
      </div>
    </>
  );
};

export default NoteEditor;
