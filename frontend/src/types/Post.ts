export interface User {
  _id: string;
  id: string;
  username: string;
  email: string;
}

export interface Post {
  _id: string;
  title: string;
  category: string;
  tags?: string[];
  message: string;
  author: User | string;
  likers: (User | string)[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePostPayload {
  title: string;
  category: string;
  tags?: string[];
  message: string;
}

export interface UpdatePostPayload {
  title?: string;
  category?: string;
  tags?: string[];
  message?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}
