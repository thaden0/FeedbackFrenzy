import { useState, useEffect } from "react";
import axios from "axios";

export default function NotificationBell() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  async function load() {
    try {
      const { data } = await axios.get("/notifications?per_page=5", {
        withCredentials: true,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Accept: "application/json",
        },
      });
      // If using pagination
      setItems(Array.isArray(data) ? data : data.data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const count = items.filter(n => !n.seen).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`relative flex h-9 w-9 items-center justify-center rounded-full border ${
          count > 0 ? "bg-red-500 text-white" : "bg-white text-gray-600"
        }`}
      >
        {/* Bell icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16">
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
        </svg>

        {count > 0 && (
          <span className="absolute -top-1 -right-1 rounded-full bg-white px-1 text-xs font-bold text-red-600">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-64 rounded-md border bg-white shadow-lg">
          <ul className="max-h-64 overflow-y-auto">
            {items.length === 0 && (
              <li className="px-4 py-2 text-sm text-gray-500">
                No notifications
              </li>
            )}
            {items.map((n) => (
              <li key={n.id}>
                <a
                  href={n.link}
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  {n.description}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
