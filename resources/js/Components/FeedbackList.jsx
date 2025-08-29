import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "@/Components/Pagination";

export default function FeedbackList({ refreshSignal, selectedId, onSelect }) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const perPage = 10;

  async function load(p = 1) {
    setBusy(true);
    try {
      const { data } = await axios.get("/feedback", {
        params: { page: p, per_page: perPage },
        withCredentials: true,
        headers: { "X-Requested-With": "XMLHttpRequest", Accept: "application/json" },
      });
      setItems(data.data);
      setMeta(data);
      setPage(p);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { load(1); }, []);
  useEffect(() => { load(page); }, [refreshSignal]);

  return (
    <div className="mt-3">
      {busy && <div className="text-muted mb-2">Loading…</div>}

      <ul className="divide-y rounded-md border">
        {items.map(f => (
          <li key={f.id}>
            <button
              type="button"
              onClick={() => onSelect?.(f.id)}
              className={`w-full text-left px-3 py-2 hover:bg-gray-50 focus:outline-none ${
                selectedId === f.id ? "bg-indigo-50" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{f.title}</span>
                <span className="ml-3 inline-flex items-center rounded px-2 py-0.5 text-xs uppercase border">
                  {f.category}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {!busy && items.length === 0 && <div className="text-muted mt-2">No feedback yet.</div>}

      <Pagination meta={meta} onPage={(p) => load(p)} />
    </div>
  );
}
