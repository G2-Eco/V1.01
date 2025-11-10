// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// User Types
export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  lastLogin: string;
  createdAt: string;
}

// Auth Types
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: UserResponse;
}

// Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

// Form Validation Types
export interface FormErrors {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}