import { useState, useEffect } from "react";
import { clearSession } from "../../services/aiChatService";

import { useMaterialData } from "./hooks/useMaterialData";
import { useMaterialContent } from "./hooks/useMaterialContent";
import { useComments } from "./hooks/useComments";

import HeaderSection from "./components/HeaderSection";
import ContentView from "./components/ContentView";
import CommentSection from "./components/CommentSection";
import RatingCard from "./components/RatingCard";
import ChatPannel from "./components/ChatPannel";

import { ChatBubble as ChatBubbleIcon } from "@mui/icons-material";

const MaterialViewPage = () => {
    const { material, user, isAuthor, isMaterialPaid, avgRating, subject, materialId, userId } = useMaterialData();
    const { imagePages, scrollViewRef, handleOnScroll, handleZoomIn, handleZoomOut, imageWidth } = useMaterialContent(materialId, material?.num_page || 0, isMaterialPaid);
    const {
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
    } = useComments(materialId, userId, isAuthor);

    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

    useEffect(() => {
        const handleBeforeUnload = async () => {
            if (userId && materialId) {
                try {
                    await clearSession(userId, materialId);
                    console.log("AI session cleared successfully on unload.");
                } catch (error) {
                    console.error("Error clearing AI session on unload:", error);
                }
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [userId, materialId]);

    return (
        <div className={`relative bg-gray-100 h-screen scrollbar-hide ${ isChatOpen ? 'overflow-hidden' : 'overflow-y-scroll' }`}>
            <div className="p-12 pb-36">
                <div className="flex flex-col gap-10 max-w-7xl mx-auto">
                    <HeaderSection
                        material={material}
                        user={user}
                        avgRating={avgRating}
                        isMaterialPaid={isMaterialPaid}
                        userId={userId}
                        isAuthor={isAuthor}
                    />

                    <div className="flex flex-col gap-8">
                        <ContentView
                            material={material}
                            subject={subject}
                            isMaterialPaid={isMaterialPaid}
                            imagePages={imagePages}
                            imageWidth={imageWidth}
                            scrollViewRef={scrollViewRef}
                            handleOnScroll={handleOnScroll}
                            handleZoomIn={handleZoomIn}
                            handleZoomOut={handleZoomOut}
                        />

                        <RatingCard materialId={materialId} />

                        <CommentSection
                            user={user}
                            isAuthor={isAuthor}
                            commentOrder={commentOrder}
                            setCommentOrder={setCommentOrder}
                            commentContent={commentContent}
                            setCommentContent={setCommentContent}
                            isPostingComment={isPostingComment}
                            handlePostComment={handlePostComment}
                            allCommentsData={allCommentsData}
                            handleUpvote={handleUpvote}
                            handleDeleteComment={handleDeleteComment}
                            isNoMoreComments={isNoMoreComments}
                            setCommentsRange={setCommentsRange}
                            commentsRange={commentsRange}
                        />
                    </div>
                </div>
            </div>
            <button
                className="fixed bottom-8 right-8 z-40 button-primary p-4 flex items-center gap-2 transition-all hover:scale-105"
                onClick={() => setIsChatOpen(true)}
                style={{ borderRadius: '20px'}}
            >
                <ChatBubbleIcon fontSize="small"/>
                Chat
            </button>
            <ChatPannel userId={userId} materialId={materialId ?? ''} open={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </div>
    );
};

export default MaterialViewPage;
