(function (global) {
  const API_BASE_URL = global.location.protocol === 'file:' ? 'http://localhost:3000/api' : '/api';
  global.AC_API_CONFIG = Object.freeze({
    baseUrl: API_BASE_URL,
    endpoints: Object.freeze({
      health: '/health',
      register: '/auth/register',
      login: '/auth/login',
      resetPassword: '/auth/reset-password',
      customers: '/customers',
      products: '/products',
      orders: '/orders',
      quotations: '/quotations'
    })
  });
})(window);
