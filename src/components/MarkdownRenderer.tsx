import { marked } from "marked";

const escapeAttribute = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

marked.use({
  renderer: {
    image(token) {
      const src = token.href || "";
      const caption = token.text || token.title || "Visual example";
      return `
        <figure class="lesson-figure">
          <img src="${escapeAttribute(src)}" alt="${escapeAttribute(caption)}" loading="lazy" />
          <figcaption>${escapeAttribute(caption)}</figcaption>
        </figure>
      `;
    },
    heading(token) {
      const text = token.text;
      const id = String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return `<h${token.depth} id="${id}">${text}</h${token.depth}>`;
    }
  }
});

export function MarkdownRenderer({ markdown }: { markdown: string }) {
  return (
    <div
      className="lesson-content"
      dangerouslySetInnerHTML={{ __html: marked.parse(markdown) }}
    />
  );
}
