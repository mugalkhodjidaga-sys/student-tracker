import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { SYNC_STATUS } from '../../utils/syncHelpers';

function SyncBadge({ status }) {
  if (status === SYNC_STATUS.SYNCED) {
    return (
      <span className="absolute bottom-1 left-1 rounded bg-emerald-600/90 px-1.5 py-0.5 text-[10px] text-white">
        Drive
      </span>
    );
  }
  if (status === SYNC_STATUS.PENDING || status === SYNC_STATUS.FAILED) {
    return (
      <span className="absolute bottom-1 left-1 rounded bg-amber-600/90 px-1.5 py-0.5 text-[10px] text-white">
        Pending
      </span>
    );
  }
  return null;
}

export function PhotoGallery({ attachments = [], getDisplayUrl, title = 'Reference photos' }) {
  const [lightbox, setLightbox] = useState(null);

  if (!attachments.length) return null;

  return (
    <>
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {title}
        </p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {attachments.map((attachment) => {
            const src = getDisplayUrl
              ? getDisplayUrl(attachment)
              : attachment.previewDataUrl;
            return (
              <button
                key={attachment.localId}
                type="button"
                className="relative aspect-square overflow-hidden rounded-xl border border-slate-200"
                onClick={() => setLightbox(attachment)}
              >
                <img
                  src={src}
                  alt={attachment.fileName || 'Visit photo'}
                  className="h-full w-full object-cover"
                />
                <SyncBadge status={attachment.syncStatus} />
              </button>
            );
          })}
        </div>
      </div>

      <Modal
        open={!!lightbox}
        onClose={() => setLightbox(null)}
        title="Reference photo"
        wide
      >
        {lightbox && (
          <div className="space-y-3">
            <img
              src={
                getDisplayUrl
                  ? getDisplayUrl(lightbox)
                  : lightbox.previewDataUrl
              }
              alt={lightbox.fileName}
              className="mx-auto max-h-[70vh] rounded-xl object-contain"
            />
            <div className="flex flex-wrap gap-2 text-sm">
              {lightbox.driveWebViewLink && (
                <a
                  href={lightbox.driveWebViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  Open in Google Drive →
                </a>
              )}
              {lightbox.syncStatus === SYNC_STATUS.FAILED && lightbox.uploadError && (
                <p className="text-urgent">Upload failed: {lightbox.uploadError}</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
