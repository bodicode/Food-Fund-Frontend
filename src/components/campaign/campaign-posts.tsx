import { useQuery } from "@apollo/client/react";
import { GET_CAMPAIGN_POSTS } from "@/graphql/query/post/get-all-posts";
import { Post, GetPostResponse, PostSortOrder } from "@/types/api/post";
import { PostCard } from "./post-card";

interface CampaignPostsProps {
  campaignId: string;
  currentUserId?: string;
}

export function CampaignPosts({ campaignId, currentUserId }: CampaignPostsProps) {
  const { data, loading, error, refetch } = useQuery<GetPostResponse>(GET_CAMPAIGN_POSTS, {
    variables: { 
      campaignId,
      sortBy: PostSortOrder.NEWEST_FIRST,
      limit: 20,
      offset: 0
    },
    fetchPolicy: "network-only",
  });

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border p-6">
        <div className="text-center py-8 text-gray-500">Đang tải bài viết...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border p-6">
        <div className="text-center py-8 text-red-500">
          Lỗi khi tải bài viết: {error.message}
        </div>
      </div>
    );
  }

  // Get posts from the updated field name
  const posts = data?.postsByCampaign || [];

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border p-6">
        <div className="text-center py-8 text-gray-500">Chưa có bài viết nào</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post: Post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          onPostUpdate={() => refetch()}
          onPostDelete={() => refetch()}
        />
      ))}
    </div>
  );
}
