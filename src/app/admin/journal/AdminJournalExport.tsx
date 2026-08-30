'use client';

import type { ActivityRow } from '@/lib/activity';

export default function AdminJournalExport({ entries }: { entries: ActivityRow[] }) {
  const exportCSV = () => {
    const header = 'date,acteur,action,cible,type';
    const rows = entries.map(l => [l.created_at, l.actor, l.action, l.target || '', l.type].join(','));
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'maison-la-grace-journal.csv';
    a.click();
  };

  return (
    <button className="b b--default" onClick={exportCSV} disabled={entries.length === 0}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
      Exporter
    </button>
  );
}
