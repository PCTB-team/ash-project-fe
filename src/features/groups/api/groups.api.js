import { axiosClient } from '../../../utils/apiClient';

const BASE_URL = 'https://ash-project-be.onrender.com/api/v1/groups';

// ─── 1. Get All Groups ───
export const getGroups = async () => {
  const response = await axiosClient.get(BASE_URL);
  return response.data;
};

// ─── 1b. Get My Groups ─── GET /groups/my
export const getMyGroups = async () => {
  const response = await axiosClient.get(`${BASE_URL}/my`);
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

