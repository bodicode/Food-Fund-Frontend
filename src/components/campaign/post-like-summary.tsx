"use client";

import { useEffect, useState } from "react";
import { postService } from "@/services/post.service";
import { PostLike } from "@/types/api/post-interaction";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface PostLikeSummaryProps {
    postId: string;
    totalLikes: number;
    refreshKey?: number; // To trigger refetch when like count changes
    currentUserId?: string;
    currentUser?: {
        id: string;
        name: string;
        avatar_url?: string;
    } | null;
    isLikedByMe?: boolean;
}

export function PostLikeSummary({ postId, totalLikes, refreshKey, currentUserId, currentUser, isLikedByMe }: PostLikeSummaryProps) {
    const [likes, setLikes] = useState<PostLike[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchLikes = async () => {
            // If totalLikes is 0, we don't need to fetch, but we should clear likes
            if (totalLikes === 0) {
                setLikes([]);
                return;
            }

            try {
                setLoading(true);
                // Fetch more likes to show all names (limit 100 should be enough for most cases)
                const data = await postService.getPostLikes(postId, 100, 0);
                if (isMounted) {
                    setLikes(data);
                }
            } catch (error) {
                console.error("Failed to fetch post likes", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchLikes();

        return () => {
            isMounted = false;
        };
    }, [postId, totalLikes, refreshKey]);

    // Filter likes based on optimistic state
    let displayLikes = [...likes];

    // If isLikedByMe is false, ensure current user is NOT in the list
    if (currentUserId && isLikedByMe === false) {
        displayLikes = displayLikes.filter(like => like.user.id !== currentUserId);
    }

    // If isLikedByMe is true, ensure current user IS in the list
    if (currentUser && isLikedByMe === true) {
        const isUserInList = displayLikes.some(like => like.user.id === currentUser.id);
        if (!isUserInList) {
            // Add optimistic like entry
            const optimisticLike: PostLike = {
                id: "optimistic-like",
                user: {
                    id: currentUser.id,
                    full_name: currentUser.name || "Tôi",
                },
            };
            displayLikes.unshift(optimisticLike);
        }
    }

    if (totalLikes === 0) return null;

    if (displayLikes.length === 0 && !loading) return null;

    // Logic to display names
    // Case 1: 1 person -> "Name"
    // Case 2: 2 people -> "Name1 and Name2"
    // Case 3: > 2 people -> "Name1, Name2 and X others"

    const firstLiker = displayLikes[0]?.user.full_name || "Người dùng";
    const secondLiker = displayLikes[1]?.user.full_name;

    let summaryText = "";
    let othersCount = 0;

    // Recalculate total likes for display based on displayLikes length if it's larger than totalLikes (due to optimistic add)
    // But usually totalLikes is also optimistically updated.
    // However, if totalLikes is 2, and we have 1 fetched like + 1 optimistic like = 2.

    // Use the larger of totalLikes or displayLikes.length to avoid "and -1 others"
    const effectiveTotal = Math.max(totalLikes, displayLikes.length);

    if (effectiveTotal === 1) {
        summaryText = firstLiker;
    } else if (effectiveTotal === 2) {
        summaryText = `${firstLiker} và ${secondLiker || "1 người khác"}`;
    } else {
        othersCount = effectiveTotal - 2;
        summaryText = `${firstLiker}, ${secondLiker || "người khác"} và ${othersCount} người khác`;
    }

    // Tooltip content: list all fetched names
    const tooltipContent = (
        <div className="flex flex-col gap-1 text-xs max-h-[300px] overflow-y-auto pr-2">
            {displayLikes.map((like) => (
                <span key={like.id} className="whitespace-nowrap">{like.user.full_name}</span>
            ))}
            {effectiveTotal > displayLikes.length && (
                <span className="text-gray-400 italic">...và {effectiveTotal - displayLikes.length} người khác</span>
            )}
        </div>
    );

    return (
        <div className="text-sm text-gray-600 mt-2">
            <span className="mr-1">Được thích bởi</span>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="font-medium cursor-pointer hover:underline text-gray-900">
                            {summaryText}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-800 text-white border-gray-700">
                        {tooltipContent}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
