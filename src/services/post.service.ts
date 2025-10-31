import { GET_CAMPAIGN_POSTS } from "@/graphql/query/post/get-all-posts";
import { GET_POST_LIKES } from "@/graphql/query/post/get-post-likes";
import { GET_COMMENTS } from "@/graphql/query/post/get-comments";
import { GENERATE_POST_MEDIA_UPLOAD_URLS } from "@/graphql/mutations/post/generate-post-media-upload-urls";
import { CREATE_POST } from "@/graphql/mutations/post/create-post";
import { UPDATE_POST } from "@/graphql/mutations/post/update-post";
import { DELETE_POST } from "@/graphql/mutations/post/delete-post";
import { LIKE_POST } from "@/graphql/mutations/post/like-post";
import { UNLIKE_POST } from "@/graphql/mutations/post/unlike-post";
import { CREATE_COMMENT } from "@/graphql/mutations/post/create-comment";
import { UPDATE_COMMENT } from "@/graphql/mutations/post/update-comment";
import { DELETE_COMMENT } from "@/graphql/mutations/post/delete-comment";
import { REPLY_COMMENT } from "@/graphql/mutations/post/reply-comment";
import { 
  GetPostResponse, 
  Post, 
  PostSortOrder, 
  UpdatePostInput, 
  UpdatePostResponse, 
  DeletePostResponse 
} from "@/types/api/post";
import {
  GeneratePostMediaUploadUrlsResponse,
  CreatePostInput,
  CreatePostResponse,
  PostMediaUploadUrl,
} from "@/types/api/post-upload";
import {
  LikePostResponse,
  UnlikePostResponse,
  GetPostLikesResponse,
  PostLike,
  Comment,
  CreateCommentInput,
  CreateCommentResponse,
  UpdateCommentInput,
  UpdateCommentResponse,
  DeleteCommentResponse,
  GetCommentsResponse,
} from "@/types/api/post-interaction";
import client from "@/lib/apollo-client";

// Helper: map MIME → extension
function toExtFromMime(mime: string): string {
  const type = mime.toLowerCase();
  if (type.includes("jpeg") || type.includes("jpg")) return "jpeg";
  if (type.includes("png")) return "png";
  if (type.includes("webp")) return "webp";
  if (type.includes("gif")) return "gif";
  return "jpeg";
}

export const postService = {
  /**
   * Get all posts for a specific campaign
   */
  async getPostsByCampaignId(
    campaignId: string,
    sortBy?: PostSortOrder,
    limit?: number,
    offset?: number
  ): Promise<Post[]> {
    try {
      const { data } = await client.query<GetPostResponse>({
        query: GET_CAMPAIGN_POSTS,
        variables: {
          campaignId,
          sortBy,
          limit,
          offset
        },
        fetchPolicy: "network-only",
      });

      return data?.postsByCampaign || [];
    } catch (error) {
      console.error("Error fetching campaign posts:", error);
      throw error;
    }
  },

  /**
   * Generate upload URLs for post media files
   */
  async generateMediaUploadUrls(
    files: File[]
  ): Promise<PostMediaUploadUrl[]> {
    try {
      const fileTypes = files.map((file) => toExtFromMime(file.type));

      const { data } = await client.mutate<GeneratePostMediaUploadUrlsResponse>({
        mutation: GENERATE_POST_MEDIA_UPLOAD_URLS,
        variables: {
          input: {
            fileCount: files.length,
            fileTypes,
          },
        },
        fetchPolicy: "no-cache",
      });

      const uploadUrls = data?.generatePostMediaUploadUrls?.uploadUrls;
      if (!uploadUrls || uploadUrls.length === 0) {
        throw new Error("Không lấy được upload URLs từ server.");
      }

      return uploadUrls;
    } catch (error) {
      console.error("Error generating upload URLs:", error);
      throw error;
    }
  },

  /**
   * Upload a file to S3 using the pre-signed URL
   */
  async uploadFileToS3(file: File, uploadUrl: string): Promise<void> {
    try {
      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type || "image/jpeg",
          "x-amz-acl": "public-read",
        },
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText} — ${errorText}`
        );
      }
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      throw error;
    }
  },

  /**
   * Upload multiple media files for a post
   */
  async uploadPostMedia(files: File[]): Promise<string[]> {
    try {
      // Step 1: Generate upload URLs
      const uploadUrls = await this.generateMediaUploadUrls(files);

      // Step 2: Upload each file to S3
      await Promise.all(
        files.map((file, index) =>
          this.uploadFileToS3(file, uploadUrls[index].uploadUrl)
        )
      );

      // Step 3: Return file keys
      return uploadUrls.map((url) => url.fileKey);
    } catch (error) {
      console.error("Error uploading post media:", error);
      throw error;
    }
  },

  /**
   * Create a new post
   */
  async createPost(input: CreatePostInput): Promise<Post> {
    try {
      const { data } = await client.mutate<CreatePostResponse>({
        mutation: CREATE_POST,
        variables: { input },
        fetchPolicy: "no-cache",
      });

      const post = data?.createPost?.post;
      if (!post) {
        throw new Error(
          data?.createPost?.message || "Không thể tạo bài viết."
        );
      }

      return {
        id: post.id,
        campaignId: post.campaignId,
        title: post.title,
        content: post.content,
        media: post.media,
        creator: {
          id: post.createdBy,
          full_name: "",
        },
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        isLikedByMe: false,
        created_at: post.created_at,
      };
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  /**
   * Like a post
   */
  async likePost(postId: string): Promise<{ isLiked: boolean; likeCount: number }> {
    try {
      const { data } = await client.mutate<LikePostResponse>({
        mutation: LIKE_POST,
        variables: { postId },
        fetchPolicy: "no-cache",
      });

      if (!data?.likePost?.success) {
        throw new Error("Không thể thích bài viết");
      }

      return {
        isLiked: data.likePost.isLiked,
        likeCount: data.likePost.likeCount,
      };
    } catch (error) {
      console.error("Error liking post:", error);
      throw error;
    }
  },

  /**
   * Unlike a post
   */
  async unlikePost(postId: string): Promise<{ isLiked: boolean; likeCount: number }> {
    try {
      const { data } = await client.mutate<UnlikePostResponse>({
        mutation: UNLIKE_POST,
        variables: { postId },
        fetchPolicy: "no-cache",
      });

      if (!data?.unlikePost?.success) {
        throw new Error("Không thể bỏ thích bài viết");
      }

      return {
        isLiked: data.unlikePost.isLiked,
        likeCount: data.unlikePost.likeCount,
      };
    } catch (error) {
      console.error("Error unliking post:", error);
      throw error;
    }
  },

  /**
   * Get users who liked a post
   */
  async getPostLikes(
    postId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<PostLike[]> {
    try {
      const { data } = await client.query<GetPostLikesResponse>({
        query: GET_POST_LIKES,
        variables: { postId, limit, offset },
        fetchPolicy: "network-only",
      });

      return data?.postLikes || [];
    } catch (error) {
      console.error("Error fetching post likes:", error);
      throw error;
    }
  },

  /**
   * Get comments for a post (tree structure)
   */
  async getComments(postId: string): Promise<Comment[]> {
    try {
      const { data } = await client.query<GetCommentsResponse>({
        query: GET_COMMENTS,
        variables: { postId },
        fetchPolicy: "network-only",
      });

      return data?.postCommentsTree || [];
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },

  /**
   * Create a comment on a post
   */
  async createComment(input: CreateCommentInput): Promise<Comment> {
    try {
      const { data } = await client.mutate<CreateCommentResponse>({
        mutation: CREATE_COMMENT,
        variables: { input },
        fetchPolicy: "no-cache",
      });

      const comment = data?.createComment?.comment;
      if (!comment) {
        throw new Error("Không thể tạo bình luận");
      }

      return comment;
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  },

  /**
   * Reply to a comment
   */
  async replyComment(input: CreateCommentInput): Promise<Comment> {
    try {
      const { data } = await client.mutate<CreateCommentResponse>({
        mutation: REPLY_COMMENT,
        variables: { input },
        fetchPolicy: "no-cache",
      });

      const comment = data?.createComment?.comment;
      if (!comment) {
        throw new Error("Không thể trả lời bình luận");
      }

      return comment;
    } catch (error) {
      console.error("Error replying to comment:", error);
      throw error;
    }
  },

  /**
   * Update a comment
   */
  async updateComment(
    commentId: string,
    input: UpdateCommentInput
  ): Promise<{ id: string; content: string; updated_at: string }> {
    try {
      const { data } = await client.mutate<UpdateCommentResponse>({
        mutation: UPDATE_COMMENT,
        variables: { commentId, input },
        fetchPolicy: "no-cache",
      });

      if (!data?.updateComment?.success) {
        throw new Error(
          data?.updateComment?.message || "Không thể cập nhật bình luận"
        );
      }

      return data.updateComment.comment;
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  },

  /**
   * Delete a comment
   */
  async deleteComment(commentId: string): Promise<boolean> {
    try {
      const { data } = await client.mutate<DeleteCommentResponse>({
        mutation: DELETE_COMMENT,
        variables: { commentId },
        fetchPolicy: "no-cache",
      });

      if (!data?.deleteComment?.success) {
        throw new Error(
          data?.deleteComment?.message || "Không thể xóa bình luận"
        );
      }

      return true;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },

  /**
   * Update a post
   */
  async updatePost(id: string, input: UpdatePostInput): Promise<Post> {
    try {
      const { data } = await client.mutate<UpdatePostResponse>({
        mutation: UPDATE_POST,
        variables: { id, input },
        fetchPolicy: "no-cache",
      });

      if (!data?.updatePost?.success) {
        throw new Error(
          data?.updatePost?.message || "Không thể cập nhật bài viết"
        );
      }

      const updatedPost = data.updatePost.post;
      return {
        id: updatedPost.id,
        campaignId: "", // Will be filled by the calling component
        title: updatedPost.title,
        content: updatedPost.content,
        media: updatedPost.media,
        creator: {
          id: "",
          full_name: "",
        },
        likeCount: 0,
        commentCount: 0,
        isLikedByMe: false,
        created_at: updatedPost.updated_at,
      };
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  },

  /**
   * Delete a post
   */
  async deletePost(id: string): Promise<boolean> {
    try {
      const { data } = await client.mutate<DeletePostResponse>({
        mutation: DELETE_POST,
        variables: { id },
        fetchPolicy: "no-cache",
      });

      if (!data?.deletePost?.success) {
        throw new Error(
          data?.deletePost?.message || "Không thể xóa bài viết"
        );
      }

      return true;
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  },
}

