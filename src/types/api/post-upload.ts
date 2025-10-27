export interface PostMediaUploadUrl {
  uploadUrl: string;
  fileKey: string;
  cdnUrl: string;
  expiresAt: string;
  fileType: string;
}

export interface GeneratePostMediaUploadUrlsResponse {
  generatePostMediaUploadUrls: {
    success: boolean;
    message: string;
    uploadUrls: PostMediaUploadUrl[];
  };
}

export interface CreatePostInput {
  campaignId: string;
  title: string;
  content: string;
  mediaFileKeys?: string[];
}

export interface CreatePostResponse {
  createPost: {
    success: boolean;
    message: string;
    post: {
      id: string;
      campaignId: string;
      createdBy: string;
      title: string;
      content: string;
      media: string;
      likeCount: number;
      commentCount: number;
      isActive: boolean;
      created_at: string;
    };
  };
}
