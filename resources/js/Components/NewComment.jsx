// resources/js/Components/NewComment.jsx
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const MENTION_RX = /(^|\s)@([A-Za-z0-9._-]{0,50})$/;

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "blockquote", "code-block"],
    [{ header: [1, 2, 3, false] }],
    [{ align: [] }],
    ["clean"],
  ],
};

const formats = [
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
  "blockquote",
  "code-block",
  "header",
  "align",
];

export default function NewComment({ feedbackId, onCreated }) {
  const [comment, setComment] = useState("<p></p>"); // HTML
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [ready, setReady] = useState(false);

  // mention state
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [opts, setOpts] = useState([]);
  const [hi, setHi] = useState(0);

  const quillRef = useRef(null);
  const fetchT = useRef(null);

  const http = axios.create({
    baseURL: "/",
    withCredentials: true,
    headers: { "X-Requested-With": "XMLHttpRequest", Accept: "application/json" },
  });

  useEffect(() => {
    (async () => {
      try { await http.get("/sanctum/csrf-cookie"); } finally { setReady(true); }
    })();
  }, []);

  // global key handler for the suggestion list
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (!open || opts.length === 0) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setHi((v) => (v + 1) % opts.length); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setHi((v) => (v - 1 + opts.length) % opts.length); }
      else if (e.key === "Enter" || e.key === "Tab") { e.preventDefault(); insertMention(opts[hi]); }
      else if (e.key === "Escape") { setOpen(false); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, opts, hi]);

  function scheduleFetch(q) {
    clearTimeout(fetchT.current);
    fetchT.current = setTimeout(async () => {
      try {
        const params = q ? { q } : undefined;
        const { data } = await http.get("/users", { params });
        setOpts(data);
        setHi(0);
      } catch {}
    }, 150);
  }

  // ReactQuill change handler
  function onQuillChange(value, _delta, _source, editor) {
    setComment(value);
    // caret and plain text before caret
    const range = editor.getSelection();
    if (!range) { setOpen(false); return; }
    const before = editor.getText(0, range.index); // plain text up to caret
    const m = before.match(MENTION_RX);
    if (m) {
      const q = m[2] ?? "";
      setQuery(q);
      setOpen(true);
      scheduleFetch(q);
    } else {
      setOpen(false);
      setQuery("");
      setOpts([]);
      setHi(0);
    }
  }

  function insertMention(user) {
    clearTimeout(fetchT.current);
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const range = quill.getSelection(true);
    if (!range) return;
    const before = quill.getText(0, range.index);
    const m = before.match(MENTION_RX);
    if (!m) return;

    const handle = user?.username;
    if (!handle) return;

    // start index of "@{query}"
    const start = range.index - (m[2]?.length ?? 0) - 1;
    const replace = `@${handle} `;

    quill.deleteText(start, range.index - start, "user");
    quill.insertText(start, replace, "user");
    quill.setSelection(start + replace.length, 0, "user");

    setOpen(false);
    setOpts([]);
    setQuery("");
    setHi(0);
  }

  async function submit(e) {
    e.preventDefault();
    if (!feedbackId || !ready) return;

    const quill = quillRef.current?.getEditor();
    const plain = quill?.getText().trim() ?? "";
    if (!plain) return; // ignore empty editor

    setBusy(true); setErrors({});
    try {
      const { data } = await http.post("/comments", {
        feedback_id: feedbackId,
        comment, // HTML from react-quill
      });
      setComment("<p></p>");
      onCreated?.(data);
      setOpen(false); setOpts([]); setQuery(""); setHi(0);
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors || {});
      else console.error(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <div className="relative">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={comment}
          onChange={onQuillChange}
          modules={modules}
          formats={formats}
          placeholder="Write a comment… Use @ to mention"
        />

        {open && opts.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-60 overflow-auto rounded-md border bg-white shadow">
            {opts.map((u, idx) => (
              <button
                key={u.id}
                type="button"
                className={`flex w-full items-center justify-between px-3 py-2 text-left hover:bg-gray-50 ${
                  idx === hi ? "bg-indigo-50" : ""
                }`}
                onMouseDown={(e) => { e.preventDefault(); insertMention(u); }}
                onMouseEnter={() => setHi(idx)}
              >
                <span className="font-medium">@{u.username}</span>
                <span className="text-xs text-gray-500">{u.name} · {u.email}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {errors.comment && <p className="text-sm text-red-600">{errors.comment[0]}</p>}
      {errors.feedback_id && <p className="text-sm text-red-600">{errors.feedback_id[0]}</p>}

      <div className="text-right">
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-white shadow hover:bg-indigo-700 disabled:opacity-60"
          disabled={busy || !feedbackId || !ready}
        >
          {busy ? "Posting…" : "Post comment"}
        </button>
      </div>
    </form>
  );
}
