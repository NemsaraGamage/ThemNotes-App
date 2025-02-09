'use client';

import { useState } from 'react';
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
  Heading3, Heading4, House, Save, Download, ArrowLeft, Underline, Highlighter, Baseline, } from 'lucide-react'; // Import icons
import UnderlineExtension from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Color from "@tiptap/extension-color";
import TextStyle from '@tiptap/extension-text-style';
interface Note {
  id: number;
  title: string;
  content: string;
}

interface NoteEditorProps {
  addNote: (note: Note) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ addNote }) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const router = useRouter();

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle, // Required for Color extension
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

  const handleSave = () => {
    if (!title.trim()) return alert('Title cannot be empty!');

    const newNote: Note = { id: Date.now(), title, content };
    addNote(newNote);
    router.push('/');
  };

  const [color, setColor] = useState("#000000");

  const handleGoHome = () => {
    router.push('/'); 
    console.log('Home page loaded')
  };
  
  return (
    <>
      
      <div className="note-container">

        <div className='note-saved'>

          <p>Previous Notes</p>

        </div>

        <div className="note-items">

          {/* back home */}
          <div className="notes-navbar-container">
            <button onClick={handleGoHome} className="notes-navbar-icons">
              <ArrowLeft strokeWidth={2.5} size={21} />
              &nbsp; &nbsp;
              <House strokeWidth={2.5} size={21} />
            </button>
          </div>


          <input
            type="text"
            placeholder="Note Title"
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
    </>
  );
};

export default NoteEditor;
