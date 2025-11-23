"use client";

import { useState, useEffect, useCallback } from "react";
import { postService } from "@/services/post.service";
import { Comment, CommentReply } from "@/types/api/post-interaction";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { CommentItem } from "./comment-item";
import { LoginRequiredDialog } from "@/components/shared/login-required-dialog";
import { useAuthGuard } from "@/hooks/use-auth-guard";

interface CommentSectionProps {
  postId: string;
  currentUserId?: string;
  onCommentAdded?: () => void;
  onCommentDeleted?: () => void;
}

export function CommentSection({
  postId,
  currentUserId,
  onCommentAdded,
  onCommentDeleted,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(3);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Auth guard for login required actions
  const { isLoginDialogOpen, requireAuth, closeLoginDialog } = useAuthGuard();

  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await postService.getComments(postId);
      setComments(data);
    } catch (error) {
      console.error("Error loading comments:", error);
      toast.error("Không thể tải bình luận");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleShowMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayLimit((prev) => prev + 3);
      setLoadingMore(false);
    }, 300);
  };

  const handleSubmitComment = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    // Check if user is authenticated before allowing comment submission
    const canProceed = requireAuth(() => {
      if (!newComment.trim()) {
        toast.error("Vui lòng nhập nội dung bình luận");
        return;
      }
      submitComment();
    });

    if (!canProceed) return;
  };

  const submitComment = async () => {
    setIsSubmitting(true);
    try {
      const comment = await postService.createComment({
        postId,
        content: newComment.trim(),
        parentCommentId: null,
      });

      const updatedComments = [comment, ...comments];
      setComments(updatedComments);
      setNewComment("");
      onCommentAdded?.();
      toast.success("Đã thêm bình luận");
    } catch (error) {
      console.error("Error creating comment:", error);
      toast.error("Không thể thêm bình luận");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await postService.deleteComment(commentId);

      const removeCommentFromTree = (comment: Comment): Comment | null => {
        if (comment.id === commentId) {
          return null; // Mark for removal
        }

        if (comment.replies && comment.replies.length > 0) {
          const filteredReplies = comment.replies
            .map((r) => removeCommentFromTree(r as Comment))
            .filter((r): r is Comment => r !== null) as CommentReply[];

          return {
            ...comment,
            replies: filteredReplies,
          };
        }

        return comment;
      };

      const updatedComments = comments
        .map(removeCommentFromTree)
        .filter((c): c is Comment => c !== null);

      setComments(updatedComments);
      onCommentDeleted?.();
      toast.success("Đã xóa bình luận");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Không thể xóa bình luận");
    }
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    try {
      await postService.updateComment(commentId, { content });

      const updateCommentInTree = (comment: Comment): Comment => {
        if (comment.id === commentId) {
          return { ...comment, content };
        }

        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: comment.replies.map((r) => updateCommentInTree(r as Comment)) as CommentReply[],
          };
        }

        return comment;
      };

      setComments(comments.map(updateCommentInTree));
      toast.success("Đã cập nhật bình luận");
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Không thể cập nhật bình luận");
    }
  };

  const handleReplyAdded = (parentId: string, reply: Comment) => {
    const addReplyToComment = (comment: Comment): Comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply as CommentReply],
        };
      }

      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: comment.replies.map((r) => addReplyToComment(r as Comment)) as CommentReply[],
        };
      }

      return comment;
    };

    setComments(comments.map(addReplyToComment));
    onCommentAdded?.();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Comment Input */}
      <form onSubmit={handleSubmitComment} className="flex gap-2">
        <Textarea
          placeholder="Viết bình luận..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 min-h-[80px]"
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          disabled={isSubmitting || !newComment.trim()}
          className="self-end btn-color"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 py-4">Chưa có bình luận nào</p>
        ) : (
          <>
            {comments.slice(0, displayLimit).map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={postId}
                currentUserId={currentUserId}
                onDelete={handleDeleteComment}
                onUpdate={handleUpdateComment}
                onReplyAdded={handleReplyAdded}
              />
            ))}

            {displayLimit < comments.length && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  onClick={handleShowMore}
                  disabled={loadingMore}
                  className="w-full max-w-xs"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Đang tải...
                    </>
                  ) : (
                    `Hiển thị thêm (${comments.length - displayLimit} còn lại)`
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Login Required Dialog */}
      <LoginRequiredDialog
        isOpen={isLoginDialogOpen}
        onClose={closeLoginDialog}
        title="Đăng nhập để bình luận"
        description="Bạn cần đăng nhập để có thể bình luận. Vui lòng đăng nhập để tiếp tục."
        actionText="Đăng nhập ngay"
      />
    </div>
  );
}
