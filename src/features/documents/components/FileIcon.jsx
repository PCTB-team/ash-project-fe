/**
 * Reusable FileIcon component — Bootstrap Icons for all document types.
 */
export default function FileIcon({ type, className = '', style = {} }) {
  const iconConfig = {
    pdf:    { icon: 'bi-file-earmark-pdf-fill',   color: '#ff3b30' },
    docx:   { icon: 'bi-file-earmark-word-fill',  color: '#0071e3' },
    xlsx:   { icon: 'bi-file-earmark-excel-fill', color: '#34c759' },
    ppt:    { icon: 'bi-file-earmark-ppt-fill',   color: '#ff9500' },
    txt:    { icon: 'bi-file-earmark-text-fill',  color: '#5ac8fa' },
    md:     { icon: 'bi-markdown-fill',           color: '#6366f1' },
    mp3:    { icon: 'bi-file-earmark-music-fill',  color: '#fbbf24' },
    mp4:    { icon: 'bi-file-earmark-play-fill',  color: '#ff2d55' },
    png:    { icon: 'bi-file-earmark-image-fill', color: '#af52de' },
    jpg:    { icon: 'bi-file-earmark-image-fill', color: '#af52de' },
    jpeg:   { icon: 'bi-file-earmark-image-fill', color: '#af52de' },
    svg:    { icon: 'bi-file-earmark-image-fill', color: '#af52de' },
    webp:   { icon: 'bi-file-earmark-image-fill', color: '#af52de' },
    image:  { icon: 'bi-file-earmark-image-fill', color: '#af52de' },
    video:  { icon: 'bi-file-earmark-play-fill',  color: '#ff2d55' },
    folder: { icon: 'bi-folder-fill',             color: '#ff9500' },
    zip:    { icon: 'bi-file-earmark-zip-fill',   color: '#8e8e93' },
    csv:    { icon: 'bi-filetype-csv',            color: '#34c759' },
  };

  const config = iconConfig[type] || { icon: 'bi-file-earmark-fill', color: '#86868b' };

  return (
    <i
      className={`bi ${config.icon} ${className}`}
      style={{ color: config.color, fontSize: 18, ...style }}
    />
  );
}

