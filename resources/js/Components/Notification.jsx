import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Pagination from "@/Components/Pagination";
import { Link } from "@inertiajs/react";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const dropdownRef = useRef(null);

  async function load(p = 1) {
    setBusy(true);
    try {
      const { data } = await axios.get("/notifications", {
        params: { page: p, per_page: 10 },
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

  useEffect(() => {
    function onDoc(e) {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => { load(1); }, []);
  useEffect(() => { if (open) load(page); }, [open]);

  const unseenCount = items.filter(n => !n.seen).length;

  async function markSeen(id) {
    try {
      await axios.put(`/notifications/${id}`, { seen: true }, {
        withCredentials: true,
        headers: { "X-Requested-With": "XMLHttpRequest", Accept: "application/json" },
      });
      setItems(curr => curr.map(n => (n.id === id ? { ...n, seen: true } : n)));
    } catch (_) {}
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full border ${
          unseenCount > 0 ? "border-red-500 bg-red-500 text-white" : "border-gray-300 bg-white text-gray-600"
        }`}
        aria-haspopup="true"
        aria-expanded={open}
        title="Notifications"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M14 10V7a2 2 0 10-4 0v3a6 6 0 00-4 5h12a6 6 0 00-4-5zM12 19a2 2 0 01-2-2h4a2 2 0 01-2 2z" />
        </svg>

        {unseenCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[1.25rem] rounded-full bg-white px-1 text-center text-xs font-semibold text-red-600">
            {unseenCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-md border bg-white shadow-lg">
          <div className="max-h-96 overflow-y-auto">
            {busy && <div className="p-3 text-sm text-gray-500">Loading…</div>}
            {!busy && items.length === 0 && (
              <div className="p-3 text-sm text-gray-500">No notifications.</div>
            )}

            {items.map(n => (
              <div
                key={n.id}
                className={`border-b px-3 py-2 last:border-b-0 ${n.seen ? "bg-white" : "bg-red-50"}`}
              >
                <Link
                  href={n.link}
                  onClick={async (e) => {
                    e.preventDefault();
                    await markSeen(n.id);
                    window.location.href = n.link;
                  }}
                  className="block"
                >
                  <div className="text-sm">{n.description}</div>
                  <div className="mt-1 text-xs text-gray-500">#{n.id}</div>
                </Link>
              </div>
            ))}
          </div>

          <div className="p-2">
            <Pagination meta={meta} onPage={(p) => load(p)} />
          </div>
        </div>
      )}
    </div>
  );
}