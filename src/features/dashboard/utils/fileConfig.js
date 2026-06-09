/**
 * Centralized configurations and static datasets relating to file tags, labels, and forms.
 * Extended for Document Manager classification system.
 */

export const FILE_TAG_COLORS = {
  pdf: 'red',
  docx: 'blue',
  xlsx: 'green',
  ppt: 'orange',
  txt: 'cyan',
  md: 'geekblue',
  mp3: 'gold',
  mp4: 'magenta',
  png: 'purple',
  jpg: 'purple',
  jpeg: 'purple',
  svg: 'purple',
  webp: 'purple',
  image: 'purple',
  video: 'magenta',
  folder: 'volcano',
  zip: 'lime',
  csv: 'green',
  other: 'default',
};

export const FILE_TYPE_LABELS = {
  pdf: 'PDF',
  docx: 'Word',
  xlsx: 'Excel',
  ppt: 'PowerPoint',
  txt: 'Text',
  md: 'Markdown',
  mp3: 'Audio',
  mp4: 'Video',
  png: 'Ảnh',
  jpg: 'Ảnh',
  jpeg: 'Ảnh',
  svg: 'SVG',
  webp: 'Ảnh',
  image: 'Hình ảnh',
  video: 'Video',
  folder: 'Thư mục',
  zip: 'Nén',
  csv: 'CSV',
  other: 'Khác',
};

/**
 * Classification mapping: category → array of file extensions belonging to it.
 * Used by classifyFileType() in helpers.js
 */
export const TYPE_CLASSIFICATION = {
  document: ['txt', 'pdf', 'docx', 'ppt', 'md'],
  audio: ['mp3'],
  video: ['mp4'],
  image: ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'],
  folder: ['folder'],
};

/** Tabs for the Document Manager classification bar */
export const MANAGER_TAB_OPTIONS = [
  { label: 'Tất cả tệp', value: 'all', icon: 'bi-grid-3x3-gap-fill' },
  { label: 'Tài liệu', value: 'document', icon: 'bi-file-earmark-text-fill' },
  { label: 'Âm thanh', value: 'audio', icon: 'bi-music-note-beamed' },
  { label: 'Video', value: 'video', icon: 'bi-play-circle-fill' },
  { label: 'Hình ảnh', value: 'image', icon: 'bi-image-fill' },
  { label: 'Thư mục', value: 'folder', icon: 'bi-folder-fill' },
  { label: 'Khác', value: 'other', icon: 'bi-file-earmark-fill' },
];

/** Options for the extension-priority sort dropdown */
export const SORT_EXT_OPTIONS = [
  { label: 'Mặc định', value: '' },
  { label: 'Ưu tiên .pdf', value: 'pdf' },
  { label: 'Ưu tiên .docx', value: 'docx' },
  { label: 'Ưu tiên .xlsx', value: 'xlsx' },
  { label: 'Ưu tiên .ppt', value: 'ppt' },
  { label: 'Ưu tiên .txt', value: 'txt' },
  { label: 'Ưu tiên .md', value: 'md' },
  { label: 'Ưu tiên .mp3', value: 'mp3' },
  { label: 'Ưu tiên .mp4', value: 'mp4' },
  { label: 'Ưu tiên .png', value: 'png' },
  { label: 'Ưu tiên .jpg', value: 'jpg' },
  { label: 'Ưu tiên .svg', value: 'svg' },
  { label: 'Ưu tiên .csv', value: 'csv' },
  { label: 'Ưu tiên .zip', value: 'zip' },
];


/** Upload form type options */
export const UPLOAD_TYPE_OPTIONS = [
  { value: 'pdf', label: 'Tài liệu PDF' },
  { value: 'docx', label: 'Văn bản Word' },
  { value: 'xlsx', label: 'Bảng tính Excel' },
  { value: 'ppt', label: 'Slide PowerPoint' },
  { value: 'txt', label: 'Văn bản Text' },
  { value: 'md', label: 'Markdown' },
  { value: 'mp3', label: 'Âm thanh MP3' },
  { value: 'mp4', label: 'Video MP4' },
  { value: 'image', label: 'Hình ảnh' },
  { value: 'folder', label: 'Thư mục' },
  { value: 'other', label: 'Loại khác' },
];

