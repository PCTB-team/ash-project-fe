import { axiosClient } from '../../../utils/apiClient';

const BASE_URL = 'https://ash-project-be.onrender.com/api/v1/groups';

export const getMyGroups = async (page = 0, size = 5, keyword = undefined) => {
  const response = await axiosClient.get(`${BASE_URL}/my`, {
    params: { page, size, keyword: keyword || undefined }
  });
  return response.data;
};

// ─── 2. Get Group By ID ───
export const getGroupById = async (groupId) => {
  const response = await axiosClient.get(`${BASE_URL}/${groupId}`);
  return response.data;
};

// ─── 3. Create Group ─── POST /groups
export const createGroup = async (groupData) => {
  const response = await axiosClient.post(BASE_URL, groupData);
  return response.data;
};

// ─── 4. Group Preview via Invite Token ─── GET /groups/invite/{inviteToken}
export const getGroupPreview = async (inviteToken) => {
  try {
    const response = await axiosClient.get(`${BASE_URL}/invite/${inviteToken}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) throw new Error('INVITE_NOT_FOUND');
    throw new Error('Failed to preview group');
  }
};

// ─── 5. Join Group via Invite Token ─── POST /groups/invite/{inviteToken}/join
export const joinGroupViaInvite = async (inviteToken, password) => {
  try {
    const response = await axiosClient.post(`${BASE_URL}/invite/${inviteToken}/join`, { password });
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) throw new Error('WRONG_PASSWORD');
    if (error.response?.status === 404) throw new Error('INVITE_NOT_FOUND');
    if (error.response?.status === 409) throw new Error('ALREADY_MEMBER');
    throw new Error('Failed to join group');
  }
};



// ─── 7. Get Group Members ─── GET /groups/{groupId}/members
export const getGroupMembers = async (groupId) => {
  const response = await axiosClient.get(`${BASE_URL}/${groupId}/members`);
  return response.data;
};



// ─── 9. Regenerate Invite Token ─── PUT /groups/{groupId}/regenerate-invite-token
export const regenerateInviteToken = async (groupId) => {
  const response = await axiosClient.put(`${BASE_URL}/${groupId}/regenerate-invite-token`);
  return response.data;
};

// ─── 10. Update Upload Permission ─── PUT /groups/{groupId}/members/{memberId}/upload-permission
export const updateUploadPermission = async (groupId, memberId, canUpload) => {
  const response = await axiosClient.put(`${BASE_URL}/${groupId}/members/${memberId}/upload-permission`, { canUpload });
  return response.data;
};

// ─── 11. Kick Member ─── PUT /groups/{groupId}/members/{memberId}/kick
export const kickMember = async (groupId, memberId) => {
  const response = await axiosClient.put(`${BASE_URL}/${groupId}/members/${memberId}/kick`);
  return response.data;
};

// ─── 12. Upload File ─── POST /groups/{groupId}/files
export const uploadGroupFile = async (groupId, formData) => {
  try {
    const response = await axiosClient.post(`${BASE_URL}/${groupId}/files`, formData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 413) throw new Error('STORAGE_LIMIT_EXCEEDED');
    throw new Error('Failed to upload file');
  }
};

// ─── 13. Get Active Files ─── GET /groups/{groupId}/files
export const getGroupFiles = async (groupId) => {
  const response = await axiosClient.get(`${BASE_URL}/${groupId}/files`);
  return response.data;
};

// ─── 14. Delete File (Move to Trash) ─── DELETE /groups/{groupId}/files/{fileId}
export const deleteGroupFile = async (groupId, fileId) => {
  const response = await axiosClient.delete(`${BASE_URL}/${groupId}/files/${fileId}`);
  return response.data;
};

// ─── 15. Get Trash Files ─── GET /groups/{groupId}/files?deleted=true
export const getTrashFiles = async (groupId) => {
  const response = await axiosClient.get(`${BASE_URL}/${groupId}/files?deleted=true`);
  return response.data;
};

// ─── 17. Leave Group ─── PUT /groups/{groupId}/leave
export const leaveGroup = async (groupId) => {
  const response = await axiosClient.put(`${BASE_URL}/${groupId}/leave`);
  return response.data;
};

// ─── 19. Get Group Messages ─── GET /groups/{groupId}/messages
export const getGroupMessages = async (groupId, page = 0, size = 30) => {
  const response = await axiosClient.get(`${BASE_URL}/${groupId}/messages`, {
    params: { page, size },
  });
  return response.data.result;
};

// ─── 20. Send Group Message ─── POST /groups/{groupId}/messages
export const sendGroupMessage = async (groupId, content) => {
  const response = await axiosClient.post(`${BASE_URL}/${groupId}/messages`, {
    content,
  });
  return response.data.result;
};

// ─── 21. Update Chat Permission ─── PUT /groups/{groupId}/members/{memberId}/chat-permission
export const updateChatPermission = async (groupId, memberId, canChat) => {
  const response = await axiosClient.put(
    `${BASE_URL}/${groupId}/members/${memberId}/chat-permission`,
    { canChat }
  );
  return response.data.result;
};

// ─── 18. Update Group Password ─── PUT /groups/{groupId}/password
export const updateGroupPassword = async (groupId, newPassword, confirmPassword) => {
  const response = await axiosClient.put(`${BASE_URL}/${groupId}/password`, { newPassword, confirmPassword });
  return response.data;
};

// ─── 16. Restore File ─── PUT /groups/{groupId}/files/{fileId}/restore
export const restoreFile = async (groupId, fileId) => {
  const response = await axiosClient.put(`${BASE_URL}/${groupId}/files/${fileId}/restore`);
  return response.data;
};

// ─── 22. Delete File Permanently ─── DELETE /groups/{groupId}/files/{fileId}/permanent
export const deleteGroupFilePermanently = async (groupId, fileId) => {
  const response = await axiosClient.delete(`${BASE_URL}/${groupId}/files/${fileId}/permanent`);
  return response.data.result;
};

// ─── 23. Save Group File To Dashboard ─── POST /groups/{groupId}/files/{fileId}/save-to-dashboard
export const saveGroupFileToDashboard = async (groupId, fileId, payload = {}) => {
  const response = await axiosClient.post(
    `${BASE_URL}/${groupId}/files/${fileId}/save-to-dashboard`,
    payload
  );
  return response.data.result;
};

// ─── 24. Delete Group Permanently ─── DELETE /groups/{groupId}
export const deleteGroupPermanently = async (groupId) => {
  const response = await axiosClient.delete(`${BASE_URL}/${groupId}`);
  return response.data;
};
