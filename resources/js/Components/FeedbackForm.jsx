import { useEffect, useState } from "react";
import axios from "axios";

const CATS = [
  { value: "feature", label: "Feature Request" },
  { value: "bug", label: "Bug" },
  { value: "improvement", label: "Improvement" },
  { value: "other", label: "Other" },
];

export default function FeedbackForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATS[0].value);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const http = axios.create({
    baseURL: "/",
    withCredentials: true,
    headers: { "X-Requested-With": "XMLHttpRequest", Accept: "application/json" },
  });

  useEffect(() => {
    http.get("/sanctum/csrf-cookie");
  }, []);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    try {
      const { data } = await http.post("/feedback", { title, category, description });
      setTitle(""); setCategory(CATS[0].value); setDescription("");
      onCreated?.(data); // optional callback
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors || {});
      else console.error(err);
    } finally {
      setBusy(false);
    }
  }

  return (
<form onSubmit={submit} className="space-y-5">
  <div className="grid gap-3 md:grid-cols-12 md:items-center">
    <label className="md:col-span-3 text-sm font-medium text-gray-700">Title</label>
    <div className="md:col-span-9">
      <input
        type="text"
        className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
          errors.title
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-indigo-500"
        }`}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      {errors.title && (
        <p className="mt-1 text-sm text-red-600">{errors.title[0]}</p>
      )}
    </div>
  </div>

  <div className="grid gap-3 md:grid-cols-12 md:items-center">
    <label className="md:col-span-3 text-sm font-medium text-gray-700">Category</label>
    <div className="md:col-span-9">
      <select
        className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
          errors.category
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-indigo-500"
        }`}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        {CATS.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
      {errors.category && (
        <p className="mt-1 text-sm text-red-600">{errors.category[0]}</p>
      )}
    </div>
  </div>

  <div className="grid gap-3 md:grid-cols-12">
    <label className="md:col-span-3 text-sm font-medium text-gray-700">Description</label>
    <div className="md:col-span-9">
      <textarea
        rows={5}
        className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
          errors.description
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-indigo-500"
        }`}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      {errors.description && (
        <p className="mt-1 text-sm text-red-600">{errors.description[0]}</p>
      )}
    </div>
  </div>

  <div className="grid md:grid-cols-12">
    <div className="md:col-start-4 md:col-span-9">
      <button
        type="submit"
        className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
        disabled={busy}
      >
        {busy ? "Submitting…" : "Submit Feedback"}
      </button>
    </div>
  </div>
</form>
  );
}
