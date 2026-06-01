import type { EditorNode } from "../validations/blogSchema";

export function extractText(node : EditorNode): string {
    if (!node) return "";
  
    let text = "";
  
    function traverse(n : EditorNode) {
      if (n.type === "text") {
        text += n.text + " ";
      }
  
      if (n.content) {
        n.content.forEach(traverse);
      }
    }
  
    traverse(node);
  
    return text.trim();
  }