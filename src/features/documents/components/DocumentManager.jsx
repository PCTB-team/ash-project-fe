import { useState, useMemo, useRef, useEffect } from 'react';
import { Tag, Tooltip, message } from 'antd';
import FileIcon from './FileIcon.jsx';
import useDebounce from '../../../hooks/useDebounce.js';
import { getFileTagColor, getFileTypeLabel } from '../../dashboard/utils/helpers.js';
import { formatRelativeTime } from '../../dashboard/utils/dateUtils.js';
import { MANAGER_TAB_OPTIONS, SORT_EXT_OPTIONS } from '../../dashboard/utils/fileConfig.js';
import useDragScroll from '../../dashboard/hooks/useDragScroll.js';
import { useDocuments } from '../hooks/useDocuments.js';

const PAGE_SIZE = 8;

/**
 * DocumentManager — Classification Tabs + Extension Sort + Server Paginated Vertical List + Folder Navigation.
 * Rendered INSIDE the premium glassmorphic container div.
 */
export default function DocumentManager({
  searchTerm = '',
  folderPath = [],
  onFolderChange,
  onBreadcrumbClick,
  onPreviewDoc,
  onAskAI,
  onRemoveDocument,
  onRenameDocument,
  onUpdateDocumentsCount,
  refreshTrigger,
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [sortExt, setSortExt] = useState('');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const {
    folders,
    paginatedDocs,
    totalPages,
    totalElements,
    fetchFolders,
    createFolder,
    fetchDocuments,
    downloadDocument,
  } = useDocuments();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const tabsRef = useDragScroll();
  const listRef = useRef(null);

  const currentFolder = folderPath.length > 0 ? folderPath[folderPath.length - 1] : null;
  const currentFolderId = currentFolder?.id || null;

  useEffect(() => {
    fetchDocuments(activeTab, currentPage, PAGE_SIZE, debouncedSearchTerm, currentFolderId, sortExt, onUpdateDocumentsCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, activeTab, sortExt, debouncedSearchTerm, currentFolderId, refreshTrigger, fetchDocuments]);

  // Reset page when filters change
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setCurrentPage(1); }, [activeTab, sortExt, debouncedSearchTerm, currentFolderId]);

  // ── All items for current view (folders + docs) ──
  const processedDocs = useMemo(() => {
    let combined = [...paginatedDocs];

    // Local Search Filter
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      combined = combined.filter(item => item.name.toLowerCase().includes(q));
    }

    // Prioritize by SortExt
    if (sortExt) {
      const foldersList = combined.filter(item => item.type === 'folder');
      const prioritizedDocs = combined.filter(item => item.type === sortExt);
      const otherDocs = combined.filter(item => item.type !== 'folder' && item.type !== sortExt);
      combined = [...prioritizedDocs, ...foldersList, ...otherDocs];
    }

    return combined;
  }, [paginatedDocs, searchTerm, sortExt]);

  const sortLabel = SORT_EXT_OPTIONS.find((o) => o.value === sortExt)?.label || 'Mặc định';

  // ── Handle folder click ──
  const handleItemClick = (doc) => {
    if (doc.type === 'folder') {
      onFolderChange?.(doc);
      setCurrentPage(1);
    } else {
      onPreviewDoc?.(doc);
    }
  };

  // ── Handle create folder ──
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    const result = await createFolder(newFolderName, currentFolderId);
    if (result.success) {
      setNewFolderName('');
      setShowNewFolderInput(false);
      onRefreshDocuments?.();
    } else {
      message.error(result.message);
    }
  };

  // ── Go to page ──
  const goToPage = (page) => {
    setCurrentPage(page);
    listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Tab color palette ──
  const palette = {
    all: { on: 'bg-[#1d1d1f] text-white shadow-sm', off: 'bg-black/[0.02] text-black/55 hover:bg-black/[0.05]' },
    document: { on: 'bg-blue-500 text-white shadow-md ', off: 'bg-blue-50/50 text-blue-500 hover:bg-blue-50' },
    audio: { on: 'bg-amber-500 text-white shadow-md ', off: 'bg-amber-50/50 text-amber-600 hover:bg-amber-50' },
    video: { on: 'bg-pink-500 text-white shadow-md ', off: 'bg-pink-50/50 text-pink-500 hover:bg-pink-50' },
    image: { on: 'bg-purple-500 text-white shadow-md ', off: 'bg-purple-50/50 text-purple-500 hover:bg-purple-50' },
    folder: { on: 'bg-orange-500 text-white shadow-md ', off: 'bg-orange-50/50 text-orange-500 hover:bg-orange-50' },
    other: { on: 'bg-gray-500 text-white shadow-md ', off: 'bg-gray-100/50 text-gray-500 hover:bg-gray-100' },
  };

  return (
    <>
      {/* ═══ TOP BAR: Breadcrumb + Tabs + Sort ═══ */}
      <div className="flex-shrink-0 border-b border-black/[0.04] bg-white/70 backdrop-blur-xl relative z-20">

        {/* Breadcrumb (when inside a folder) */}
        {folderPath.length > 0 && (
          <div className="px-3 sm:px-5 pt-3 flex items-center gap-1.5 text-[11.5px] font-semibold flex-wrap">
            <button
              onClick={() => onFolderChange?.(null)}
              className="text-[#ff5c00] hover:text-[#e05000] cursor-pointer flex items-center gap-1 transition-colors"
            >
              <i className="bi bi-house-fill text-[12px]" /> Thư viện
            </button>
            {folderPath.map((folder, index) => (
              <span key={folder.id} className="flex items-center gap-1.5">
                <i className="bi bi-chevron-right text-[9px] text-black/25" />
                <button
                  onClick={() => {
                    if (index < folderPath.length - 1) {
                      onBreadcrumbClick?.(index);
                    }
                  }}
                  className={`flex items-center gap-1.5 transition-colors ${index === folderPath.length - 1 ? 'text-black/60 cursor-default' : 'text-black/45 hover:text-black/80 cursor-pointer' }`}
                >
                  <i className={`bi bi-folder-fill ${index === folderPath.length - 1 ? 'text-[#ff9500]' : 'text-black/25'} text-[12px]`} />
                  <span className="max-w-[120px] sm:max-w-[180px] truncate">{folder.name}</span>
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Tabs + Sort row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 px-3 sm:px-5 pt-3 sm:pt-3.5 pb-3">
          {/* Scrollable Tabs */}
          <div ref={tabsRef} className="w-full md:flex-1 md:min-w-0 flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5 mask-fade-right">
            {MANAGER_TAB_OPTIONS.map((tab) => {
              const isActive = activeTab === tab.value;
              const p = palette[tab.value] || palette.other;
              return (
                <button
                  key={tab.value}
                  onClick={() => { setActiveTab(tab.value); setCurrentPage(1); }}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 sm:px-3.5 py-[7px] rounded-full text-[11px] sm:text-[11.5px] font-medium transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.97] ${isActive ? p.on : p.off}`}
                >
                  <i className={`bi ${tab.icon} text-[11px]`} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sort + New Folder buttons */}
          <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-1.5 flex-shrink-0">
            {/* New Folder button */}
            <button
              onClick={() => setShowNewFolderInput((v) => !v)}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-[7px] rounded-full text-[11px] sm:text-[11.5px] font-medium border border-black/10 hover:border-black/20 bg-black/[0.02] hover:bg-black/[0.06] text-black/60 hover:text-black transition-all duration-300 cursor-pointer"
              title="Tạo thư mục mới"
            >
              <i className="bi bi-folder-plus text-[12px]" />
              <span>Mới</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex-1 md:flex-none">
              <button
                onClick={() => setSortDropdownOpen((v) => !v)}
                className={`w-full flex items-center justify-center gap-1.5 px-3 py-[7px] rounded-xl text-[11px] sm:text-[11.5px] font-medium border transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.97] ${sortExt ? 'bg-[#ff5c00]/10 text-[#ff5c00] border-[#ff5c00]/20' : 'bg-black/[0.015] text-black/45 border-black/[0.05] hover:border-black/10' }`}
              >
                <i className="bi bi-sort-down text-[12px]" />
                <span className="max-w-[90px] truncate">{sortLabel}</span>
                <i className={`bi bi-chevron-down text-[8px] transition-transform duration-200 ${sortDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {sortDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-[60]" onClick={() => setSortDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-1.5 z-[70] bg-white rounded-xl border border-black/[0.06] shadow-sm shadow-black/8 py-1 min-w-[170px] max-h-[280px] overflow-y-auto animate-scale-up">
                    {SORT_EXT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortExt(opt.value); setSortDropdownOpen(false); }}
                        className={`w-full text-left px-3.5 py-[7px] text-[11.5px] font-semibold transition-colors cursor-pointer flex items-center justify-between ${sortExt === opt.value ? 'text-[#ff5c00] bg-[#ff5c00]/5 font-medium' : 'text-black/55 hover:bg-black/[0.03] hover:text-black' }`}
                      >
                        {opt.label}
                        {sortExt === opt.value && <i className="bi bi-check2 text-[12px]" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Inline new folder input */}
        {showNewFolderInput && (
          <div className="px-3 sm:px-5 pb-3 flex items-center gap-2 animate-fade-in">
            <div className="flex-1 flex items-center gap-2 bg-black/[0.02] rounded-xl border border-black/[0.06] focus-within:border-[#ff5c00]/30 focus-within:ring-2 focus-within:ring-[#ff5c00]/10 transition-all px-3 py-1.5">
              <i className="bi bi-folder-plus text-[#ff9500] text-[13px]" />
              <input
                type="text"
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCreateFolder(); if (e.key === 'Escape') { setShowNewFolderInput(false); setNewFolderName(''); } }}
                placeholder="Nhập tên thư mục mới..."
                className="flex-1 bg-transparent text-[12px] font-semibold text-black outline-none placeholder:text-black/30"
              />
            </div>
            <button
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim()}
              className="px-4 py-1.5 rounded-full bg-gradient-to-b from-[#ff7a00] to-[#ff5c00] text-white text-[11px] font-medium cursor-pointer border-none shadow-[0_1px_3px_rgba(255,92,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] hover:brightness-110 hover:shadow-[0_4px_14px_rgba(255,92,0,0.35)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
            >
              Tạo
            </button>
            <button
              onClick={() => { setShowNewFolderInput(false); setNewFolderName(''); }}
              className="px-3 py-1.5 rounded-full border border-black/10 hover:border-black/20 bg-black/[0.02] hover:bg-black/[0.06] text-black/60 hover:text-black text-[11px] font-medium cursor-pointer transition-all duration-300"
            >
              Hủy
            </button>
          </div>
        )}

        {/* Active sort indicator chip */}
        {sortExt && (
          <div className="px-3 sm:px-5 pb-2.5 flex items-center gap-2">
            <span className="text-[10px] font-semibold text-black/30">Đang ưu tiên:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#ff5c00]/10 text-[#ff5c00] text-[10px] font-medium">
              .{sortExt}
              <button onClick={() => setSortExt('')} className="ml-0.5 hover:text-[#cc4a00] cursor-pointer"><i className="bi bi-x text-[11px]" /></button>
            </span>
          </div>
        )}
      </div>

      {/* ═══ DOCUMENT LIST ═══ */}
      <div ref={listRef} className="flex-1 overflow-y-auto relative z-10">
        {processedDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in px-4">
            <div className="w-16 h-16 rounded-2xl bg-black/[0.02] flex items-center justify-center mb-4">
              <i className={`bi ${currentFolderId ? 'bi-folder2-open' : 'bi-inbox'} text-[28px] text-black/12`} />
            </div>
            <p className="text-[13px] font-medium text-black/30 mb-1">
              {currentFolderId ? 'Thư mục trống' : 'Không có tài liệu nào'}
            </p>
            <p className="text-[11px] font-semibold text-black/20">
              {currentFolderId ? 'Tải lên tài liệu hoặc tạo thư mục con' : 'Thử chuyển tab hoặc thay đổi từ khóa tìm kiếm'}
            </p>
          </div>
        ) : (
          <>
            {/* Column Headers (hidden on mobile) */}
            <div className="hidden sm:flex items-center gap-3 px-4 sm:px-5 py-2 border-b border-black/[0.03] text-[10px] font-medium text-black/30 uppercase select-none">
              <div className="w-10 flex-shrink-0" /> {/* Khớp với kích thước icon */}
              <span className="flex-1 min-w-0">Tên tài liệu</span>
              <span className="w-[72px] text-center">Định dạng</span>
              <span className="w-[100px] text-center hidden md:block">Ngày upload</span>
              <span className="w-[85px] text-right hidden md:block whitespace-nowrap">Dung lượng</span>
              <span className="w-[104px]" /> {/* Khớp với width của nhóm Actions */}
            </div>

            {/* Rows */}
            <div className="divide-y divide-black/[0.025]">
              {processedDocs.map((doc) => (
                  <DocumentRow
                  key={doc.id}
                  doc={doc}
                  isPriority={!!(sortExt && doc.type === sortExt)}
                  onClick={() => handleItemClick(doc)}
                  onAskAI={() => onAskAI?.(doc)}
                  onRemove={() => onRemoveDocument?.(doc.id)}
                  onRename={(newName) => onRenameDocument?.(doc.id, newName)}
                  downloadDocument={downloadDocument}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ═══ FOOTER: Pagination ═══ */}
      {processedDocs.length > 0 && (
        <div className="flex-shrink-0 border-t border-black/[0.04] bg-white/50 backdrop-blur-md px-3 sm:px-5 py-2.5 flex items-center justify-between relative z-10">
          <span className="text-[10.5px] font-semibold text-black/30">
            {totalElements} tài liệu · Trang {currentPage}/{totalPages}
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              {/* Prev */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] text-black/55 hover:bg-black/[0.04] hover:text-black disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                <i className="bi bi-chevron-left" />
              </button>

              {/* Page numbers */}
              {generatePageNumbers(currentPage, totalPages).map((p, i) =>
                p === '...' ? (
                  <span key={`dot-${i}`} className="w-6 text-center text-[10px] text-black/20 font-medium">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-medium cursor-pointer transition-all ${p === currentPage ? 'bg-[#ff5c00] text-white shadow-sm ' : 'text-black/45 hover:bg-black/[0.04] hover:text-black' }`}
                  >
                    {p}
                  </button>
                )
              )}

              {/* Next */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] text-black/55 hover:bg-black/[0.04] hover:text-black disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                <i className="bi bi-chevron-right" />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════
   Page number generator with ellipsis
   ═══════════════════════════════════════ */
function generatePageNumbers(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [];
  pages.push(1);
  if (current > 3) pages.push('...');
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}

/* ═══════════════════════════════════════
   DocumentRow — Single file row
   ═══════════════════════════════════════ */
function DocumentRow({ doc, isPriority, onClick, onAskAI, onRemove, onRename, downloadDocument }) {
  const isFolder = doc.type === 'folder';
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(doc.name);

  const handleEditSubmit = () => {
    if (editName.trim() && editName.trim() !== doc.name) {
      onRename?.(editName.trim());
    }
    setIsEditing(false);
  };

  const handleDownload = async () => {
    await downloadDocument(doc);
  };

  return (
    <div
      onClick={!isEditing ? onClick : undefined}
      className={`group flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 transition-all duration-200 ${isEditing ? 'bg-black/[0.02]' : isPriority ? 'bg-[#ff5c00]/[0.03] hover:bg-[#ff5c00]/[0.06] cursor-pointer' : 'hover:bg-black/[0.015] cursor-pointer' }`}
    >
      {/* Icon */}
      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${isFolder ? 'bg-[#ff9500]/10 border border-[#ff9500]/15' : isPriority ? 'bg-[#ff5c00]/10 border border-[#ff5c00]/15' : 'bg-black/[0.02] border border-black/[0.04] group-hover:border-black/[0.08]' }`}>
        <FileIcon type={doc.type} style={{ fontSize: 16 }} />
      </div>

      {/* Name + mobile meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <input
              autoFocus
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEditSubmit();
                if (e.key === 'Escape') { setEditName(doc.name); setIsEditing(false); }
              }}
              onBlur={handleEditSubmit}
              onClick={(e) => e.stopPropagation()}
              className="text-[12.5px] sm:text-[13px] font-semibold text-black bg-white border border-black/10 rounded-md px-2 py-0.5 outline-none focus:border-[#ff5c00]/40 focus:ring-2 focus:ring-[#ff5c00]/10 w-full max-w-[250px]"
            />
          ) : (
            <h4 className={`text-[12.5px] sm:text-[13px] font-semibold truncate transition-colors ${isFolder ? 'text-black group-hover:text-[#ff9500]' : 'text-black group-hover:text-[#ff5c00]' }`}>
              {doc.name}
            </h4>
          )}
          {isFolder && (
            <i className="bi bi-chevron-right text-[10px] text-black/20 group-hover:text-[#ff9500] transition-colors" />
          )}
          {isPriority && !isFolder && (
            <span className="hidden sm:inline-flex items-center px-1.5 py-[1px] rounded text-[8px] font-semibold uppercase bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] text-white flex-shrink-0">
              Ưu tiên
            </span>
          )}
        </div>
        {/* Mobile-only secondary info */}
        <div className="flex items-center gap-2 mt-0.5 sm:hidden">
          <Tag color={getFileTagColor(doc.type)} className="font-medium text-[8px] uppercase rounded-full border-none px-1.5 py-0 m-0">
            {getFileTypeLabel(doc.type)}
          </Tag>
          <span className="text-[10px] text-black/35 font-medium">{doc.timeSinceUpload || formatRelativeTime(doc.uploadedAt)}</span>
        </div>
      </div>

      {/* Format (desktop) */}
      <div className="w-[72px] hidden sm:flex justify-center flex-shrink-0">
        <Tag color={getFileTagColor(doc.type)} className="font-medium text-[9px] uppercase rounded-full border-none px-2 py-0.5 m-0">
          {getFileTypeLabel(doc.type)}
        </Tag>
      </div>

      {/* Date (desktop/tablet) */}
      <span className="w-[100px] text-center text-[11px] text-black/45 font-medium hidden md:block flex-shrink-0">
        {doc.timeSinceUpload || formatRelativeTime(doc.uploadedAt)}
      </span>

      {/* Size (desktop/tablet) */}
      <span className="w-[85px] text-right text-[11px] text-black/55 font-semibold hidden md:block flex-shrink-0 whitespace-nowrap">
        {doc.size}
      </span>

      {/* Actions */}
      <div className="w-auto sm:w-[104px] flex items-center justify-end gap-1 flex-shrink-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {/* Edit Button - available for both folder and files */}
        {!isEditing && (
          <Tooltip title="Đổi tên" mouseEnterDelay={0.4}>
            <button
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-black/[0.02] text-black/55 hover:bg-black/[0.06] hover:text-black flex items-center justify-center transition-all cursor-pointer text-[11px] sm:text-[12px]"
            >
              <i className="bi bi-pencil" />
            </button>
          </Tooltip>
        )}

        {/* Download - only for non-folder items */}
        {!isFolder && !isEditing && (
          <Tooltip title="Tải xuống" mouseEnterDelay={0.4}>
            <button
              onClick={(e) => { e.stopPropagation(); handleDownload(); }}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all cursor-pointer text-[11px] sm:text-[12px]"
            >
              <i className="bi bi-download" />
            </button>
          </Tooltip>
        )}

        {/* Ask AI - only for non-folder items */}
        {!isFolder && !isEditing && (
          <Tooltip title="Hỏi AI" mouseEnterDelay={0.4}>
            <button
              onClick={(e) => { e.stopPropagation(); onAskAI(); }}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#ff5c00]/10 text-[#ff5c00] hover:bg-[#ff5c00] hover:text-white flex items-center justify-center transition-all cursor-pointer text-[11px] sm:text-[12px]"
            >
              <i className="bi bi-chat-dots" />
            </button>
          </Tooltip>
        )}

        {/* Remove - available for both folder and files */}
        {!isEditing && (
          <Tooltip title="Xóa" mouseEnterDelay={0.4}>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all cursor-pointer text-[11px] sm:text-[12px]"
            >
              <i className="bi bi-trash3" />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

