/**
 * Firebase Storage Helper Functions
 * Handle file uploads and downloads
 */

import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadMetadata,
  UploadTask,
  StorageReference,
} from "firebase/storage";
import { getFirebaseStorage } from "./firebase";

/**
 * Upload file to Firebase Storage
 */
export const uploadFile = async (
  path: string,
  file: File,
  metadata?: UploadMetadata
): Promise<string> => {
  const storage = getFirebaseStorage();
  const storageRef = ref(storage, path);

  const snapshot = await uploadBytes(storageRef, file, metadata);
  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
};

/**
 * Upload file with progress tracking
 */
export const uploadFileWithProgress = (
  path: string,
  file: File,
  onProgress?: (progress: number) => void,
  metadata?: UploadMetadata
): UploadTask => {
  const storage = getFirebaseStorage();
  const storageRef = ref(storage, path);

  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  if (onProgress) {
    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      onProgress(progress);
    });
  }

  return uploadTask;
};

/**
 * Upload user avatar
 */
export const uploadAvatar = async (
  userId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const path = `avatars/${userId}/${Date.now()}_${file.name}`;

  if (onProgress) {
    const uploadTask = uploadFileWithProgress(path, file, onProgress, {
      contentType: file.type,
      customMetadata: { userId },
    });

    const snapshot = await uploadTask;
    return await getDownloadURL(snapshot.ref);
  }

  return uploadFile(path, file, {
    contentType: file.type,
    customMetadata: { userId },
  });
};

/**
 * Upload quiz image
 */
export const uploadQuizImage = async (
  quizId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const path = `quizzes/${quizId}/${Date.now()}_${file.name}`;

  if (onProgress) {
    const uploadTask = uploadFileWithProgress(path, file, onProgress, {
      contentType: file.type,
      customMetadata: { quizId },
    });

    const snapshot = await uploadTask;
    return await getDownloadURL(snapshot.ref);
  }

  return uploadFile(path, file, {
    contentType: file.type,
    customMetadata: { quizId },
  });
};

/**
 * Delete file from storage
 */
export const deleteFile = async (path: string): Promise<void> => {
  const storage = getFirebaseStorage();
  const fileRef = ref(storage, path);

  await deleteObject(fileRef);
};

/**
 * Get download URL for a file
 */
export const getFileURL = async (path: string): Promise<string> => {
  const storage = getFirebaseStorage();
  const fileRef = ref(storage, path);

  return await getDownloadURL(fileRef);
};

/**
 * Get storage reference
 */
export const getStorageRef = (path: string): StorageReference => {
  const storage = getFirebaseStorage();
  return ref(storage, path);
};
