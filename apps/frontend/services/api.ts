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
      const config: RequestInit = {
        timeout: API_CONFIG.TIMEOUT,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
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
      console.error("API request failed:", error);
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

  async getPunchRecords(): Promise<ApiResponse<any[]>> {
    return this.request(API_CONFIG.ENDPOINTS.PUNCH_RECORD.GET_ALL, {
      method: "GET",
    });
  }
}

export const apiService = new ApiService();
