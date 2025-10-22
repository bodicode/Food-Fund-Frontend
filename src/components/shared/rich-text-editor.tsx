"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Undo,
  Redo,
  Highlighter,
  Minus,
  CheckSquare,
} from "lucide-react";
import { Button } from "../ui/button";

type RichTextEditorProps = {
  value: string;
  onChange: (val: string) => void;
};

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'tiptap-paragraph',
          },
        },
      }),
      Underline,
      Link,
      ListItem,
      Highlight,
      TaskList,
      TaskItem,
      HorizontalRule,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      transformPastedText(text) {
        // Convert plain text line breaks to proper paragraphs
        return text;
      },
      transformPastedHTML(html) {
        // Preserve line breaks when pasting
        return html.replace(/\n/g, '<br>');
      },
    },
    immediatelyRender: false,
  });

  // Sync editor content when value prop changes from outside
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!mounted || !editor) return null;

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border rounded-md p-2 bg-gray-50">
        {/* Text styles */}
        <Button
          variant={"outline"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded ${
            editor.isActive("bold") ? "bg-gray-200" : ""
          }`}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant={"outline"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded ${
            editor.isActive("italic") ? "bg-gray-200" : ""
          }`}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant={"outline"}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1 rounded ${
            editor.isActive("underline") ? "bg-gray-200" : ""
          }`}
        >
          <UnderlineIcon className="w-4 h-4" />
        </Button>
        <Button
          variant={"outline"}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1 rounded ${
            editor.isActive("strike") ? "bg-gray-200" : ""
          }`}
        >
          <Strikethrough className="w-4 h-4" />
        </Button>
        <Button
          variant={"outline"}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-1 rounded ${
            editor.isActive("highlight") ? "bg-gray-200" : ""
          }`}
        >
          <Highlighter className="w-4 h-4" />
        </Button>

        {/* Headings */}
        <Button
          variant={"outline"}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`px-2 text-sm font-bold rounded ${
            editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
          }`}
        >
          H1
        </Button>
        <Button
          variant={"outline"}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-2 text-sm font-bold rounded ${
            editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
          }`}
        >
          H2
        </Button>
        <Button
          variant={"outline"}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`px-2 text-sm font-bold rounded ${
            editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""
          }`}
        >
          H3
        </Button>

        {/* Lists */}
        <Button
          variant={"outline"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded ${
            editor.isActive("bulletList") ? "bg-gray-200" : ""
          }`}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant={"outline"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 rounded ${
            editor.isActive("orderedList") ? "bg-gray-200" : ""
          }`}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button
          variant={"outline"}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-1 rounded ${
            editor.isActive("taskList") ? "bg-gray-200" : ""
          }`}
        >
          <CheckSquare className="w-4 h-4" />
        </Button>

        {/* Quote & Code */}
        <Button
          variant={"outline"}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1 rounded ${
            editor.isActive("blockquote") ? "bg-gray-200" : ""
          }`}
        >
          <Quote className="w-4 h-4" />
        </Button>
        <Button
          variant={"outline"}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1 rounded ${
            editor.isActive("codeBlock") ? "bg-gray-200" : ""
          }`}
        >
          <Code className="w-4 h-4" />
        </Button>

        {/* Horizontal line */}
        <Button
          variant={"outline"}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1 rounded"
        >
          <Minus className="w-4 h-4" />
        </Button>

        {/* Link */}
        <Button
          variant={"outline"}
          onClick={() => {
            const url = prompt("Nhập link:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          className={`p-1 rounded ${
            editor.isActive("link") ? "bg-gray-200" : ""
          }`}
        >
          <LinkIcon className="w-4 h-4" />
        </Button>

        {/* Undo / Redo */}
        <Button
          variant={"outline"}
          onClick={() => editor.chain().focus().undo().run()}
          className="p-1 rounded"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          variant={"outline"}
          onClick={() => editor.chain().focus().redo().run()}
          className="p-1 rounded"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor Area */}
      <div className="border rounded-md p-3 min-h-[200px] bg-white">
        <EditorContent editor={editor} className="tiptap" />
      </div>
    </div>
  );
}
