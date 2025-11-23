import { useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { GET_CAMPAIGN_POSTS } from "@/graphql/query/post/get-all-posts";
import { Post, GetPostResponse, PostSortOrder } from "@/types/api/post";
import { PostCard } from "./post-card";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

interface CampaignPostsProps {
  campaignId: string;
  currentUserId?: string;
}

export function CampaignPosts({ campaignId, currentUserId }: CampaignPostsProps) {
  const router = useRouter();

  const { data, loading, error, refetch } = useQuery<GetPostResponse>(GET_CAMPAIGN_POSTS, {
    variables: { 
      campaignId,
      sortBy: PostSortOrder.NEWEST_FIRST,
      limit: 20,
      offset: 0
    },
    fetchPolicy: "network-only",
    skip: !currentUserId, // Skip query if user is not logged in
  });

  // Check if user is logged in
  if (!currentUserId) {
    return (
      <div className="bg-white rounded-2xl border p-6">
        <div className="text-center py-12">
          <LogIn className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Đăng nhập để xem bài viết
          </h3>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            Vui lòng đăng nhập để xem các bài viết và cập nhật từ chiến dịch này.
          </p>
          <Button
            onClick={() => router.push("/login")}
            className="btn-color"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Đăng nhập ngay
          </Button>
        </div>
      </div>
    );
  }

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
