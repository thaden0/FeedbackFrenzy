import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Accordion from '@/Components/Accordion';
import CommentList from '@/Components/CommentList';
import FeedbackForm from '@/Components/FeedbackForm';
import FeedbackList from '@/Components/FeedbackList';
import FeedbackSelected from '@/Components/FeedbackSelected';

export default function Dashboard() {
  const initSelected = (() => {
    const p = new URLSearchParams(window.location.search).get('selected');
    return p ? Number(p) : null;
  })();

  const [refresh, setRefresh] = useState(0);
  const [selectedId, setSelectedId] = useState(initSelected);

  // keep URL in sync with selection
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    if (selectedId) qs.set('selected', String(selectedId));
    else qs.delete('selected');
    const url = `${window.location.pathname}${qs.toString() ? `?${qs}` : ''}`;
    window.history.replaceState(null, '', url);
  }, [selectedId]);

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>}>
      <Head title="Dashboard" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <aside className="space-y-4">
                  <Accordion className="mb-3" title="Submit Feedback">
                    <FeedbackForm onCreated={() => setRefresh(n => n + 1)} />
                  </Accordion>
                  <Accordion title="All Feedback" defaultOpen>
                    <FeedbackList
                      refreshSignal={refresh}
                      selectedId={selectedId}
                      onSelect={setSelectedId}
                    />
                  </Accordion>
                </aside>

                <main className="lg:col-span-2">
                  <h3 className="text-lg font-semibold mb-3">Selected Feedback</h3>
                  <FeedbackSelected className="mb-3" id={selectedId} />
                  <CommentList feedbackId={selectedId} />
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
