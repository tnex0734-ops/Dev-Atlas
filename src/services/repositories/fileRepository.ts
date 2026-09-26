import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { uploadProjectFile, deleteProjectFile, UploadProgressCallback } from '../firebase/storage';

export interface FileMetadata {
  id: string;
  name: string;
  contentType: string;
  sizeBytes: number;
  storagePath: string;
  uploadedBy: string;
  uploadedAt: unknown;
  downloadUrl?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  status: 'uploaded' | 'processing' | 'ready' | 'failed';
}

export const fileRepository = {
  async getFiles(projectId: string): Promise<FileMetadata[]> {
    try {
      const snap = await getDocs(collection(db, 'projects', projectId, 'files'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FileMetadata));
    } catch (err) {
      console.warn(`[fileRepository] getFiles(${projectId}) error:`, err);
      return [];
    }
  },

  async uploadAndSaveFile(
    projectId: string,
    file: File,
    uploadedBy: string,
    onProgress?: UploadProgressCallback
  ): Promise<FileMetadata> {
    const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    
    // 1. Upload binary file to Cloud Storage
    const uploadRes = await uploadProjectFile(projectId, file, fileId, onProgress);

    // 2. Save metadata to Firestore
    const fileDoc: FileMetadata = {
      id: fileId,
      name: uploadRes.name,
      contentType: uploadRes.contentType,
      sizeBytes: uploadRes.sizeBytes,
      storagePath: uploadRes.storagePath,
      downloadUrl: uploadRes.downloadUrl,
      uploadedBy,
      uploadedAt: serverTimestamp(),
      status: 'ready'
    };

    const ref = doc(db, 'projects', projectId, 'files', fileId);
    await setDoc(ref, fileDoc);

    return fileDoc;
  },

  async deleteFile(projectId: string, fileId: string, storagePath: string): Promise<void> {
    // 1. Delete binary from Storage
    try {
      await deleteProjectFile(storagePath);
    } catch (err) {
      console.warn(`[fileRepository] Storage deletion warning:`, err);
    }

    // 2. Delete Firestore metadata document
    await deleteDoc(doc(db, 'projects', projectId, 'files', fileId));
  },

  subscribeToFiles(projectId: string, callback: (files: FileMetadata[]) => void): Unsubscribe {
    const coll = collection(db, 'projects', projectId, 'files');
    return onSnapshot(
      coll,
      (snap) => {
        const files = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FileMetadata));
        callback(files);
      },
      (err) => {
        console.warn(`[fileRepository] Subscription error for ${projectId}:`, err);
      }
    );
  }
};
