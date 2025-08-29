// resources/js/Components/FeedbackSelected.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function FeedbackSelected({ id }) {
  const [item, setItem] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!id) { setItem(null); return; }
    let cancelled = false;
    (async () => {
      setBusy(true); setErr(null);
      try {
        const { data } = await axios.get(`/feedback/${id}`, {
          withCredentials: true,
          headers: { "X-Requested-With": "XMLHttpRequest", Accept: "application/json" },
        });
        if (!cancelled) setItem(data);
      } catch {
        if (!cancelled) setErr("Failed to load");
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (!id) return <div className="text-gray-500">Select a feedback item.</div>;
  if (busy) return <div className="text-gray-500">Loading…</div>;
  if (err)  return <div className="text-red-600">{err}</div>;
  if (!item) return null;                   // ← extra guard

  return (
    <div className="rounded-md border p-4">
      <div className="flex items-start justify-between">
        <h4 className="text-lg font-semibold">{item.title}</h4>
        <span className="ml-3 inline-flex items-center rounded px-2 py-0.5 text-xs uppercase border">
          {item.category}
        </span>
      </div>
      <p className="mt-3 whitespace-pre-line">{item.description}</p>
      <div className="mt-4 text-sm text-gray-500">
        by {item.user?.name ?? "Unknown"} · #{item.id}
      </div>
    </div>
  );
}
