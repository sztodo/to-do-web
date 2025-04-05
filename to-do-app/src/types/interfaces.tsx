export interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string | null;
    isCompleted: boolean;
    tags: string[];
    userId: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Comment {
    id: string;
    content: string;
    taskId: string;
    userId: string;
    username: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<AuthResponse>;
    register: (userData: RegisterData) => Promise<AuthResponse>;
    logout: () => void;
    updateProfile: (userData: Partial<User>) => Promise<AuthResponse>;
    clearError: () => void;
  }
  
  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface RegisterData {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    error?: string;
  }
  
  export interface TaskFormData {
    title: string;
    description: string;
    dueDate: string | null;
    tags: string[];
  }
  
  export interface FilterOptions {
    status?: string;
    dueBefore?: string;
    tag?: string;
    sortBy?: string;
    order?: string;
  }