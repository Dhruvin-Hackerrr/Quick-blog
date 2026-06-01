import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type BlogviewProps = {
  content : JSONContent
}

export default function BlogView({ content } : BlogviewProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content, // MUST be JSON object
    editable: false,
  });

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}