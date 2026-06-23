import { axiosClient } from '../../../utils/apiClient';

/**
 * Lấy danh sách các gói bộ nhớ có thể nâng cấp.
 * Các gói trả về có dung lượng lớn hơn dung lượng hiện tại của user.
 */
export const getAvailablePlans = async () => {
  const response = await axiosClient.get('/api/v1/user/available-plans');
  return response.data;
};

/**
 * Lấy thông tin dung lượng hiện tại của người dùng.
 * Trả về usedStorage, maxStorage, remainingStorage, usagePercent.
 */
export const getMyStorage = async () => {
  const response = await axiosClient.get('/api/v1/user/storage');
  return response.data;
};

/**
 * Tạo phiên thanh toán với PayOS cho một gói cụ thể.
 * Yêu cầu Idempotency-Key để tránh duplicate transaction.
 * @param {string} planId - ID của gói muốn mua
 * @param {string} idempotencyKey - UUID tạo từ FE
 */
export const createCheckout = async (planId, idempotencyKey) => {
  const response = await axiosClient.post(
    '/api/v1/payment/checkout',
    null,
    {
      params: { planId },
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    }
  );
  return response.data;
};

/**
 * Kiểm tra trạng thái của một giao dịch theo transactionId.
 * @param {string} transactionId - ID của giao dịch cần kiểm tra (nhận được khi tạo checkout)
 */
export const getPaymentStatus = async (transactionId) => {
  const response = await axiosClient.get(`/api/v1/payment/status/${transactionId}`);
  return response.data;
};
