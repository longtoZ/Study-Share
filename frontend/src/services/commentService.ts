import { v4 as uuidv4 } from 'uuid';

const CREATE_COMMENT_ENDPOINT = import.meta.env.VITE_CREATE_COMMENT_ENDPOINT;
const GET_COMMENTS_ENDPOINT = import.meta.env.VITE_GET_COMMENTS_ENDPOINT;

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
                downvote: 0,
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

const getComments = async (materialId: string) => {
    if (!materialId) return;

    try {
        const response = await fetch(GET_COMMENTS_ENDPOINT.replace("material-id", materialId), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const comments = await response.json();
            console.log("Comments retrieved successfully:", comments);
            return comments;
        } else {
            console.error("Error retrieving comments:", response.statusText);
        }
    } catch (error) {
        console.error("Error retrieving comments:", error);
    }
};

export { createComment, getComments };