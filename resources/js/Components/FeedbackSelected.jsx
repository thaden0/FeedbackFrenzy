import { useEffect, useRef, useState } from "react";
import axios from "axios";

const STATUSES = [
  { value: "new",          label: "New" },
  { value: "in_progress",  label: "In progress" },
  { value: "done",         label: "Done" },
  { value: "cancelled",    label: "Cancelled" },
];

export default function FeedbackSelected({ id }) {
  const [item, setItem] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState(null);

  const http = axios.create({
    baseURL: "/",
    withCredentials: true,
    headers: { "X-Requested-With": "XMLHttpRequest", Accept: "application/json" },
  });

  useEffect(() => {
    if (!id) { setItem(null); return; }
    let cancelled = false;
    (async () => {
      setBusy(true); setErr(null);
      try {
        // load assignee too
        const { data } = await http.get(`/feedback/${id}`);
        if (!cancelled) setItem(data);
      } catch {
        if (!cancelled) setErr("Failed to load");
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  async function savePatch(patch) {
    if (!item) return;
    setSaving(true); setSaveErr(null);
    try {
      const { data } = await http.put(`/feedback/${item.id}`, patch);
      setItem(data); // server is source of truth
    } catch (e) {
      setSaveErr(e.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (!id) return <div className="text-gray-500">Select a feedback item.</div>;
  if (busy) return <div className="text-gray-500">Loading…</div>;
  if (err)  return <div className="text-red-600">{err}</div>;
  if (!item) return null;

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex items-start justify-between">
        <h4 className="text-lg font-semibold">{item.title}</h4>
        <span className="ml-3 inline-flex items-center rounded px-2 py-0.5 text-xs uppercase border">
          {item.category}
        </span>
      </div>

      {/* Status + Assignee editor */}
      <div className="grid gap-3 md:grid-cols-12 md:items-center">
        <label className="md:col-span-3 text-sm font-medium text-gray-700">Status</label>
        <div className="md:col-span-9">
          <select
            className="w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={item.status ?? "new"}
            onChange={(e) => savePatch({ status: e.target.value })}
            disabled={saving}
          >
            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-12 md:items-center">
        <label className="md:col-span-3 text-sm font-medium text-gray-700">Assignee</label>
        <div className="md:col-span-9">
          <AssigneePicker
            http={http}
            value={item.assignee ?? null}
            onChange={(u) => savePatch({ assignee_id: u ? u.id : null })}
            disabled={saving}
          />
        </div>
      </div>

      {saveErr && <div className="text-sm text-red-600">{saveErr}</div>}

      <p className="whitespace-pre-line">{item.description}</p>
      <div className="text-sm text-gray-500">
        by {item.user?.name ?? "Unknown"} · #{item.id}
      </div>
    </div>
  );
}

/** Assignee typeahead using /users?q= */
function AssigneePicker({ http, value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [opts, setOpts] = useState([]);
  const [hi, setHi] = useState(0);
  const boxRef = useRef(null);
  const tRef = useRef(null);

  useEffect(() => {
    function onDoc(e) { if (!boxRef.current?.contains(e.target)) setOpen(false); }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  function fetchOpts(term) {
    clearTimeout(tRef.current);
    tRef.current = setTimeout(async () => {
      try {
        const params = term ? { q: term } : undefined;
        const { data } = await http.get("/users", { params });
        setOpts(data);
        setHi(0);
      } catch { /* ignore */ }
    }, 150);
  }

  return (
    <div className="relative" ref={boxRef}>
      <div className="flex gap-2">
        <input
          type="text"
          className="w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder={value ? `${value.name} (@${value.username})` : "Enter assignee username"}
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); fetchOpts(e.target.value); }}
          onFocus={() => { setOpen(true); fetchOpts(q); }}
          onKeyDown={(e) => {
            if (!open || opts.length === 0) return;
            if (e.key === "ArrowDown") { e.preventDefault(); setHi((hi+1)%opts.length); }
            if (e.key === "ArrowUp")   { e.preventDefault(); setHi((hi-1+opts.length)%opts.length); }
            if (e.key === "Enter" || e.key === "Tab") { e.preventDefault(); const u=opts[hi]; onChange?.(u); setQ(""); setOpen(false); }
            if (e.key === "Escape") setOpen(false);
          }}
          disabled={disabled}
        />
        {value && (
          <button
            type="button"
            className="rounded-md border px-2 text-sm"
            onClick={() => onChange?.(null)}
            disabled={disabled}
            title="Unassign"
          >
            ✕
          </button>
        )}
      </div>

      {open && opts.length > 0 && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow">
          {opts.map((u, idx) => (
            <button
              key={u.id}
              type="button"
              className={`flex w-full items-center justify-between px-3 py-2 text-left hover:bg-gray-50 ${idx===hi ? "bg-indigo-50":""}`}
              onMouseDown={(e) => { e.preventDefault(); onChange?.(u); setQ(""); setOpen(false); }}
              onMouseEnter={() => setHi(idx)}
            >
              <span className="font-medium">@{u.username}</span>
              <span className="text-xs text-gray-500">{u.name} · {u.email}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
