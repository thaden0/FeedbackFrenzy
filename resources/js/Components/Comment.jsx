import DOMPurify from "dompurify";

export default function Comment({ c }) {
  // sanitize with limited allowed tags
  const clean = DOMPurify.sanitize(c.comment, {
    ALLOWED_TAGS: [
      "b", "i", "em", "strong", "u",
      "p", "br", "span",
      "ul", "ol", "li",
      "blockquote", "code", "pre"
    ],
    ALLOWED_ATTR: ["style"] // optional, remove if you want stricter
  });

  return (
    <div className="py-3">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span className="font-medium">{c.user?.name ?? "Unknown"}</span>
        <time dateTime={c.created_at}>
          {new Date(c.created_at).toLocaleString()}
        </time>
      </div>
      <div
        className="mt-1 prose"
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    </div>
  );
}
