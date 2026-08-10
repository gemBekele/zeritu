"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Blockquote from "@tiptap/extension-blockquote";
import ImageExtension from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useRef, useState } from "react";
import {
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Image, Link as LinkIcon, Undo, Redo, Upload,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImageMenu, setShowImageMenu] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        blockquote: false,
      }),
      Blockquote,
      ImageExtension.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder || "Start writing..." }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg dark:prose-invert max-w-none min-h-[400px] px-6 py-4 focus:outline-none prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:bg-secondary/5 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg",
      },
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result as string }).run();
    };
    reader.readAsDataURL(file);
    setShowImageMenu(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageUrl = () => {
    const url = window.prompt("Enter image URL:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
    setShowImageMenu(false);
  };

  if (!editor) return null;

  const btn = (onClick: () => void, active: boolean | undefined, children: React.ReactNode, label: string) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`p-2 rounded-lg transition-colors ${active ? "bg-primary/20 text-primary" : "hover:bg-secondary/10 text-muted-foreground"}`}
      aria-label={label}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-background">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-border bg-secondary/5">
        {btn(() => editor.chain().toggleBold().run(), editor.isActive("bold"), <Bold className="w-4 h-4" />, "Bold")}
        {btn(() => editor.chain().toggleItalic().run(), editor.isActive("italic"), <Italic className="w-4 h-4" />, "Italic")}
        {btn(() => editor.chain().toggleStrike().run(), editor.isActive("strike"), <Strikethrough className="w-4 h-4" />, "Strikethrough")}
        <span className="w-px h-6 bg-border mx-1" />
        {btn(() => editor.chain().toggleHeading({ level: 1 }).run(), editor.isActive("heading", { level: 1 }), <Heading1 className="w-4 h-4" />, "Heading 1")}
        {btn(() => editor.chain().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 }), <Heading2 className="w-4 h-4" />, "Heading 2")}
        {btn(() => editor.chain().toggleHeading({ level: 3 }).run(), editor.isActive("heading", { level: 3 }), <Heading3 className="w-4 h-4" />, "Heading 3")}
        <span className="w-px h-6 bg-border mx-1" />
        {btn(() => editor.chain().toggleBulletList().run(), editor.isActive("bulletList"), <List className="w-4 h-4" />, "Bullet List")}
        {btn(() => editor.chain().toggleOrderedList().run(), editor.isActive("orderedList"), <ListOrdered className="w-4 h-4" />, "Ordered List")}
        {btn(() => editor.chain().toggleBlockquote().run(), editor.isActive("blockquote"), <Quote className="w-4 h-4" />, "Quote")}
        <span className="w-px h-6 bg-border mx-1" />
        <div className="relative">
          {btn(() => setShowImageMenu(!showImageMenu), false, <Image className="w-4 h-4" />, "Image")}
          {showImageMenu && (
            <div className="absolute top-full mt-1 left-0 bg-background border border-border rounded-xl shadow-xl p-2 flex gap-1 z-50 min-w-[160px]" onMouseDown={(e) => e.preventDefault()}>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); fileInputRef.current?.click(); }} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary/10 rounded-lg w-full transition-colors">
                <Upload className="w-4 h-4" /> Upload File
              </button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); handleImageUrl(); }} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary/10 rounded-lg w-full transition-colors">
                <LinkIcon className="w-4 h-4" /> Image URL
              </button>
            </div>
          )}
        </div>
        {btn(() => {
          const url = window.prompt("Enter link URL:");
          if (url) editor.chain().setLink({ href: url }).run();
        }, editor.isActive("link"), <LinkIcon className="w-4 h-4" />, "Link")}
        <span className="w-px h-6 bg-border mx-1" />
        {btn(() => editor.chain().undo().run(), false, <Undo className="w-4 h-4" />, "Undo")}
        {btn(() => editor.chain().redo().run(), false, <Redo className="w-4 h-4" />, "Redo")}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
