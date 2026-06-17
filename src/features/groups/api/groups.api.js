import { fetchWithAuth } from '../../../utils/apiClient';

const BASE_URL = 'https://ash-project-be.onrender.com/api/v1/groups';

// ─── 1. Get All Groups ───
export const getGroups = async () => {
  const response = await fetchWithAuth(BASE_URL);
  if (!response.ok) throw new Error('Failed to fetch groups');
  return response.json();
};

// ─── 1b. Get My Groups ─── GET /groups/my
export const getMyGroups = async () => {
  const response = await fetchWithAuth(`${BASE_URL}/my`);
  if (!response.ok) throw new Error('Failed to fetch my groups');
  return response.json();
};

// ─── 2. Get Group By ID ───
export const getGroupById = async (groupId) => {
  const response = await fetchWithAuth(`${BASE_URL}/${groupId}`);
  if (!response.ok) throw new Error('Failed to fetch group details');
  return response.json();
};

// ─── 3. Create Group ─── POST /groups
export const createGroup = async (groupData) => {
  const response = await fetchWithAuth(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(groupData),
  });
  if (!response.ok) throw new Error('Failed to create group');
  return response.json();
};

// ─── 4. Group Preview via Invite Token ─── GET /groups/invite/{inviteToken}
export const getGroupPreview = async (inviteToken) => {
  const response = await fetchWithAuth(`${BASE_URL}/invite/${inviteToken}`);
  if (!response.ok) {
    if (response.status === 404) throw new Error('INVITE_NOT_FOUND');
    throw new Error('Failed to preview group');
  }
  return response.json();
};

// ─── 5. Join Group via Invite Token ─── POST /groups/invite/{inviteToken}/join
export const joinGroupViaInvite = async (inviteToken, password) => {
  const response = await fetchWithAuth(`${BASE_URL}/invite/${inviteToken}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!response.ok) {
    if (response.status === 400) throw new Error('WRONG_PASSWORD');
    if (response.status === 404) throw new Error('INVITE_NOT_FOUND');
    if (response.status === 409) throw new Error('ALREADY_MEMBER');
    throw new Error('Failed to join group');
  }
  return response.json();
};

// ─── 6. Group Statistics ─── GET /groups/{groupId}/statistics
export const getGroupStatistics = async (groupId) => {
  const response = await fetchWithAuth(`${BASE_URL}/${groupId}/statistics`);
  if (!response.ok) throw new Error('Failed to fetch statistics');
  return response.json();
};

// ─── 7. Get Group Members ─── GET /groups/{groupId}/members
export const getGroupMembers = async (groupId) => {
  const response = await fetchWithAuth(`${BASE_URL}/${groupId}/members`);
  if (!response.ok) throw new Error('Failed to fetch members');
  return response.json();
};

// ─── 8. Member Count ─── GET /groups/{groupId}/members/count
export const getMemberCount = async (groupId) => {
  const response = await fetchWithAuth(`${BASE_URL}/${groupId}/members/count`);
  if (!response.ok) throw new Error('Failed to fetch member count');
  return response.json();
};

// ─── 9. Regenerate Invite Token ─── PUT /groups/{groupId}/regenerate-invite-token
export const regenerateInviteToken = async (groupId) => {
  const response = await fetchWithAuth(`${BASE_URL}/${groupId}/regenerate-invite-token`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to regenerate invite token');
  return response.json();
};

// ─── 10. Update Upload Permission ─── PUT /groups/{groupId}/members/{memberId}/upload-permission
export const updateUploadPermission = async (groupId, memberId, canUpload) => {
  const response = await fetchWithAuth(`${BASE_URL}/${groupId}/members/${memberId}/upload-permission`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ canUpload }),
  });
  if (!response.ok) throw new Error('Failed to update upload permission');
  return response.json();
};

// ─── 11. Kick Member ─── PUT /groups/{groupId}/members/{memberId}/kick
export const kickMember = async (groupId, memberId) => {
  const response = await fetchWithAuth(`${BASE_URL}/${groupId}/members/${memberId}/kick`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to kick member');
  return response.json();
};

// ─── 12. Upload File ─── POST /groups/{groupId}/files
export const uploadGroupFile = async (groupId, formData) => {
  const response = await fetchWithAuth(`${BASE_URL}/${groupId}/files`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    if (response.status === 413) throw new Error('STORAGE_LIMIT_EXCEEDED');
    throw new Error('Failed to upload file');
  }
  return response.json();
};

// ─── 13. Get Active Files ─── GET /groups/{groupId}/files
export const getGroupFiles = async (groupId) => {
  const response = await fetchWithAuth(`${BASE_URL}/${groupId}/files`);
  if (!response.ok) throw new Error('Failed to fetch files');
  return response.json();
};

// ─── 14. Delete File (Move to Trash) ─── DELETE /groups/{groupId}/files/{fileId}
export const deleteGroupFile = async (groupId, fileId) => {
  const response = await fetchWithAuth(`${BASE_URL}/${groupId}/files/${fileId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete file');
  return response.json();
};

// ─── 15. Get Trash Files ─── GET /groups/{groupId}/trash/files
export const getTrashFiles = async (groupId) => {
  const response = await fetchWithAuth(`${BASE_URL}/${groupId}/trash/files`);
  if (!response.ok) throw new Error('Failed to fetch trash files');
  return response.json();
};

// ─── 16. Restore File ─── PUT /groups/{groupId}/files/{fileId}/restore
export const restoreFile = async (groupId, fileId) => {
  const response = await fetchWithAuth(`${BASE_URL}/${groupId}/files/${fileId}/restore`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to restore file');
  return response.json();
};

