// resources/js/Components/NotificationBell.jsx
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [unseenCount, setUnseenCount] = useState(0);
  const [ready, setReady] = useState(false);
  const dropdownRef = useRef(null);

  // CSRF for POSTs
  useEffect(() => {
    (async () => {
      try {
        await axios.get("/sanctum/csrf-cookie", { withCredentials: true });
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // Close on outside click
  useEffect(() => {
    function onDoc(e) {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  async function fetchCount() {
    try {
      const { data } = await axios.get("/notifications/unseen-count", {
        withCredentials: true,
        headers: { "X-Requested-With": "XMLHttpRequest", Accept: "application/json" },
      });
      setUnseenCount(Number(data?.count || 0));
    } catch {}
  }

  async function poll() {
    if (!ready) return;
    setBusy(true);
    try {
      const { data } = await axios.post(
        "/notifications/poll",
        { limit: 10 },
        {
          withCredentials: true,
          headers: { "X-Requested-With": "XMLHttpRequest", Accept: "application/json" },
        }
      );
      setItems((curr) => {
        const byId = new Map(curr.map((n) => [n.id, n]));
        for (const n of data) byId.set(n.id, n);
        return Array.from(byId.values()).sort((a, b) => b.id - a.id);
      });
      setUnseenCount(0); // just marked seen on server
    } finally {
      setBusy(false);
    }
  }

  // Show badge without marking seen
  useEffect(() => {
    if (ready) fetchCount();
  }, [ready]);

  // When opening, fetch and mark seen
  useEffect(() => {
    if (open) poll();
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full border ${
          unseenCount > 0 ? "border-red-500 bg-red-500 text-white" : "border-gray-300 bg-white text-gray-600"
        }`}
        aria-haspopup="true"
        aria-expanded={open}
        title="Notifications"
      >

        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16">
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
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
            {items.map((n) => (
              <div key={n.id} className="border-b px-3 py-2 last:border-b-0">
                <a
                  href={n.link}
                  className="block"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = n.link; // already marked seen server-side
                  }}
                >
                  <div className="text-sm">{n.description}</div>
                  <div className="mt-1 text-xs text-gray-500">#{n.id}</div>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
