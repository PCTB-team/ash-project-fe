import { FILE_TAG_COLORS, FILE_TYPE_LABELS, TYPE_CLASSIFICATION } from './fileConfig.js';

/**
 * Returns Ant Design Tag color string for each document type.
 */
export function getFileTagColor(type) {
  return FILE_TAG_COLORS[type] || 'default';
}

/**
 * Returns human-readable label for document type.
 */
export function getFileTypeLabel(type) {
  return FILE_TYPE_LABELS[type] || 'Tệp';
}

/**
 * Detects document type from file extension.
 */
export function detectFileType(fileName) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (['docx', 'doc'].includes(ext)) return 'docx';
  if (['xlsx', 'xls'].includes(ext)) return 'xlsx';
  if (['ppt', 'pptx'].includes(ext)) return 'ppt';
  if (ext === 'txt') return 'txt';
  if (ext === 'md') return 'md';
  if (ext === 'mp3') return 'mp3';
  if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) return 'mp4';
  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext)) return ext;
  if (['zip', 'rar', '7z'].includes(ext)) return 'zip';
  if (ext === 'csv') return 'csv';
  return 'other';
}

/**
 * Classifies a raw file type into a category for tab filtering.
 * Returns: 'document' | 'audio' | 'video' | 'image' | 'folder' | 'other'
 */
function classifyFileType(type) {
  for (const [category, extensions] of Object.entries(TYPE_CLASSIFICATION)) {
    if (extensions.includes(type)) return category;
  }
  return 'other';
}

/**
 * Formats bytes to human-readable string (KB, MB, GB).
 */
export function formatBytes(bytes) {
  if (bytes === 0 || !bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
