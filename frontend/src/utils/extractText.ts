export function extractText(node): string {
    if (!node) return "";
  
    let text = "";
  
    function traverse(n) {
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