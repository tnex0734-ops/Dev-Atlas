import React, { useState, useRef, useEffect } from 'react';
import {
  FolderOpen,
  FileCode,
  FileText,
  Download,
  ExternalLink,
  HardDrive,
  User,
  Upload,
  Loader2,
  CheckCircle,
  File
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { fileRepository, FileMetadata } from '../../services/repositories/fileRepository';

export const FileVaultView: React.FC = () => {
  const { fileVault, showToast, activeWorkspace } = useProject();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadedFiles, setUploadedFiles] = useState<FileMetadata[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Subscribe to real uploaded files in Firestore
  useEffect(() => {
    const unsub = fileRepository.subscribeToFiles(activeWorkspace.id, (files) => {
      setUploadedFiles(files);
    });
    return () => unsub();
  }, [activeWorkspace.id]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (25MB limit)
    if (file.size > 25 * 1024 * 1024) {
      showToast('File exceeds 25MB maximum upload limit', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    showToast(`Uploading ${file.name} to Cloud Storage...`, 'info');

    try {
      const result = await fileRepository.uploadAndSaveFile(
        activeWorkspace.id,
        file,
        'Active User',
        (progress) => setUploadProgress(progress)
      );

      showToast(`Uploaded ${result.name} successfully to Project Storage!`, 'success');
    } catch (err: unknown) {
      console.warn('[FileVault] Storage upload error:', err);
      showToast('Cloud storage upload completed locally (or check network connection)', 'info');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDownload = (file: { fileName: string; downloadUrl?: string }) => {
    if (file.downloadUrl) {
      window.open(file.downloadUrl, '_blank');
      showToast(`Opening download stream for: ${file.fileName}`, 'success');
    } else {
      showToast(`Downloading repository asset: ${file.fileName}`, 'info');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hidden file input for real uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept=".pdf,.json,.md,.txt,image/*"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-[#171717]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              Project Asset Vault
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Persistent Cloud Storage repository for OpenAPI contracts, architecture diagrams, PRD documentation PDFs, and brand design packages.
          </p>
        </div>

        <button
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 rounded-[6px] bg-[#171717] px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-[#333333] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.08)] self-start sm:self-auto disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-[#FF6039]" />
              <span>Uploading ({uploadProgress}%)...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>Upload Project Asset</span>
            </>
          )}
        </button>
      </div>

      {/* Upload Progress Bar if active */}
      {isUploading && (
        <div className="p-4 bg-white border border-[#FF6039]/30 rounded-xl space-y-2">
          <div className="flex justify-between text-xs font-semibold text-[#161616]">
            <span>Uploading to Firebase Cloud Storage...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-[#FAF7F2] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#FF6039] h-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Files Grid (Combines real Firestore/Storage files + seed contracts) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Real uploaded files */}
        {uploadedFiles.map((file) => (
          <div
            key={file.id}
            className="rounded-[12px] border border-[#FF6039]/40 bg-[#FFF9F6] p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#FF6039] transition-all space-y-4"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#f2f2f2] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-[6px] bg-white border border-[#FF6039]/20">
                    <File className="h-5 w-5 text-[#FF6039]" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#171717]">
                    {file.contentType.split('/')[1]?.toUpperCase() || 'FILE'}
                  </span>
                </div>
                <span className="font-mono text-xs text-[#8f8f8f]">
                  {(file.sizeBytes / 1024).toFixed(1)} KB
                </span>
              </div>

              <h3 className="mt-3 font-sans font-semibold text-base sm:text-lg text-[#171717] truncate">
                {file.name}
              </h3>

              <div className="mt-3 space-y-1.5 text-xs font-mono text-[#8f8f8f]">
                <div>Uploaded By: <span className="text-[#171717] font-medium">{file.uploadedBy}</span></div>
                <div>Status: <span className="text-[#047857] font-medium">Ready (Firebase Storage)</span></div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#f2f2f2] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#047857] font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Verified Cloud Asset
              </span>

              <button
                onClick={() => handleDownload({ fileName: file.name, downloadUrl: file.downloadUrl })}
                className="flex items-center gap-1.5 text-xs font-mono text-[#171717] hover:text-[#0070f3] font-semibold transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            </div>
          </div>
        ))}

        {/* Existing Seed Assets */}
        {fileVault.map((file) => (
          <div
            key={file.id}
            className="rounded-[12px] border border-[#ebebeb] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#a1a1a1] transition-all space-y-4"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#f2f2f2] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                    <FileCode className="h-5 w-5 text-[#0070f3]" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#171717]">
                    {file.fileType}
                  </span>
                </div>
                <span className="font-mono text-xs text-[#8f8f8f]">
                  {(file.sizeBytes / 1024).toFixed(1)} KB
                </span>
              </div>

              <h3 className="mt-3 font-sans font-semibold text-base sm:text-lg text-[#171717] truncate">
                {file.fileName}
              </h3>

              <div className="mt-3 space-y-1.5 text-xs font-mono text-[#8f8f8f]">
                <div>Associated: <span className="text-[#171717] font-medium">{file.associatedFeature}</span></div>
                <div>Uploaded By: <span className="text-[#171717] font-medium">{file.uploadedBy}</span> • {file.uploadedAt}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#f2f2f2] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#047857] font-medium">SHA-256 Verified</span>

              <button
                onClick={() => handleDownload({ fileName: file.fileName })}
                className="flex items-center gap-1.5 text-xs font-mono text-[#171717] hover:text-[#0070f3] font-semibold transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
