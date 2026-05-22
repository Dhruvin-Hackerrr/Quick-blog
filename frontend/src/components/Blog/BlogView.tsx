import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function BlogView({ content }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content, // MUST be JSON object
    editable: false,
  });

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}