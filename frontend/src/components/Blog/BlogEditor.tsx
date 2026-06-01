import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import Placeholder from "@tiptap/extension-placeholder";

interface BlogEditorProps {
  value : JSONContent;
  onChange: (value : JSONContent) => void;
  disabled?: boolean;
}

export default function BlogEditor({
  value,
  onChange,
  disabled,
}: BlogEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,

      Placeholder.configure({
        placeholder: "Share your ideas with the world...",
      }),
    ],

    content: value,
    editable: !disabled,

    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none min-h-[300px] focus:outline-none",
      },
    },

    onUpdate: ({ editor }) => {
      if (disabled) return;
      onChange(editor.getJSON());
    },
  });

  // Sync external updates
  useEffect(() => {
    if (!editor || !value) return;

    const current = editor.getJSON();

    if (JSON.stringify(current) !== JSON.stringify(value)) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  if (!editor) return null;

  return (
    <div
      className={`rounded-lg bg-(--bg) p-4 h-125 ${
        disabled ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      <EditorContent editor={editor} />
    </div>
  );
}
