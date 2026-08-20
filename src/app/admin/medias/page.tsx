import { getMedia } from '@/lib/data';
import type { Media } from '@/types';

/**
 * Page admin — Médiathèque (gestion des images).
 * Protégée par le middleware (server-side).
 */
export default async function AdminMediasPage() {
  const media = await getMedia();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium" style={{ fontFamily: 'var(--f-display)' }}>
            Médiathèque
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            <span>{media.length}</span> fichiers disponibles.
          </p>
        </div>
        <label className="btn btn--primary btn--sm cursor-pointer">
          + Téléverser
          <input type="file" accept="image/*" multiple className="hidden" />
        </label>
      </div>

      {/* Info note */}
      <div className="card p-4 mb-6" style={{ background: 'rgba(201,168,76,0.06)', borderLeft: '3px solid var(--accent)' }}>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Les images téléversées sont encodées dans le stockage du navigateur (limite pratique ~4 Mo au total).
          En production, elles iraient sur un espace de stockage serveur.
        </p>
      </div>

      {/* Dropzone */}
      <div
        className="border-2 border-dashed rounded-xl p-8 text-center mb-6 transition-colors hover:border-green-400"
        style={{ borderColor: 'var(--line)' }}
      >
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Glissez vos images ici ou cliquez sur « Téléverser »
        </p>
      </div>

      {/* Search */}
      <div className="card p-4 mb-6">
        <input
          type="search"
          placeholder="Rechercher par nom de fichier…"
          className="w-full px-3 py-2 text-sm border rounded-lg"
          style={{ borderColor: 'var(--line)' }}
        />
      </div>

      {/* Media grid */}
      <div className="card p-4">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((m: Media, i: number) => (
            <div key={i} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={m.src}
                  alt={m.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <p className="text-xs mt-1 truncate" style={{ color: 'var(--muted)' }}>{m.name}</p>
              {!m.builtin && (
                <button
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Supprimer ${m.name}`}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {media.length === 0 && (
            <div className="col-span-full p-8 text-center text-sm" style={{ color: 'var(--muted)' }}>
              Aucun fichier. Glissez ou téléversez des images.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
