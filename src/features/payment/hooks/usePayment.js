import { useState, useCallback } from 'react';
import { message } from 'antd';
import { getAvailablePlans, getMyStorage, createCheckout, getPaymentStatus } from '../api/payment.api';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [storageData, setStorageData] = useState(null);

  // Lấy dữ liệu gói và dung lượng
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [storageRes, plansRes] = await Promise.all([
        getMyStorage(),
        getAvailablePlans()
      ]);
      
      if (storageRes?.code === 1000) {
        setStorageData(storageRes.result);
      }
      
      if (plansRes?.code === 1000) {
        setPlans(plansRes.result);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu payment:", error);
      message.error("Không thể tải thông tin gói cước. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Xử lý tạo thanh toán
  const handleCheckout = async (planId) => {
    try {
      setLoading(true);
      // Generate Idempotency-Key
      const idempotencyKey = crypto.randomUUID();
      
      const res = await createCheckout(planId, idempotencyKey);
      
      if (res?.code === 1000 && res.result) {
        const { transactionId, checkoutUrl } = res.result;
        
        // Lưu transactionId để màn success có thể polling check status
        localStorage.setItem('latestPaymentTransactionId', transactionId);
        
        // Redirect user sang trang PayOS
        window.location.href = checkoutUrl;
      } else {
        // Handle lỗi logic business từ API (ví dụ 1501, 1508)
        message.error(res?.message || "Không thể tạo liên kết thanh toán. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi tạo thanh toán:", error);
      const errorCode = error.response?.data?.code;
      const errorMsg = error.response?.data?.message;
      
      if (errorCode === 1503) {
        message.error("Giao dịch đang được xử lý, vui lòng không nhấn nhiều lần.");
      } else if (errorCode === 1508) {
        message.warning("Gói này thấp hơn hoặc bằng dung lượng hiện tại của bạn.");
      } else {
        message.error(errorMsg || "Lỗi kết nối đến cổng thanh toán. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Polling kết quả ở màn hình Success
  const pollStatus = async (transactionId, maxAttempts = 20) => {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const res = await getPaymentStatus(transactionId);
        const status = res?.result;
        
        if (status === 'SUCCESS' || status === 'FAILED') {
          return status;
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái thanh toán:", error);
        // Có thể retry nếu lỗi mạng thay vì break ngay
      }
      
      // Chờ 3 giây trước khi poll lại
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    return 'PENDING';
  };

  // Helper check status 1 lần
  const checkSingleStatus = async (transactionId) => {
    try {
      const res = await getPaymentStatus(transactionId);
      return res?.result || 'UNKNOWN';
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái thanh toán:", error);
      return 'UNKNOWN';
    }
  };

  return {
    loading,
    plans,
    storageData,
    fetchData,
    handleCheckout,
    pollStatus,
    checkSingleStatus
  };
};
