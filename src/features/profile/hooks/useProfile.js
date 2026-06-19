import { useState, useCallback } from 'react';
import { message } from 'antd';
import { profileApi } from '../api/profile.api.js';

export const useProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState('User');
  const [avatarUrl, setAvatarUrl] = useState('');

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await profileApi.getProfile();
      const resultData = data.result || (data.email ? data : null);

      if ((data.code === 0 || data.code === 1000 || !data.code) && resultData) {
        const mappedData = {
          ...resultData,
          avatarUrl: resultData.avatarUrl || resultData.avatar || ''
        };
        setProfileData(mappedData);
        if (mappedData.fullname) setFullName(mappedData.fullname);
        if (mappedData.avatarUrl) setAvatarUrl(mappedData.avatarUrl);
        return mappedData;
      }
    } catch (error) {
      console.error("Lỗi lấy thông tin hồ sơ:", error);
    } finally {
      setIsLoading(false);
    }
    return null;
  }, []);

  const updateProfile = async (formData) => {
    setIsLoading(true);
    try {
      const data = await profileApi.updateProfile(formData);
      if ((data.code === 0 || data.code === 1000) && data.result) {
        const mappedData = {
          ...data.result,
          avatarUrl: data.result.avatarUrl || data.result.avatar || ''
        };
        setProfileData(mappedData);
        if (mappedData.fullname) setFullName(mappedData.fullname);
        if (mappedData.avatarUrl) setAvatarUrl(mappedData.avatarUrl);
        return { success: true, data: mappedData };
      } else if (!data.code) {
        return { success: true, data: profileData }; // Fallback
      }
      return { success: false, message: data.message || 'Cập nhật thất bại' };
    } catch (error) {
      console.error("Lỗi lưu hồ sơ:", error);
      return { success: false, message: error.response?.data?.message || error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profileData,
    fullName,
    avatarUrl,
    isLoading,
    fetchProfile,
    updateProfile,
    setAvatarUrl,
    setFullName
  };
};
