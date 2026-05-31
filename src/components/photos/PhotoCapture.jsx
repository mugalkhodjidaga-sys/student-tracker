import { useRef } from 'react';
import { Button } from '../ui/Button';
import { MAX_PHOTOS_PER_VISIT } from '../../config/googleDrive';
import { useGoogleAuth } from '../../providers/GoogleAuthContext';

function newPhotoId() {
  return globalThis.crypto?.randomUUID?.() ?? `photo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function PhotoCapture({ photos, onChange, disabled = false }) {
  const fileRef = useRef(null);
  const { isSignedIn, expectedEmail, signIn, authError } = useGoogleAuth();

  async function handleFiles(fileList) {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'));
    if (!files.length) return;

    const remaining = MAX_PHOTOS_PER_VISIT - photos.length;
    const toAdd = files.slice(0, remaining);

    const next = [...photos];
    for (const file of toAdd) {
      const previewUrl = URL.createObjectURL(file);
      next.push({ id: newPhotoId(), file, previewUrl });
    }
    onChange(next);
  }

  function removePhoto(id) {
    const target = photos.find((p) => p.id === id);
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
    onChange(photos.filter((p) => p.id !== id));
  }

  const atLimit = photos.length >= MAX_PHOTOS_PER_VISIT;

  return (
    <div className="space-y-3">
      {!isSignedIn && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <p>
            Sign in with <strong>{expectedEmail}</strong> to upload photos to Google Drive.
            You can still attach photos — they will upload when you sign in and sync.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => signIn()}
          >
            Sign in with Google
          </Button>
          {authError && <p className="mt-2 text-urgent">{authError}</p>}
        </div>
      )}

      {isSignedIn && (
        <p className="text-sm text-emerald-700">
          Google Drive connected — photos will upload when you save the visit.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          className="hidden"
          disabled={disabled || atLimit}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
        <Button
          type="button"
          variant="outline"
          disabled={disabled || atLimit}
          onClick={() => fileRef.current?.click()}
        >
          📷 Take / choose photo
        </Button>
        <span className="self-center text-sm text-slate-500">
          {photos.length}/{MAX_PHOTOS_PER_VISIT} photos
        </span>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square overflow-hidden rounded-xl border border-slate-200">
              <img
                src={photo.previewUrl}
                alt="Visit reference"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"
                onClick={() => removePhoto(photo.id)}
                disabled={disabled}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function emptyPendingPhotos() {
  return [];
}
