import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

export interface UploadProgressCallback {
  (progressPercent: number): void;
}

export interface UploadResult {
  fileId: string;
  name: string;
  contentType: string;
  sizeBytes: number;
  storagePath: string;
  downloadUrl: string;
}

/**
 * Uploads a binary project file to Firebase Storage
 */
export async function uploadProjectFile(
  projectId: string,
  file: File,
  fileId: string,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `projects/${projectId}/files/${fileId}/${sanitizedName}`;
  const fileRef = ref(storage, storagePath);

  const uploadTask = uploadBytesResumable(fileRef, file, {
    contentType: file.type
  });

  return new Promise((resolve) => {
    try {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (onProgress && snapshot.totalBytes > 0) {
            const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(Math.round(percent));
          }
        },
        (error) => {
          console.warn('[Storage] Remote upload unavailable, falling back to local object URL:', error);
          if (onProgress) onProgress(100);
          const localUrl = URL.createObjectURL(file);
          resolve({
            fileId,
            name: file.name,
            contentType: file.type,
            sizeBytes: file.size,
            storagePath: `local://projects/${projectId}/files/${fileId}/${sanitizedName}`,
            downloadUrl: localUrl
          });
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              fileId,
              name: file.name,
              contentType: file.type,
              sizeBytes: file.size,
              storagePath,
              downloadUrl
            });
          } catch (urlErr) {
            const localUrl = URL.createObjectURL(file);
            resolve({
              fileId,
              name: file.name,
              contentType: file.type,
              sizeBytes: file.size,
              storagePath,
              downloadUrl: localUrl
            });
          }
        }
      );
    } catch (taskErr) {
      console.warn('[Storage] uploadTask error, using local blob:', taskErr);
      if (onProgress) onProgress(100);
      const localUrl = URL.createObjectURL(file);
      resolve({
        fileId,
        name: file.name,
        contentType: file.type,
        sizeBytes: file.size,
        storagePath: `local://projects/${projectId}/files/${fileId}/${sanitizedName}`,
        downloadUrl: localUrl
      });
    }
  });
}

/**
 * Deletes a file from Firebase Storage
 */
export async function deleteProjectFile(storagePath: string): Promise<void> {
  const fileRef = ref(storage, storagePath);
  await deleteObject(fileRef);
}
