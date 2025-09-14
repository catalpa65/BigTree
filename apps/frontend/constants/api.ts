// API Configuration
export const API_CONFIG = {
  // Backend API base URL
  BASE_URL: __DEV__
    ? "http://localhost:3000" // Development - backend server
    : "https://your-backend-domain.com", // Production - replace with your actual backend URL

  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/user/login",
      SEND_CODE: "/user/send-verification-code",
    },
    PUNCH_RECORD: {
      CREATE: "/punch-record",
      GET_ALL: "/punch-record",
    },
  },

  // Request timeout
  TIMEOUT: 10000,
};

// Helper function to build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
