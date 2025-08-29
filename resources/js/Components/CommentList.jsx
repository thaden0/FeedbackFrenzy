import { useEffect, useState } from "react";
import axios from "axios";
import Accordion from "@/Components/Accordion";
import NewComment from "@/Components/NewComment";
import Comment from "@/Components/Comment";
import Pagination from "@/Components/Pagination";

export default function CommentList({ feedbackId }) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const perPage = 5;

  async function load(p = 1) {
    if (!feedbackId) { setItems([]); setMeta(null); return; }
    setBusy(true);
    try {
      const { data } = await axios.get("/comments", {
        params: { feedback_id: feedbackId, page: p, per_page: perPage },
        withCredentials: true,
        headers: { "X-Requested-With": "XMLHttpRequest", Accept: "application/json" },
      });
      setItems(data.data);
      setMeta(data);
      setPage(p);
    } finally { setBusy(false); }
  }

  useEffect(() => { load(1); }, [feedbackId]);

  if (!feedbackId) return null;


  return (
    <Accordion title="Comments" defaultOpen className="mt-4">
      {!feedbackId && <div className="text-gray-500">Select a feedback item to view comments.</div>}

      {feedbackId && (
        <>
          <NewComment feedbackId={feedbackId} onCreated={() => load(1)} />

          <div className="mt-4 divide-y rounded-md border">
            {busy && <div className="p-3 text-gray-500">Loading…</div>}
            {!busy && items.length === 0 && (
              <div className="p-3 text-gray-500">No comments yet.</div>
            )}
            {items.map((c) => (
              <div key={c.id} className="px-3">
                <Comment c={c} />
              </div>
            ))}
          </div>

          <Pagination meta={meta} onPage={(p) => load(p)} />
        </>
      )}
    </Accordion>
  );
}
