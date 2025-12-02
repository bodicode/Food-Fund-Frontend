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
}

export function PostLikeSummary({ postId, totalLikes, refreshKey }: PostLikeSummaryProps) {
    const [likes, setLikes] = useState<PostLike[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchLikes = async () => {
            if (totalLikes === 0) {
                setLikes([]);
                return;
            }

            try {
                setLoading(true);
                const data = await postService.getPostLikes(postId, 10, 0);
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

    if (totalLikes === 0) return null;

    if (likes.length === 0 && !loading) return null;

    // Logic to display names
    // Case 1: 1 person -> "Name"
    // Case 2: 2 people -> "Name1 and Name2"
    // Case 3: > 2 people -> "Name1, Name2 and X others"

    const firstLiker = likes[0]?.user.full_name || "Người dùng";
    const secondLiker = likes[1]?.user.full_name;

    let summaryText = "";
    let othersCount = 0;

    if (totalLikes === 1) {
        summaryText = firstLiker;
    } else if (totalLikes === 2) {
        summaryText = `${firstLiker} và ${secondLiker || "1 người khác"}`;
    } else {
        othersCount = totalLikes - 2;
        summaryText = `${firstLiker}, ${secondLiker || "người khác"} và ${othersCount} người khác`;
    }

    // Tooltip content: list all fetched names (up to 10)
    const tooltipContent = (
        <div className="flex flex-col gap-1 text-xs">
            {likes.map((like) => (
                <span key={like.id}>{like.user.full_name}</span>
            ))}
            {totalLikes > likes.length && (
                <span className="text-gray-400 italic">...và những người khác</span>
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
