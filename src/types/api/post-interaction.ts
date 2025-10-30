// Like/Unlike Types
export interface LikePostResponse {
  likePost: {
    success: boolean;
    isLiked: boolean;
    likeCount: number;
  };
}

export interface UnlikePostResponse {
  unlikePost: {
    success: boolean;
    isLiked: boolean;
    likeCount: number;
  };
}

export interface PostLike {
  id: string;
  user: {
    id: string;
    full_name: string;
  };
}

export interface GetPostLikesResponse {
  postLikes: PostLike[];
}

// Comment Types
export interface Comment {
  id: string;
  postId: string;
  userId?: string;
  user?: {
    full_name: string;
  };
  content: string;
  parentCommentId?: string | null;
  depth?: number;
  created_at?: string;
  updated_at?: string;
  replies?: CommentReply[];
}

export interface CommentReply {
  id: string;
  content: string;
  userId?: string;
  user?: {
    full_name: string;
  };
}

export interface CreateCommentInput {
  postId: string;
  content: string;
  parentCommentId?: string | null;
}

export interface CreateCommentResponse {
  createComment: {
    success?: boolean;
    message?: string;
    comment: Comment;
  };
}

export interface UpdateCommentInput {
  content: string;
}

export interface UpdateCommentResponse {
  updateComment: {
    success: boolean;
    message: string;
    comment: {
      id: string;
      content: string;
      updated_at: string;
    };
  };
}

export interface DeleteCommentResponse {
  deleteComment: {
    success: boolean;
    message: string;
  };
}

export interface GetCommentsResponse {
  postCommentsTree: Comment[];
}
