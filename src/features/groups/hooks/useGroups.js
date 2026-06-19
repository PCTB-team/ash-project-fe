import { useState, useCallback } from 'react';
import { message } from 'antd';
import * as groupApi from '../api/groups.api';

export const useGroups = () => {
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [groupPreview, setGroupPreview] = useState(null);
  const [members, setMembers] = useState([]);
  const [memberCount, setMemberCount] = useState(0);
  const [files, setFiles] = useState([]);
  const [trashFiles, setTrashFiles] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGroups = useCallback(async () => {
    setIsLoading(true); setError(null);
    try { 
      const data = await groupApi.getGroups(); 
      const raw = data.result || data || [];
      const mapped = raw.map(g => ({
        ...g,
        id: g.groupId || g.id,
        owner: g.ownerId || g.owner,
        ownerName: g.ownerName,
        role: g.role,
        canUpload: g.canUpload,
        inviteEnabled: g.inviteEnabled,
        inviteLink: g.inviteLink,
        memberCount: g.memberCount || g.members?.length || 0,
        fileCount: g.activeFileCount || g.fileCount || g.documents?.length || 0,
      }));
      setGroups(mapped); 
    }
    catch (err) { setError(err.message); message.error('Không thể tải danh sách nhóm.'); }
    finally { setIsLoading(false); }
  }, []);

  const fetchMyGroups = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const data = await groupApi.getMyGroups();
      const raw = data.result || data || [];
      // Map API response fields → GroupCard expected fields
      const mapped = raw.map(g => ({
        id: g.groupId,
        name: g.name,
        description: g.description,
        owner: g.ownerId,
        ownerName: g.ownerName,
        role: g.role,
        canUpload: g.canUpload,
        inviteEnabled: g.inviteEnabled,
        inviteLink: g.inviteLink,
        memberCount: g.memberCount || 0,
        fileCount: g.activeFileCount || 0,
        createdAt: g.createdAt,
        updatedAt: g.updatedAt,
        // Mark as member since this is "my groups"
        isMine: true,
      }));
      setGroups(mapped);
    }
    catch (err) { setError(err.message); message.error('Không thể tải danh sách nhóm của bạn.'); }
    finally { setIsLoading(false); }
  }, []);

  const fetchGroupById = useCallback(async (groupId) => {
    setIsLoading(true); setError(null);
    try {
      const data = await groupApi.getGroupById(groupId);
      const raw = data.result || data || null;
      if (raw) {
        // Map API fields → component expected fields, giữ nguyên raw data
        setCurrentGroup({
          ...raw,
          id: raw.groupId || raw.id,
          owner: raw.ownerId || raw.owner,
          ownerName: raw.ownerName,
          memberCount: raw.memberCount || raw.members?.length || 0,
          fileCount: raw.activeFileCount || raw.fileCount || raw.documents?.length || 0,
        });
      } else {
        setCurrentGroup(null);
      }
    }
    catch (err) { setError(err.message); message.error('Không thể tải chi tiết nhóm.'); }
    finally { setIsLoading(false); }
  }, []);

  const createGroup = async (groupData) => {
    try { const data = await groupApi.createGroup(groupData); message.success(`Tạo nhóm "${groupData.name}" thành công!`); await fetchGroups(); return data; }
    catch (err) { message.error('Lỗi khi tạo nhóm: ' + err.message); throw err; }
  };

  const previewGroup = async (inviteToken) => {
    setIsLoading(true); setError(null);
    try { const data = await groupApi.getGroupPreview(inviteToken); const p = data.result || data; setGroupPreview(p); return p; }
    catch (err) { setGroupPreview(null); message.error(err.message === 'INVITE_NOT_FOUND' ? 'Link mời không hợp lệ.' : 'Không thể xem trước nhóm.'); throw err; }
    finally { setIsLoading(false); }
  };

  const joinViaInvite = async (inviteToken, password) => {
    try { const data = await groupApi.joinGroupViaInvite(inviteToken, password); message.success('Đã gửi yêu cầu tham gia. Vui lòng chờ Leader duyệt.'); await fetchGroups(); return data; }
    catch (err) {
      if (err.message === 'WRONG_PASSWORD') message.error('Mật khẩu nhóm không chính xác.');
      else if (err.message === 'ALREADY_MEMBER') message.warning('Bạn đã là thành viên hoặc đang chờ duyệt.');
      else message.error('Lỗi khi tham gia nhóm.');
      throw err;
    }
  };

  const fetchMembers = useCallback(async (groupId) => {
    try { const data = await groupApi.getGroupMembers(groupId); const list = data.result?.members || []; setMembers(list); return list; }
    catch (err) { message.error('Không thể tải danh sách thành viên.'); throw err; }
  }, []);

  const fetchMemberCount = useCallback(async (groupId) => {
    try { const data = await groupApi.getMemberCount(groupId); const c = data.result ?? 0; setMemberCount(c); return c; }
    catch { return 0; }
  }, []);

  const fetchFiles = useCallback(async (groupId) => {
    try { 
      const data = await groupApi.getGroupFiles(groupId); 
      const list = data.result || [];
      const mapped = list.map(f => ({ ...f, id: f.fileId, name: f.fileName, size: f.fileSize, uploader: f.uploadedBy, date: f.uploadedAt, url: f.storageUrl }));
      setFiles(mapped); 
      return mapped; 
    }
    catch (err) { message.error('Không thể tải danh sách tài liệu.'); throw err; }
  }, []);

  const uploadFile = async (groupId, file) => {
    try { const fd = new FormData(); fd.append('file', file); const data = await groupApi.uploadGroupFile(groupId, fd); message.success('Tải lên tài liệu thành công!'); await fetchFiles(groupId); return data; }
    catch (err) { message.error(err.message === 'STORAGE_LIMIT_EXCEEDED' ? 'Hết dung lượng lưu trữ!' : 'Lỗi khi tải lên.'); throw err; }
  };

  const deleteFile = async (groupId, fileId) => {
    try { const data = await groupApi.deleteGroupFile(groupId, fileId); message.success('Đã chuyển vào thùng rác!'); await fetchFiles(groupId); return data; }
    catch (err) { message.error('Lỗi khi xóa tài liệu.'); throw err; }
  };

  const fetchTrashFiles = useCallback(async (groupId) => {
    try { 
      const data = await groupApi.getTrashFiles(groupId); 
      const list = data.result || [];
      const mapped = list.map(f => ({ ...f, id: f.fileId, name: f.fileName, size: f.fileSize, uploader: f.uploadedBy, date: f.uploadedAt, url: f.storageUrl }));
      setTrashFiles(mapped); 
      return mapped; 
    }
    catch (err) { 
      if (err.response?.status === 404) {
        setTrashFiles([]);
        return [];
      }
      message.error('Không thể tải thùng rác.'); 
      // return empty instead of throwing to prevent Uncaught Promise
      return []; 
    }
  }, []);

  const restoreFile = async (groupId, fileId) => {
    try { const data = await groupApi.restoreFile(groupId, fileId); message.success('Khôi phục tài liệu thành công!'); await fetchTrashFiles(groupId); await fetchFiles(groupId); return data; }
    catch (err) { message.error('Lỗi khi khôi phục.'); throw err; }
  };

  const fetchStatistics = useCallback(async (groupId) => {
    try { const data = await groupApi.getGroupStatistics(groupId); const s = data.result || null; setStatistics(s); return s; }
    catch (err) { message.error('Không thể tải thống kê.'); throw err; }
  }, []);

  const toggleUploadPermission = async (groupId, memberId, canUpload) => {
    try { const data = await groupApi.updateUploadPermission(groupId, memberId, canUpload); message.success('Đã cập nhật quyền upload.'); await fetchMembers(groupId); return data; }
    catch (err) { message.error('Lỗi khi cập nhật quyền.'); throw err; }
  };

  const kickMember = async (groupId, memberId) => {
    try { const data = await groupApi.kickMember(groupId, memberId); message.success('Đã xóa thành viên.'); await fetchGroupById(groupId); return data; }
    catch (err) { message.error('Lỗi khi xóa thành viên.'); throw err; }
  };

  const regenerateInvite = async (groupId) => {
    try { const data = await groupApi.regenerateInviteToken(groupId); message.success('Đã tạo Link mời mới!'); await fetchGroupById(groupId); return data; }
    catch (err) { message.error('Lỗi khi tạo Link mời.'); throw err; }
  };

  return {
    groups, currentGroup, groupPreview, members, memberCount, files, trashFiles, statistics, isLoading, error,
    fetchGroups, fetchMyGroups, fetchGroupById, createGroup, previewGroup, joinViaInvite,
    fetchMembers, fetchMemberCount, toggleUploadPermission, kickMember,
    fetchFiles, uploadFile, deleteFile, fetchTrashFiles, restoreFile,
    fetchStatistics, regenerateInvite,
  };
};
