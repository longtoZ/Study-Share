
import { useState, useEffect } from "react";
import { createComment, getComments, voteComment, deleteComment } from '@services/commentService';

export const useComments = (materialId: string | undefined, userId: string, isAuthor: boolean) => {
    const [commentOrder, setCommentOrder] = useState<string>("newest");
    const [commentContent, setCommentContent] = useState<string>("");
    const [allCommentsData, setAllCommentsData] = useState<any[]>([]);
    const [commentsRange, setCommentsRange] = useState<{ start: number; end: number }>({ start: 0, end: 9 });
    const [isNoMoreComments, setIsNoMoreComments] = useState<boolean>(false);
    const [isPostingComment, setIsPostingComment] = useState<boolean>(false);

    useEffect(() => {
        const fetchComments = async () => {
            if (!materialId) return;

            try {
                const comments = await getComments(materialId, commentOrder, commentsRange);

                for (const element of comments) {
                    setAllCommentsData((prevComments) => {
                        if (!prevComments.some((comment) => comment.comment_id === element.comment_id)) {
                            return [...prevComments, element];
                        }
                        return prevComments;
                    });
                }
                setIsNoMoreComments(comments.length === 0);
            } catch (error: any) {
                if (error.message.includes("No comments found")) {
                    setIsNoMoreComments(true);
                } else {
                    console.error("Error fetching comments:", error);
                }
            }
        };

        fetchComments();
    }, [materialId, commentOrder, commentsRange]);

    const handleUpvote = async (commentId: string, vote: 'upvote' | 'cancel-upvote') => {
        if (!userId) {
            alert("Please log in to vote on comments.");
            return;
        }

        await voteComment(commentId, vote);
        setAllCommentsData((prevComments) =>
            prevComments.map((comment) => {
                if (comment.comment_id === commentId) {
                    const newCommentData = { ...comment };
                    newCommentData.upvoted = vote === 'upvote';
                    newCommentData.upvote += vote === 'upvote' ? 1 : -1;
                    return newCommentData;
                }
                return comment;
            })
        );
    };

    const handlePostComment = async () => {
        if (!materialId) return;
        setIsPostingComment(true);
        await createComment(commentContent, materialId);
        setCommentContent('');
        setIsPostingComment(false);
        // Refresh comments
        setAllCommentsData([]);
        setCommentsRange({ start: 0, end: 9 });
        setIsNoMoreComments(false);
    };

    const handleDeleteComment = async (commentId: string, commentUserId: string) => {
        if (!isAuthor) return;
        await deleteComment(commentId, commentUserId);
        setAllCommentsData(prevComments => prevComments.filter(comment => comment.comment_id !== commentId));
    };

    return {
        commentOrder,
        setCommentOrder,
        commentContent,
        setCommentContent,
        allCommentsData,
        isNoMoreComments,
        isPostingComment,
        handleUpvote,
        handlePostComment,
        handleDeleteComment,
        setCommentsRange,
        commentsRange
    };
};
