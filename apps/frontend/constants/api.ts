// API Configuration
export const API_CONFIG = {
  // Backend API base URL
  BASE_URL: __DEV__
    ? "http://192.168.1.14:3000" // Development - backend server (use local IP for mobile testing)
    : "https://your-backend-domain.com", // Production - replace with your actual backend URL

  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/user/login",
      SEND_CODE: "/user/send-verification-code",
    },
    PUNCH_RECORD: {
      CREATE: "/punch-record",
      GET_BY_USER: "/punch-record/user", // GET /punch-record/user/:userId
    },
    NOTE: {
      CREATE: "/note",
      GET_BY_USER: "/note/user", // GET /note/user/:userId
      GET_ONE: "/note", // GET /note/:id/user/:userId
      UPDATE: "/note", // PUT /note/:id/user/:userId
      DELETE: "/note", // DELETE /note/:id/user/:userId
      SAVE: "/note/save", // POST /note/save (实时保存)
      SAVE_TODAY: "/note/save-today", // POST /note/save-today (每天一条笔记)
      GET_TODAY: "/note/today/user", // GET /note/today/user/:userId
      STATS: "/note/stats/user", // GET /note/stats/user/:userId
    },
  },

  // Request timeout
  TIMEOUT: 10000,
};

// Helper function to build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
