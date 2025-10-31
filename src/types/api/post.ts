export enum PostSortOrder {
  NEWEST_FIRST = "NEWEST_FIRST",
  OLDEST_FIRST = "OLDEST_FIRST",
  MOST_LIKED = "MOST_LIKED",
  MOST_COMMENTED = "MOST_COMMENTED"
}

export interface Post {
  id: string;
  campaignId: string;
  title: string;
  content: string;
  media?: string;
  creator: {
    id: string;
    full_name: string;
  };
  likeCount: number;
  commentCount: number;
  isLikedByMe: boolean;
  created_at?: string;
}

export interface GetPostResponse {
  postsByCampaign: Post[];
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  media?: string;
}

export interface UpdatePostResponse {
  updatePost: {
    success: boolean;
    message: string;
    post: {
      id: string;
      title: string;
      content: string;
      media?: string;
      updated_at: string;
    };
  };
}

export interface DeletePostResponse {
  deletePost: {
    success: boolean;
    message: string;
  };
}
