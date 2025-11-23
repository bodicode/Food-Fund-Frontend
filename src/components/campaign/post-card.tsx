"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Heart, MessageCircle, MoreVertical, X, ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import { Post } from "@/types/api/post";
import { postService } from "@/services/post.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/shared/rich-text-editor";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { CommentSection } from "./comment-section";
import { LoginRequiredDialog } from "@/components/shared/login-required-dialog";
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog";
import { useAuthGuard } from "@/hooks/use-auth-guard";

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onPostUpdate?: () => void;
  onPostDelete?: () => void;
}

export function PostCard({ post, currentUserId, onPostUpdate, onPostDelete }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLikedByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [isLiking, setIsLiking] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title || "");
  const [editContent, setEditContent] = useState(post.content || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Auth guard for login required actions
  const { isLoginDialogOpen, requireAuth, closeLoginDialog } = useAuthGuard();

  // Check if current user owns this post
  const isOwner = currentUserId === post.creator.id;

  // Parse media JSON string to array
  let mediaUrls: string[] = [];
  if (post.media) {
    try {
      mediaUrls = typeof post.media === "string" ? JSON.parse(post.media) : [post.media];
    } catch {
      mediaUrls = [post.media];
    }
  }

  const handleLikeToggle = async () => {
    if (isLiking) return;

    // Check if user is authenticated before allowing like/unlike
    const canProceed = requireAuth(() => {
      performLikeToggle();
    });

    if (!canProceed) return;
  };

  const performLikeToggle = async () => {
    setIsLiking(true);
    const previousLiked = isLiked;
    const previousCount = likeCount;

    // Optimistic update
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    try {
      if (isLiked) {
        const result = await postService.unlikePost(post.id);
        setIsLiked(result.isLiked);
        setLikeCount(result.likeCount);
      } else {
        const result = await postService.likePost(post.id);
        setIsLiked(result.isLiked);
        setLikeCount(result.likeCount);
      }
    } catch {
      // Revert on error
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      toast.error("Không thể thực hiện thao tác");
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentAdded = () => {
    setCommentCount(commentCount + 1);
  };

  const handleCommentDeleted = () => {
    setCommentCount(Math.max(0, commentCount - 1));
  };

  const handleUpdatePost = async () => {
    if (!editTitle.trim() && !editContent.trim()) {
      toast.error("Vui lòng nhập tiêu đề hoặc nội dung");
      return;
    }

    setIsUpdating(true);
    try {
      await postService.updatePost(post.id, {
        title: editTitle.trim(),
        content: editContent.trim(),
      });
      
      toast.success("Đã cập nhật bài viết");
      setIsEditing(false);
      onPostUpdate?.();
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Không thể cập nhật bài viết");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeletePost = async () => {
    setIsDeleting(true);
    try {
      await postService.deletePost(post.id);
      toast.success("Đã xóa bài viết");
      setIsDeleteDialogOpen(false);
      onPostDelete?.();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Không thể xóa bài viết");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(post.title || "");
    setEditContent(post.content || "");
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % mediaUrls.length);
  }, [mediaUrls.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + mediaUrls.length) % mediaUrls.length);
  }, [mediaUrls.length]);

  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        prevImage();
      } else if (e.key === "ArrowRight") {
        nextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, nextImage, prevImage]);

  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white font-semibold">
            {post.creator.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-800">{post.creator.full_name}</div>
            {post.created_at && (
              <div className="text-xs text-gray-500">
                {new Date(post.created_at).toLocaleDateString("vi-VN")}
              </div>
            )}
          </div>
        </div>

        {isOwner && !isEditing && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteClick} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Title and Content - Edit Mode or Display Mode */}
      {isEditing ? (
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề bài viết
            </label>
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài viết..."
              className="font-semibold text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung bài viết
            </label>
            <RichTextEditor
              value={editContent}
              onChange={setEditContent}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleUpdatePost} 
              disabled={isUpdating}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
            <Button 
              onClick={handleCancelEdit} 
              variant="outline" 
              size="sm"
              disabled={isUpdating}
            >
              Hủy bỏ
            </Button>
          </div>
        </div>
      ) : (
        <>
          {post.title && (
            <h3 className="font-semibold text-lg mb-2 text-gray-800">{post.title}</h3>
          )}

          {post.content && (
            <div
              className="prose prose-sm md:prose-base max-w-none text-gray-700 mb-3"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}
        </>
      )}

      {mediaUrls.length > 0 && (
        <div className="mt-4 mb-4">
          {(() => {
            if (mediaUrls.length === 1) {
              const url = mediaUrls[0];
              return (
                <div className="relative w-full overflow-hidden rounded-xl group cursor-pointer" onClick={() => openLightbox(0)}>
                  <div className="relative aspect-[4/3] sm:aspect-video">
                    {isVideo(url) ? (
                      <video
                        className="w-full h-full object-cover"
                        controls
                        playsInline
                        src={url}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <Image
                        src={url}
                        alt={`${post.title || "Post image"}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 800px"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    )}
                  </div>
                </div>
              );
            }

            if (mediaUrls.length === 2) {
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mediaUrls.map((url, i) => (
                    <div key={i} className="relative overflow-hidden rounded-xl group cursor-pointer" onClick={() => openLightbox(i)}>
                      <div className="relative aspect-[4/3]">
                        {isVideo(url) ? (
                          <video className="w-full h-full object-cover" controls playsInline src={url} onClick={(e) => e.stopPropagation()} />
                        ) : (
                          <Image
                            src={url}
                            alt={`${post.title || "Post image"} ${i + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            }

            if (mediaUrls.length === 3) {
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2 relative overflow-hidden rounded-xl group cursor-pointer" onClick={() => openLightbox(0)}>
                    <div className="relative aspect-[4/3] md:aspect-video">
                      {isVideo(mediaUrls[0]) ? (
                        <video className="w-full h-full object-cover" controls playsInline src={mediaUrls[0]} onClick={(e) => e.stopPropagation()} />
                      ) : (
                        <Image
                          src={mediaUrls[0]}
                          alt={`${post.title || "Post image"} 1`}
                          fill
                          sizes="(max-width: 768px) 100vw, 66vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    {mediaUrls.slice(1).map((url, i) => (
                      <div key={i} className="relative overflow-hidden rounded-xl group cursor-pointer" onClick={() => openLightbox(i + 1)}>
                        <div className="relative aspect-[4/3]">
                          {isVideo(url) ? (
                            <video className="w-full h-full object-cover" controls playsInline src={url} onClick={(e) => e.stopPropagation()} />
                          ) : (
                            <Image
                              src={url}
                              alt={`${post.title || "Post image"} ${i + 2}`}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            // Four or more: show up to 4 images, last tile shows overlay for remaining
            return (
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {mediaUrls.slice(0, 4).map((url, i) => {
                  const remaining = mediaUrls.length - 4;
                  const showOverlay = i === 3 && remaining > 0;
                  return (
                    <div key={i} className="relative overflow-hidden rounded-xl group cursor-pointer" onClick={() => openLightbox(i)}>
                      <div className="relative aspect-[4/3]">
                        {isVideo(url) ? (
                          <video className="w-full h-full object-cover" controls playsInline src={url} onClick={(e) => e.stopPropagation()} />
                        ) : (
                          <Image
                            src={url}
                            alt={`${post.title || "Post image"} ${i + 1}`}
                            fill
                            sizes="(max-width: 768px) 50vw, 400px"
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                        )}
                      </div>
                      {showOverlay && (
                        <div className="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-2xl font-semibold hover:bg-black/70 transition-colors">
                          +{remaining}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 mt-4 pt-4 border-t text-sm">
        <button
          onClick={handleLikeToggle}
          disabled={isLiking}
          className={`flex items-center gap-2 transition-colors ${isLiked
            ? "text-red-600 hover:text-red-700"
            : "text-gray-600 hover:text-red-600"
            }`}
        >
          <Heart
            className={`w-5 h-5 ${isLiked ? "fill-red-600" : ""}`}
          />
          <span className="font-medium">{likeCount}</span>
        </button>

        <div className="flex items-center gap-2 text-gray-600">
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">{commentCount}</span>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-4 pt-4 border-t">
        <CommentSection
          postId={post.id}
          onCommentAdded={handleCommentAdded}
          onCommentDeleted={handleCommentDeleted}
          currentUserId={currentUserId}
        />
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="!max-w-[98vw] !w-[98vw] !h-[98vh] p-0 bg-black/95 border-none" showCloseButton={false}>
          <DialogTitle className="sr-only">Image Gallery</DialogTitle>
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Previous Button */}
            {mediaUrls.length > 1 && (
              <button
                onClick={prevImage}
                className="absolute left-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            {/* Image/Video Display */}
            <div className="relative w-full h-full flex items-center justify-center p-12">
              {isVideo(mediaUrls[currentImageIndex]) ? (
                <video
                  key={currentImageIndex}
                  className="max-w-full max-h-full object-contain"
                  controls
                  autoPlay
                  playsInline
                  src={mediaUrls[currentImageIndex]}
                />
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={mediaUrls[currentImageIndex]}
                    alt={`${post.title || "Post image"} ${currentImageIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
              )}
            </div>

            {/* Next Button */}
            {mediaUrls.length > 1 && (
              <button
                onClick={nextImage}
                className="absolute right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}

            {/* Image Counter */}
            {mediaUrls.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-black/50 text-white text-sm">
                {currentImageIndex + 1} / {mediaUrls.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Login Required Dialog */}
      <LoginRequiredDialog
        isOpen={isLoginDialogOpen}
        onClose={closeLoginDialog}
        title="Đăng nhập để thích bài viết"
        description="Bạn cần đăng nhập để có thể thích bài viết. Vui lòng đăng nhập để tiếp tục."
        actionText="Đăng nhập ngay"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeletePost}
        title="Xóa bài viết"
        description="Bạn có chắc chắn muốn xóa bài viết này? Tất cả bình luận và lượt thích sẽ bị mất vĩnh viễn."
        itemName="bài viết này"
        isDeleting={isDeleting}
      />
    </div>
  );
}
