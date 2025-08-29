import { useEffect, useRef, useState } from "react";
import axios from "axios";

const MENTION_RX = /(^|\s)@([A-Za-z0-9._-]{0,50})$/;

export default function NewComment({ feedbackId, onCreated }) {
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [ready, setReady] = useState(false);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [opts, setOpts] = useState([]);
  const [hi, setHi] = useState(0);
  const taRef = useRef(null);
  const fetchT = useRef(null);

  const http = axios.create({
    baseURL: "/",
    withCredentials: true,
    headers: { "X-Requested-With": "XMLHttpRequest", Accept: "application/json" },
  });

  useEffect(() => { (async () => { try { await http.get("/sanctum/csrf-cookie"); } finally { setReady(true); } })(); }, []);

  function onChange(e) {
    const v = e.target.value;
    setComment(v);

    const caret = e.target.selectionStart;
    const before = v.slice(0, caret);
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

  function scheduleFetch(q) {
    clearTimeout(fetchT.current);
    fetchT.current = setTimeout(async () => {
      try {
        const params = q ? { q } : undefined;
        const { data } = await http.get("/users", { params });        setOpts(data);
        setHi(0);
      } catch { /* ignore */ }
    }, 150);
  }

  function insertMention(user) {
    const ta = taRef.current;
    if (!ta) return;
    const caret = ta.selectionStart;
    const before = comment.slice(0, caret);
    const after = comment.slice(caret);
    const m = before.match(MENTION_RX);
    if (!m) return;

    const prefix = before.slice(0, before.length - (m[2]?.length ?? 0) - 1);
    const handle = user?.username;
    if (!handle) return;
    const newText = `${prefix}@${handle} ${after}`;
    const newCaret = (prefix + "@" + handle + " ").length;

    setComment(newText);
    setOpen(false);
    setOpts([]);
    setQuery("");
    setHi(0);

    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(newCaret, newCaret);
    });
  }

  function onKeyDown(e) {
    if (!open || opts.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHi((hi + 1) % opts.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHi((hi - 1 + opts.length) % opts.length); }
    else if (e.key === "Enter" || e.key === "Tab") { e.preventDefault(); insertMention(opts[hi]); }
    else if (e.key === "Escape") { setOpen(false); }
  }

  async function submit(e) {
    e.preventDefault();
    if (!feedbackId || !ready) return;
    const body = comment.trim();
    if (!body) return;

    setBusy(true); setErrors({});
    try {
      const { data } = await http.post("/comments", { feedback_id: feedbackId, comment: body });
      setComment("");
      onCreated?.(data);
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
        <textarea
          ref={taRef}
          rows={3}
          className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${
            errors.comment ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
          }`}
          value={comment}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Write a comment… Use @ to mention"
          required
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
