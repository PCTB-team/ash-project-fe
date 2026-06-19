import { axiosClient } from '../../../utils/apiClient.js';

const USER_PROFILE_API_URL = 'https://ash-project-be.onrender.com/api/v1/user/profile';

export const profileApi = {
  getProfile: async () => {
    const response = await axiosClient.get(USER_PROFILE_API_URL);
    return response.data;
  },
  
  updateProfile: async (formData) => {
    const response = await axiosClient.put(USER_PROFILE_API_URL, formData, {
      headers: { 'Accept': 'application/json' }
    });
    return response.data;
  }
};
