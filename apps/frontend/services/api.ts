import { API_CONFIG, buildApiUrl } from "../constants/api";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = buildApiUrl(endpoint);

      // 创建 AbortController 用于超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        API_CONFIG.TIMEOUT
      );

      const config: RequestInit = {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      clearTimeout(timeoutId); // 清除超时定时器
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Auth endpoints
  async sendVerificationCode(phoneNumber: string): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.AUTH.SEND_CODE, {
      method: "POST",
      body: JSON.stringify({ phone: phoneNumber }), // 修复字段名：phoneNumber -> phone
    });
  }

  async login(
    phoneNumber: string,
    verificationCode: string
  ): Promise<ApiResponse<{ token: string; user: any }>> {
    return this.request(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify({ phone: phoneNumber, verificationCode }), // 修复字段名：phoneNumber -> phone
    });
  }

  // Punch record endpoints
  async createPunchRecord(data: any): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.PUNCH_RECORD.CREATE, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getPunchRecordsByUser(userId: string): Promise<ApiResponse<any[]>> {
    // 验证用户ID格式
    if (!userId || isNaN(parseInt(userId))) {
      return {
        success: false,
        error: "用户ID格式无效",
      };
    }

    const response = await this.request<any>(
      `${API_CONFIG.ENDPOINTS.PUNCH_RECORD.GET_BY_USER}/${userId}`,
      {
        method: "GET",
      }
    );

    // 统一数据结构：提取嵌套的 data 字段
    if (response.success && response.data && response.data.data) {
      return {
        success: true,
        data: response.data.data, // 直接返回记录数组
        message: response.data.message,
      };
    }

    return {
      success: false,
      error: "数据格式错误",
    };
  }

  // Note endpoints
  /**
   * 创建新笔记
   */
  async createNote(data: {
    userId: number;
    note: string;
  }): Promise<ApiResponse> {
    const response = await this.request<any>(API_CONFIG.ENDPOINTS.NOTE.CREATE, {
      method: "POST",
      body: JSON.stringify(data),
    });

    // 统一数据结构
    if (response.success && response.data && response.data.data) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }

    return response;
  }

  /**
   * 获取用户笔记列表
   */
  async getNotesByUser(userId: string): Promise<ApiResponse<any[]>> {
    // 验证用户ID格式
    if (!userId || isNaN(parseInt(userId))) {
      return {
        success: false,
        error: "用户ID格式无效",
      };
    }

    const response = await this.request<any>(
      `${API_CONFIG.ENDPOINTS.NOTE.GET_BY_USER}/${userId}`,
      {
        method: "GET",
      }
    );

    // 统一数据结构：提取嵌套的 data 字段
    if (response.success && response.data && response.data.data) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }

    return {
      success: false,
      error: "数据格式错误",
    };
  }

  /**
   * 获取单个笔记详情
   */
  async getNoteById(noteId: string, userId: string): Promise<ApiResponse> {
    const response = await this.request<any>(
      `${API_CONFIG.ENDPOINTS.NOTE.GET_ONE}/${noteId}/user/${userId}`,
      {
        method: "GET",
      }
    );

    // 统一数据结构
    if (response.success && response.data && response.data.data) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }

    return response;
  }

  /**
   * 更新笔记
   */
  async updateNote(
    noteId: string,
    userId: string,
    data: { note: string }
  ): Promise<ApiResponse> {
    const response = await this.request<any>(
      `${API_CONFIG.ENDPOINTS.NOTE.UPDATE}/${noteId}/user/${userId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );

    // 统一数据结构
    if (response.success && response.data && response.data.data) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }

    return response;
  }

  /**
   * 删除笔记
   */
  async deleteNote(noteId: string, userId: string): Promise<ApiResponse> {
    const response = await this.request<any>(
      `${API_CONFIG.ENDPOINTS.NOTE.DELETE}/${noteId}/user/${userId}`,
      {
        method: "DELETE",
      }
    );

    // 统一数据结构
    if (response.success && response.data && response.data.data) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }

    return response;
  }

  /**
   * 获取用户今天的笔记
   */
  async getTodayNote(userId: string): Promise<ApiResponse> {
    // 验证用户ID格式
    if (!userId || isNaN(parseInt(userId))) {
      return {
        success: false,
        error: "用户ID格式无效",
      };
    }

    const response = await this.request<any>(
      `${API_CONFIG.ENDPOINTS.NOTE.GET_TODAY}/${userId}`,
      {
        method: "GET",
      }
    );

    // 统一数据结构
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.data, // 可能为null如果今天没有笔记
        message: response.data.message,
      };
    }

    return response;
  }

  /**
   * 保存今天的笔记（每天一条记录）
   */
  async saveTodayNote(data: {
    userId: number;
    note: string;
  }): Promise<ApiResponse> {
    const response = await this.request<any>(
      API_CONFIG.ENDPOINTS.NOTE.SAVE_TODAY,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    // 统一数据结构
    if (response.success && response.data && response.data.data) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }

    return response;
  }

  /**
   * 实时保存笔记（创建或更新）
   * @deprecated 建议使用 saveTodayNote 实现每天一条笔记的逻辑
   */
  async saveNote(data: {
    userId: number;
    note: string;
    noteId?: number;
  }): Promise<ApiResponse> {
    const response = await this.request<any>(API_CONFIG.ENDPOINTS.NOTE.SAVE, {
      method: "POST",
      body: JSON.stringify(data),
    });

    // 统一数据结构
    if (response.success && response.data && response.data.data) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }

    return response;
  }

  /**
   * 获取笔记统计信息
   */
  async getNoteStats(userId: string): Promise<ApiResponse> {
    const response = await this.request<any>(
      `${API_CONFIG.ENDPOINTS.NOTE.STATS}/${userId}`,
      {
        method: "GET",
      }
    );

    // 统一数据结构
    if (response.success && response.data && response.data.data) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }

    return response;
  }
}

export const apiService = new ApiService();
