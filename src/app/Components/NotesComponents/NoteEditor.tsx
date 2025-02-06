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
import Navbar from '../NavBar';
import { Bold, Italic, Strikethrough, AlignLeft, Heading1, Heading2, List, ListOrdered, Heading3, Heading4 } from 'lucide-react'; // Import icons

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
      Markdown,
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: 'Start writing...',
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

  return (
    <>
      <Navbar />
      <div className="note-container">

        <div className='note-saved'>

          <p>Previous Notes</p>

        </div>

        <div className="note-items">

          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Toolbar for formatting */}
          {editor && (
            <div className="flex gap-2 mb-2 border-b pb-2">
              <button onClick={() => editor.chain().focus().toggleBold().run()} className="toolbar-icons">
                <Bold strokeWidth={3} size={16} />
              </button>
              <button onClick={() => editor.chain().focus().toggleItalic().run()} className="toolbar-icons">
                <Italic size={16} />
              </button>
              <button onClick={() => editor.chain().focus().toggleStrike().run()} className="toolbar-icons">
                <Strikethrough size={16} />
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

          <div className="editor-container">
            <EditorContent editor={editor} />
          </div>

          <button className='editor-btn' onClick={handleSave}>Save Note</button>
        </div>
      </div>
    </>
  );
};

export default NoteEditor;
