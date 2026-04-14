import api from './axios';

/**
 * PhonePe Payment Gateway API Service
 * Handles all payment initiation, status checks, and webhook callbacks
 */

export const phonepeApi = {
  /**
   * Initiate a standard payment
   * POST /api/phonepe/orders/initiate_payment/
   */
  initiatePayment: async (amount, redirectUrl = '', metadata = {}) => {
    const response = await api.post('/phonepe/orders/initiate_payment/', {
      amount,
      redirect_url: redirectUrl,
      udf1: metadata.udf1 || '',
      udf2: metadata.udf2 || '',
      udf3: metadata.udf3 || '',
      udf4: metadata.udf4 || '',
      udf5: metadata.udf5 || '',
    });
    return response.data;
  },

  /**
   * Create SDK order for mobile app integration
   * POST /api/phonepe/orders/create_sdk_order/
   */
  createSdkOrder: async (amount, redirectUrl = '', metadata = {}) => {
    const response = await api.post('/phonepe/orders/create_sdk_order/', {
      amount,
      redirect_url: redirectUrl,
      udf1: metadata.udf1 || '',
      udf2: metadata.udf2 || '',
      udf3: metadata.udf3 || '',
    });
    return response.data;
  },

  /**
   * Check order status
   * POST /api/phonepe/orders/check_status/
   */
  checkOrderStatus: async (merchantOrderId, details = false) => {
    const response = await api.post('/phonepe/orders/check_status/', {
      merchant_order_id: merchantOrderId,
      details,
    });
    return response.data;
  },

  /**
   * Initiate a refund
   * POST /api/phonepe/refunds/initiate_refund/
   */
  initiateRefund: async (merchantOrderId, refundAmount, reason = '') => {
    const response = await api.post('/phonepe/refunds/initiate_refund/', {
      merchant_order_id: merchantOrderId,
      refund_amount: refundAmount,
      reason,
    });
    return response.data;
  },

  /**
   * Check refund status
   * POST /api/phonepe/refunds/check_status/
   */
  checkRefundStatus: async (merchantRefundId) => {
    const response = await api.post('/phonepe/refunds/check_status/', {
      merchant_refund_id: merchantRefundId,
    });
    return response.data;
  },

  /**
   * Get all orders (paginated, filtered by user if not admin)
   * GET /api/phonepe/orders/
   */
  getOrders: async (page = 1, pageSize = 20) => {
    const response = await api.get('/phonepe/orders/', {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  /**
   * Get order details by ID
   * GET /api/phonepe/orders/{id}/
   */
  getOrderDetail: async (orderId) => {
    const response = await api.get(`/phonepe/orders/${orderId}/`);
    return response.data;
  },

  /**
   * Get all refunds (paginated, filtered by user if not admin)
   * GET /api/phonepe/refunds/
   */
  getRefunds: async (page = 1, pageSize = 20) => {
    const response = await api.get('/phonepe/refunds/', {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  /**
   * Get refund details by ID
   * GET /api/phonepe/refunds/{id}/
   */
  getRefundDetail: async (refundId) => {
    const response = await api.get(`/phonepe/refunds/${refundId}/`);
    return response.data;
  },
};
