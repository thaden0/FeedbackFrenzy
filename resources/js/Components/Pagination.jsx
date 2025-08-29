export default function Pagination({ meta, onPage }) {
    if (!meta) return null;
    const { current_page, last_page, prev_page_url, next_page_url } = meta;
    return (
      <div className="mt-3 flex items-center justify-between">
        <button
          className="rounded border px-3 py-1 text-sm disabled:opacity-50"
          onClick={() => onPage(current_page - 1)}
          disabled={!prev_page_url}
        >
          Prev
        </button>
        <span className="text-sm text-gray-600">
          Page {current_page} of {last_page}
        </span>
        <button
          className="rounded border px-3 py-1 text-sm disabled:opacity-50"
          onClick={() => onPage(current_page + 1)}
          disabled={!next_page_url}
        >
          Next
        </button>
      </div>
    );
  }
  