
import CircularProgress from "@mui/material/CircularProgress";
import {
    SendOutlined as SendOutlinedIcon,
    FavoriteBorderOutlined as FavoriteBorderOutlinedIcon,
    FavoriteOutlined as FavoriteOutlinedIcon,
} from "@mui/icons-material";

interface CommentSectionProps {
    user: any;
    isAuthor: boolean;
    commentOrder: string;
    setCommentOrder: (order: string) => void;
    commentContent: string;
    setCommentContent: (content: string) => void;
    isPostingComment: boolean;
    handlePostComment: () => void;
    allCommentsData: any[];
    handleUpvote: (commentId: string, vote: 'upvote' | 'cancel-upvote') => void;
    handleDeleteComment: (commentId: string, userId: string) => void;
    isNoMoreComments: boolean;
    setCommentsRange: (range: { start: number; end: number }) => void;
    commentsRange: { start: number; end: number };
}

const CommentSection = ({
    user,
    isAuthor,
    commentOrder,
    setCommentOrder,
    commentContent,
    setCommentContent,
    isPostingComment,
    handlePostComment,
    allCommentsData,
    handleUpvote,
    handleDeleteComment,
    isNoMoreComments,
    setCommentsRange,
    commentsRange,
}: CommentSectionProps) => {
    return (
        <div className="bg-white rounded-3xl py-6 px-12 card-shadow">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Comments
                </h3>
                <div className="flex gap-2 justify-evenly p-1 bg-zinc-100 rounded-2xl inset-shadow-sm">
                    <button
                        className={`px-4 py-2 rounded-2xl cursor-pointer ${
                            commentOrder === "newest"
                                ? "bg-white shadow-sm"
                                : "text-zinc-800"
                        }`}
                        onClick={() => setCommentOrder("newest")}
                    >
                        Newest
                    </button>
                    <button
                        className={`px-4 py-2 rounded-2xl cursor-pointer ${
                            commentOrder === "popular"
                                ? "bg-white shadow-sm"
                                : "text-zinc-800"
                        }`}
                        onClick={() => setCommentOrder("popular")}
                    >
                        Popular
                    </button>
                </div>
            </div>

            <div className="flex mt-4 gap-6">
                <img
                    referrerPolicy="no-referrer"
                    src={
                        user?.profile_picture_url ||
                        "https://placehold.co/100x100/E5E7EB/4B5563?text=User"
                    }
                    alt="Uploader Profile"
                    className="w-12 h-12 rounded-full border-2 border-blue-500 p-0.5"
                />
                <div className="w-full bg-zinc-50 rounded-2xl p-2 border-2 border-zinc-300">
                    <textarea
                        className="border-none rounded-lg p-2 w-full h-24 focus:outline-none"
                        placeholder="Add a comment..."
                        style={{ resize: "none" }}
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                    ></textarea>
                    <div className="my-2 border border-b-0 border-zinc-300"></div>
                    <button 
                        className="mt-4 w-12 h-12 p-2 flex justify-center items-center button-primary ml-auto" 
                        style={{ borderRadius: 'calc(infinity * 1px)' }}
                        onClick={handlePostComment}
                    >
                        { isPostingComment ? <CircularProgress size={24} color="inherit" /> : <SendOutlinedIcon /> }
                    </button>
                </div>
            </div>

            <div className="mt-10 border border-b-0 border-zinc-300"></div>

            <div className="mt-4">
                {allCommentsData.length > 0 ? (
                    allCommentsData.map((comment) => (
                        <div key={comment.comment_id} className="py-4 flex gap-6">
                            <img
                                referrerPolicy="no-referrer"
                                src={
                                    comment.profile_picture_url ||
                                    "https://placehold.co/100x100/E5E7EB/4B5563?text=User"
                                }
                                alt="User Profile"
                                className="w-10 h-10 rounded-full border-2 border-blue-500 p-0.5"
                            />
                            <div className="flex-1">
                                <div className="flex gap-6 items-center text-xs text-zinc-400">
                                    <a className="text-lg font-semibold text-zinc-800 hover:underline" href={`/user/${comment.user_id}`} target="_blank">
                                        {comment.user_name}
                                    </a>
                                    <span>{new Date(comment.created_date).toLocaleString()}</span>
                                </div>
                                <p className="mt-2 text-sm text-zinc-600">{comment.content}</p>
                                <div className="flex gap-4 mt-2">
                                    <button 
                                        className="flex items-center gap-1 text-zinc-500 hover:text-zinc-800 transition-colors duration-200" 
                                        onClick={() => {
                                            handleUpvote(comment.comment_id, comment.upvoted ? 'cancel-upvote' : 'upvote');
                                        }}
                                    >
                                        { comment.upvoted ? <FavoriteOutlinedIcon fontSize="small" /> : <FavoriteBorderOutlinedIcon fontSize="small" /> }
                                        <span>{comment.upvote}</span>
                                    </button>
                                    { isAuthor && <span className="ml-4 cursor-pointer" onClick={() => handleDeleteComment(comment.comment_id, comment.user_id)}>Delete</span> }
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No comments yet.</p>
                )}
                { !isNoMoreComments ? (<button
                    className="mt-4 w-full p-3 flex justify-center items-center cursor-pointer text-sm border border-zinc-300 bg-zinc-100 hover:bg-zinc-200 transition-colors duration-200"
                    style={{ borderRadius: '20px'}}
                    onClick={() => setCommentsRange({ start: commentsRange.end + 1, end: commentsRange.end + 10 })}
                >
                    Load more comments
                </button> ) : (
                    <p className="text-gray-500 text-center mt-4">No more comments.</p>
                ) }
            </div>
        </div>
    );
};

export default CommentSection;
