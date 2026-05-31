import { GOOGLE_DRIVE_FOLDER_ID } from '../config/googleDrive';
import { parseDriveErrorResponse, formatDriveError } from '../utils/driveErrors';

export function createGoogleDriveService() {
  return {
    async uploadPhoto({ accessToken, fileName, blob, mimeType = 'image/jpeg' }) {
      if (!accessToken) {
        throw new Error(formatDriveError(401, 'Missing access token'));
      }

      const metadata = {
        name: fileName,
        parents: [GOOGLE_DRIVE_FOLDER_ID],
      };

      const form = new FormData();
      form.append(
        'metadata',
        new Blob([JSON.stringify(metadata)], { type: 'application/json' })
      );
      form.append('file', blob, fileName);

      let res;
      try {
        res = await fetch(
          'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,thumbnailLink',
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${accessToken}` },
            body: form,
          }
        );
      } catch (err) {
        throw new Error(
          'Network error uploading to Google Drive. Photo saved on this device — sync again from Settings.'
        );
      }

      if (!res.ok) {
        throw new Error(await parseDriveErrorResponse(res));
      }

      const file = await res.json();

      try {
        await this.makeFileViewableByLink({ accessToken, fileId: file.id });
      } catch (permErr) {
        // Upload succeeded; sharing failed — still usable for signed-in user
        console.warn('Drive share permission failed:', permErr.message);
      }

      return {
        driveFileId: file.id,
        driveWebViewLink: file.webViewLink,
        driveThumbnailLink: file.thumbnailLink,
      };
    },

    async makeFileViewableByLink({ accessToken, fileId }) {
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ role: 'reader', type: 'anyone' }),
        }
      );

      if (!res.ok && res.status !== 409) {
        throw new Error(await parseDriveErrorResponse(res));
      }
    },

    async deleteFile({ accessToken, fileId }) {
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok && res.status !== 404) {
        throw new Error(await parseDriveErrorResponse(res));
      }
    },

    async fetchImageBlob({ accessToken, fileId }) {
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (!res.ok) {
        throw new Error(await parseDriveErrorResponse(res));
      }

      return res.blob();
    },

    getThumbnailUrl(fileId, width = 400) {
      if (!fileId) return '';
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`;
    },
  };
}

export const googleDriveService = createGoogleDriveService();
