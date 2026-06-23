import { axiosClient } from '../../../utils/apiClient';

const BASE_URL = 'https://ash-project-be.onrender.com/api/v1/notifications';

export const getNotifications = async ({ read, page = 0, size = 20 } = {}) => {
  const response = await axiosClient.get(BASE_URL, {
    params: {
      ...(read !== undefined ? { read } : {}),
      page,
      size,
    },
  });

  return response.data.result;
};

export const markNotificationsAsRead = async ({ notificationIds, all = false }) => {
  const response = await axiosClient.put(`${BASE_URL}/read`, {
    ...(all ? { all: true } : { notificationIds }),
  });

  return response.data.result;
};
