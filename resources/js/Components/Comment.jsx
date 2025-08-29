export default function Comment({ c }) {
    return (
      <div className="py-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="font-medium">{c.user?.name ?? 'Unknown'}</span>
          <time dateTime={c.created_at}>{new Date(c.created_at).toLocaleString()}</time>
        </div>
        <p className="mt-1 whitespace-pre-line">{c.comment}</p>
      </div>
    );
  }
  