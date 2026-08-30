import { listActivity } from '@/lib/activity';
import { isSupabaseAdminConfigured } from '@/lib/supabase-admin';
import AdminJournalExport from './AdminJournalExport';
export const dynamic = 'force-dynamic';


const TYPE_COLOR: Record<string, string> = {
  auth: 'var(--a-ok)',
  edit: 'var(--a-brand)',
  create: 'var(--a-ok)',
  system: 'var(--a-warn)',
  export: 'var(--a-ink-2)',
  delete: 'var(--a-danger)',
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return 'à l’instant';
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'hier';
  return `il y a ${days} jours`;
}

/**
 * Page admin — Journal d'activité, alimenté par les évènements réels
 * (commandes, avis, fournisseurs) via src/lib/activity.ts au lieu de
 * données de démonstration.
 */
export default async function AdminJournalPage() {
  const log = await listActivity();

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Journal d&apos;activité</h2>
          <p className="page-sub">Historique des évènements réels du back-office et de la boutique.</p>
        </div>
        <AdminJournalExport entries={log} />
      </div>

      {!isSupabaseAdminConfigured && (
        <div className="note">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          <span>SUPABASE_SERVICE_ROLE_KEY n&apos;est pas configuré : aucun évènement n&apos;est journalisé tant qu&apos;il ne l&apos;est pas.</span>
        </div>
      )}

      <div className="card">
        {log.length === 0 ? (
          <div className="empty-a">Aucune activité enregistrée pour le moment.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {log.map((l, i) => (
              <div key={l.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 18px',
                borderBottom: i < log.length - 1 ? '1px solid var(--a-line)' : 'none',
              }}>
                <span style={{
                  width: '8px', height: '8px', borderRadius: '999px',
                  background: TYPE_COLOR[l.type] || 'var(--a-muted)',
                  flex: 'none',
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>{l.actor}</span>
                  <span style={{ fontSize: '13px' }}> {l.action}</span>
                  {l.target && <span style={{ fontSize: '13px', color: 'var(--a-brand)' }}> {l.target}</span>}
                </div>
                <span style={{ fontSize: '11.5px', color: 'var(--a-muted)', whiteSpace: 'nowrap' }}>{timeAgo(l.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
