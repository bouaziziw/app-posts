export interface Post {
  _id: string;
  message: string;
  author: string;
  likers: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePostPayload {
  message: string;
  author: string;
}

export interface UpdatePostPayload {
  message?: string;
  author?: string;
}

export interface LikePostPayload {
  userId: string;
}
