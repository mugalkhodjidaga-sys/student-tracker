import { SCHOOL_ID } from '../utils/constants';
import { SYNC_STATUS } from '../utils/syncHelpers';
import {
  blobToDataUrl,
  buildPhotoFileName,
  compressPhotoForUpload,
  compressPhotoThumbnail,
} from '../utils/imageHelpers';

export function createAttachmentService(
  attachmentRepo,
  googleDriveService,
  googleAuthService
) {
  async function uploadAttachmentRecord(attachment, accessToken) {
    const source = attachment.fullDataUrl || attachment.previewDataUrl;
    if (!source) {
      throw new Error('No local image data to upload');
    }

    const { blob } = await compressPhotoForUpload(
      dataUrlToFile(source, attachment.fileName)
    );

    const driveMeta = await googleDriveService.uploadPhoto({
      accessToken,
      fileName: attachment.fileName,
      blob,
      mimeType: attachment.mimeType || 'image/jpeg',
    });

    return attachmentRepo.update(attachment.localId, {
      driveFileId: driveMeta.driveFileId,
      driveWebViewLink: driveMeta.driveWebViewLink,
      driveThumbnailLink: driveMeta.driveThumbnailLink,
      syncStatus: SYNC_STATUS.SYNCED,
      uploadError: '',
      uploadedAt: new Date().toISOString(),
      fullDataUrl: '',
    });
  }

  function dataUrlToFile(dataUrl, fileName) {
    const [header, base64] = dataUrl.split(',');
    const mime = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new File([bytes], fileName, { type: mime });
  }

  return {
    async getByHealthRecord(healthRecordId) {
      return attachmentRepo.getByHealthRecord(healthRecordId);
    },

    async saveForVisit({
      healthRecordId,
      studentId,
      admissionNumber,
      studentName,
      visitDate,
      photos = [],
      accessToken = null,
    }) {
      if (!photos.length) return [];

      const saved = [];
      let token = accessToken;

      for (let index = 0; index < photos.length; index += 1) {
        const photo = photos[index];
        const { blob: fullBlob } = await compressPhotoForUpload(photo.file);
        const { blob: thumbBlob } = await compressPhotoThumbnail(photo.file);
        const fullDataUrl = await blobToDataUrl(fullBlob);
        const previewDataUrl = await blobToDataUrl(thumbBlob);
        const fileName = buildPhotoFileName({
          admissionNumber,
          studentName,
          visitDate,
          index,
        });

        let attachment = await attachmentRepo.add({
          schoolId: SCHOOL_ID,
          healthRecordId,
          studentId,
          fileName,
          mimeType: 'image/jpeg',
          sizeBytes: fullBlob.size,
          fullDataUrl,
          previewDataUrl,
          driveFileId: null,
          driveWebViewLink: '',
          driveThumbnailLink: '',
          syncStatus: SYNC_STATUS.PENDING,
          uploadError: '',
          uploadedAt: null,
        });

        const canUpload =
          token &&
          googleAuthService.isOnline();

        if (canUpload) {
          try {
            const driveMeta = await googleDriveService.uploadPhoto({
              accessToken: token,
              fileName: attachment.fileName,
              blob: fullBlob,
              mimeType: attachment.mimeType,
            });
            attachment = await attachmentRepo.update(attachment.localId, {
              driveFileId: driveMeta.driveFileId,
              driveWebViewLink: driveMeta.driveWebViewLink,
              driveThumbnailLink: driveMeta.driveThumbnailLink,
              syncStatus: SYNC_STATUS.SYNCED,
              uploadError: '',
              uploadedAt: new Date().toISOString(),
              fullDataUrl: '',
            });
          } catch (err) {
            attachment = await attachmentRepo.update(attachment.localId, {
              syncStatus: SYNC_STATUS.FAILED,
              uploadError: err.message || 'Upload failed',
            });
          }
        }

        saved.push(attachment);
      }

      return saved;
    },

    async syncPending(accessToken) {
      if (!accessToken) {
        throw new Error('Sign in with Google to sync photos');
      }

      const pending = await attachmentRepo.getPendingSync();
      const results = { synced: 0, failed: 0, errors: [] };

      for (const attachment of pending) {
        if (!attachment.fullDataUrl && !attachment.previewDataUrl) {
          results.failed += 1;
          results.errors.push(`${attachment.fileName}: missing local preview`);
          continue;
        }

        try {
          await uploadAttachmentRecord(attachment, accessToken);
          results.synced += 1;
        } catch (err) {
          await attachmentRepo.update(attachment.localId, {
            syncStatus: SYNC_STATUS.FAILED,
            uploadError: err.message || 'Upload failed',
          });
          results.failed += 1;
          results.errors.push(`${attachment.fileName}: ${err.message}`);
        }
      }

      return results;
    },

    async getPendingCount() {
      const pending = await attachmentRepo.getPendingSync();
      return pending.length;
    },

    async deleteAttachment(attachment, accessToken) {
      if (attachment.driveFileId && accessToken) {
        try {
          await googleDriveService.deleteFile({
            accessToken,
            fileId: attachment.driveFileId,
          });
        } catch {
          /* keep local delete even if Drive delete fails */
        }
      }
      await attachmentRepo.delete(attachment.localId);
    },

    getDisplayUrl(attachment) {
      if (attachment.previewDataUrl) return attachment.previewDataUrl;
      if (attachment.driveFileId) {
        return googleDriveService.getThumbnailUrl(attachment.driveFileId);
      }
      return '';
    },
  };
}
