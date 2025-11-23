"use client";

import { useState, useRef, useEffect } from "react";
import { Comment } from "@/types/api/post-interaction";
import { postService } from "@/services/post.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Reply, Loader2 } from "lucide-react";
import { LoginRequiredDialog } from "@/components/shared/login-required-dialog";
import { useAuthGuard } from "@/hooks/use-auth-guard";

interface CommentItemProps {
  comment: Comment;
  postId: string;
  currentUserId?: string;
  onDelete: (commentId: string) => void;
  onUpdate: (commentId: string, content: string) => void;
  onReplyAdded: (parentId: string, reply: Comment) => void;
  isReply?: boolean;
}

export function CommentItem({
  comment,
  postId,
  currentUserId,
  onDelete,
  onUpdate,
  onReplyAdded,
  isReply = false,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [showReplies, setShowReplies] = useState(comment.replies && comment.replies.length > 0);
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Auth guard for login required actions
  const { isLoginDialogOpen, requireAuth, closeLoginDialog } = useAuthGuard();

  // Auto-focus reply textarea when replying
  useEffect(() => {
    if (isReplying && replyTextareaRef.current) {
      replyTextareaRef.current.focus();
    }
  }, [isReplying]);

  // Check if current user owns this comment
  const isOwner = currentUserId && (currentUserId === comment.userId);

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      toast.error("Nội dung không được để trống");
      return;
    }

    try {
      await onUpdate(comment.id, editContent.trim());
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitReply = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!replyContent.trim()) {
      toast.error("Vui lòng nhập nội dung trả lời");
      return;
    }

    setIsSubmittingReply(true);
    try {
      const reply = await postService.replyComment({
        postId,
        content: replyContent.trim(),
        parentCommentId: comment.id,
      });

      onReplyAdded(comment.id, reply);
      setReplyContent("");
      setIsReplying(false);
      setShowReplies(true);
      toast.success("Đã trả lời bình luận");
    } catch (error) {
      console.error("Error replying to comment:", error);
      toast.error("Không thể trả lời bình luận");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleNestedReplyAdded = (parentId: string, reply: Comment) => {
    // Pass the nested reply up to the parent component
    onReplyAdded(parentId, reply);
  };

  return (
    <div className={isReply ? "ml-6 mt-3 pl-4 border-l-2 border-gray-100" : ""}>
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
          U
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="font-medium text-sm text-gray-900">
                {comment.user?.full_name || "User"}
              </div>
              {comment.created_at && (
                <div className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleString("vi-VN")}
                </div>
              )}
            </div>

            {isOwner && !isEditing && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(comment.id)}
                    className="text-red-600"
                  >
                    Xóa
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2 space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[60px]"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveEdit} className="btn-color">
                  Lưu
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                >
                  Hủy
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-1 text-sm text-gray-700 whitespace-pre-wrap break-words">
              {comment.content}
            </div>
          )}

          {!isEditing && (
            <div className="mt-2 flex items-center gap-4 text-xs">
              <button
                onClick={() => requireAuth(() => setIsReplying(!isReplying))}
                className="text-gray-600 hover:text-blue-600 flex items-center gap-1"
              >
                <Reply className="w-3 h-3" />
                {isReply ? "Phản hồi" : "Trả lời"}
              </button>

              {comment.replies && comment.replies.length > 0 && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {showReplies ? "Ẩn" : "Xem"} {comment.replies.length} câu trả lời
                </button>
              )}
            </div>
          )}

          {isReplying && (
            <form onSubmit={handleSubmitReply} className="mt-3 flex gap-2">
              <Textarea
                ref={replyTextareaRef}
                placeholder="Viết câu trả lời..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="flex-1 min-h-[60px]"
                disabled={isSubmittingReply}
              />
              <div className="flex flex-col gap-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmittingReply || !replyContent.trim()}
                >
                  {isSubmittingReply ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    "Gửi"
                  )}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsReplying(false);
                    setReplyContent("");
                  }}
                  disabled={isSubmittingReply}
                >
                  Hủy
                </Button>
              </div>
            </form>
          )}

          {showReplies && comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.slice(0, 1).map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply as Comment}
                  postId={postId}
                  currentUserId={currentUserId}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  onReplyAdded={handleNestedReplyAdded}
                  isReply={true}
                />
              ))}
              {comment.replies.length > 1 && (
                <button
                  onClick={() => setShowReplies(true)}
                  className="text-xs text-gray-600 hover:text-blue-600 ml-6"
                >
                  Xem thêm {comment.replies.length - 1} câu trả lời
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Login Required Dialog */}
      <LoginRequiredDialog
        isOpen={isLoginDialogOpen}
        onClose={closeLoginDialog}
        title="Đăng nhập để trả lời"
        description="Bạn cần đăng nhập để có thể trả lời bình luận. Vui lòng đăng nhập để tiếp tục."
        actionText="Đăng nhập ngay"
      />
    </div>
  );
}
