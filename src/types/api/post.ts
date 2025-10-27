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
  createdAt?: string;
}

export interface GetPostResponse {
  post: Post[];
}
