import React, { useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { Button } from '../common/Button';

export const ResumeUploadCard = ({
  currentResumeUrl,
  resumeOriginalName,
  resumeSize,
  onUploadSuccess,
  onDeleteSuccess
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const maxFileSizeMb = parseInt(import.meta.env.VITE_MAX_FILE_SIZE_MB, 10) || 5;

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '';
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFile = async (file) => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!file) return;

    if (file.size > maxFileSizeMb * 1024 * 1024) {
      setErrorMsg(`File size exceeds ${maxFileSizeMb}MB limit.`);
      return;
    }

    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    const isExtensionValid = /\.(pdf|docx|doc)$/i.test(file.name);

    if (!validTypes.includes(file.type) && !isExtensionValid) {
      setErrorMsg('Accepted formats: PDF, DOC, and DOCX documents only.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    try {
      await onUploadSuccess(file, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });
      setSuccessMsg(`"${file.name}" uploaded successfully.`);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Remove your uploaded resume?')) return;

    setIsDeleting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      if (onDeleteSuccess) {
        await onDeleteSuccess();
        setSuccessMsg('Resume removed.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to delete resume');
    } finally {
      setIsDeleting(false);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => {
    setDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E9E6DF] p-5 shadow-sm space-y-4 text-[#202124]">
      <div className="flex items-center justify-between border-b border-[#E9E6DF] pb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#C6A15B]" />
          <h3 className="text-sm font-bold text-[#202124]">Resume &amp; CV</h3>
        </div>
        <span className="text-[11px] text-[#666666]">Max {maxFileSizeMb}MB (PDF, DOCX)</span>
      </div>

      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#202124] text-xs text-[#202124] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#C6A15B]" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#C6A15B]" />
          <span>{successMsg}</span>
        </div>
      )}

      {currentResumeUrl ? (
        <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFFFFF] border border-[#E9E6DF] flex items-center justify-center text-[#C6A15B]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#202124] truncate max-w-[220px]">
                {resumeOriginalName || 'Uploaded_Resume.pdf'}
              </p>
              <p className="text-[11px] text-[#666666]">{formatFileSize(resumeSize) || 'Verified document'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <a
              href={currentResumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E9E6DF] text-xs font-medium text-[#202124] hover:border-[#C6A15B] transition-colors inline-flex items-center gap-1"
            >
              <span>View</span>
              <ExternalLink className="w-3 h-3 text-[#C6A15B]" />
            </a>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 rounded-lg bg-[#FFFFFF] border border-[#E9E6DF] text-[#666666] hover:text-[#202124] hover:border-[#C6A15B] transition-colors cursor-pointer"
              title="Delete resume"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`p-6 rounded-xl border-2 border-dashed text-center transition-colors ${
            dragActive
              ? 'border-[#C6A15B] bg-[#FAF9F6]'
              : 'border-[#E9E6DF] hover:border-[#C6A15B] bg-[#FAF9F6]'
          }`}
        >
          <Upload className="w-6 h-6 text-[#C6A15B] mx-auto mb-2" />
          <p className="text-xs font-semibold text-[#202124]">
            Drag and drop your resume file here
          </p>
          <p className="text-[11px] text-[#666666] mt-0.5 mb-3">
            Supports PDF, DOC, and DOCX documents up to {maxFileSizeMb}MB
          </p>

          <label className="inline-flex">
            <input
              type="file"
              accept=".pdf,.docx,.doc,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              isLoading={isUploading}
              onClick={(e) => {
                e.currentTarget.parentElement.querySelector('input').click();
              }}
            >
              Browse Files
            </Button>
          </label>

          {isUploading && uploadProgress > 0 && (
            <div className="w-full bg-[#E9E6DF] rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="bg-[#C6A15B] h-1.5 rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
