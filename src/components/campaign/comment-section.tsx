"use client";

import { useState, useEffect } from "react";
import { postService } from "@/services/post.service";
import { Comment, CommentReply } from "@/types/api/post-interaction";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { CommentItem } from "./comment-item";

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
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await postService.getComments(postId, null, 50, 0);
      setComments(data);
      setHasMore(data.length > 3);
    } catch (error) {
      console.error("Error loading comments:", error);
      toast.error("Không thể tải bình luận");
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayLimit((prev) => prev + 3);
      setLoadingMore(false);
    }, 300);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận");
      return;
    }

    setIsSubmitting(true);
    try {
      const comment = await postService.createComment({
        postId,
        content: newComment.trim(),
        parentCommentId: null,
      });

      const updatedComments = [comment, ...comments];
      setComments(updatedComments);
      setHasMore(updatedComments.length > 3);
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
      const updatedComments = comments.filter((c) => c.id !== commentId);
      setComments(updatedComments);
      setHasMore(updatedComments.length > 3);
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
      setComments(
        comments.map((c) =>
          c.id === commentId ? { ...c, content } : c
        )
      );
      toast.success("Đã cập nhật bình luận");
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Không thể cập nhật bình luận");
    }
  };

  const handleReplyAdded = (parentId: string, reply: Comment) => {
    setComments(
      comments.map((c) => {
        if (c.id === parentId) {
          return {
            ...c,
            replies: [...(c.replies || []), reply as CommentReply],
          };
        }
        return c;
      })
    );
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
      <div className="flex gap-2">
        <Textarea
          placeholder="Viết bình luận..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 min-h-[80px]"
          disabled={isSubmitting}
        />
        <Button
          onClick={handleSubmitComment}
          disabled={isSubmitting || !newComment.trim()}
          className="self-end"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

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
    </div>
  );
}
