import { v4 as uuidv4 } from 'uuid';

const CREATE_COMMENT_ENDPOINT = import.meta.env.VITE_CREATE_COMMENT_ENDPOINT;
const GET_COMMENTS_ENDPOINT = import.meta.env.VITE_GET_COMMENTS_ENDPOINT;
const VOTE_COMMENT_ENDPOINT = import.meta.env.VITE_VOTE_COMMENT_ENDPOINT;
const CHECK_UPVOTE_ENDPOINT = import.meta.env.VITE_CHECK_UPVOTE_ENDPOINT;
const DELETE_COMMENT_ENDPOINT = import.meta.env.VITE_DELETE_COMMENT_ENDPOINT;

const createComment = async (commentContent: string, materialId: string | undefined) => {
    if (!commentContent || !materialId) return;

    try {
        const response = await fetch(CREATE_COMMENT_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                comment_id: `${localStorage.getItem('user_id') || ''}-${uuidv4()}`,
                content: commentContent,
                created_date: new Date().toISOString(),
                upvote: 0,
                material_id: materialId,
                user_id: localStorage.getItem('user_id') || '',
            }),
        });

        if (response.ok) {
            const newComment = await response.json();

            if (newComment) {
                console.log("Comment created successfully:", newComment);
            }

        } else {
            console.error("Error creating comment:", response.statusText);
        }
    } catch (error) {
        console.error("Error creating comment:", error);
    }
};

const deleteComment = async (commentId: string, authorId: string) => {
    if (!commentId) return;
    const token = localStorage.getItem('jwt_token') || '';

    try {
        const response = await fetch(`${DELETE_COMMENT_ENDPOINT.replace("comment-id", commentId)}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ authorId }),
        });

        if (response.ok) {
            console.log("Comment deleted successfully");
        } else {
            console.error("Error deleting comment:", response.statusText);
        }
    } catch (error) {
        console.error("Error deleting comment:", error);
    }
}

const getComments = async (materialId: string, order: string) => {
    if (!materialId) return;

    try {
        const response = await fetch(`${GET_COMMENTS_ENDPOINT.replace("material-id", materialId)}?order=${order}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const comments = await response.json();
            console.log("Comments retrieved successfully:", comments);
            return comments.comments;
        } else {
            console.error("Error retrieving comments:", response.statusText);
        }
    } catch (error) {
        console.error("Error retrieving comments:", error);
    }
};

const voteComment = async (commentId: string, vote: 'upvote' | 'cancel-upvote') => {
    if (!commentId || !vote) return;

    try {
        const response = await fetch(`${VOTE_COMMENT_ENDPOINT.replace("comment-id", commentId)}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: localStorage.getItem('user_id') || '',
                vote: vote
            }),
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Comment voted successfully:", result);
        } else {
            console.error("Error voting comment:", response.statusText);
        }
    } catch (error) {
        console.error("Error voting comment:", error);
    }
};

const checkUpvoteRecord = async (userId: string, commentId: string) => {
    if (!userId || !commentId) return;

    try {
        const response = await fetch(
            `${CHECK_UPVOTE_ENDPOINT.replace("user-id", userId).replace("comment-id", commentId)}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.ok) {
            const result = await response.json();
            console.log("Upvote record checked successfully:", result);
            return result.isUpvoted;
        } else {
            console.error("Error checking upvote record:", response.statusText);
        }
    } catch (error) {
        console.error("Error checking upvote record:", error);
    }
};

export { createComment, deleteComment, getComments, voteComment, checkUpvoteRecord };