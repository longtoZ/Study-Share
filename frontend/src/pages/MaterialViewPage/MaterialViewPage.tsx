import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMaterial } from "@services/materialService";
import { retrieveUserData } from "@/services/userService";
import { getSubject } from "@/services/subjectService";
import { addEntry } from "@/services/historyService";
import { useSelector } from "react-redux";
import { verifyUser } from '@services/authService';
import { v4 as uuidv4 } from 'uuid';

import { createComment, deleteComment, getComments, voteComment, checkUpvoteRecord } from '@services/commentService';
import { makePayment } from "@/services/paymentService";
import { getMaterialUrl } from "@services/materialService";

import type { History } from "@/interfaces/table";

import MetadataCard from "./components/MetadataCard";
import AddLessonCard from "./components/AddLessonCard";
import RatingCard from "./components/RatingCard";
import ChatPannel from "./components/ChatPannel";

import {
    FileDownloadOutlined as FileDownloadOutlinedIcon,
    Star as StarIcon,
    ShareOutlined as ShareOutlinedIcon,
    SchoolOutlined as SchoolOutlinedIcon,
    DescriptionOutlined as DescriptionOutlinedIcon,
    CloudDownloadOutlined as CloudDownloadOutlinedIcon,
    VisibilityOutlined as VisibilityOutlinedIcon,
    SubjectOutlined as SubjectOutlinedIcon,
    DateRangeOutlined as DateRangeOutlinedIcon,
    AttachMoneyOutlined as AttachMoneyOutlinedIcon,
    ZoomInOutlined as ZoomInOutlinedIcon,
    ZoomOutOutlined as ZoomOutOutlinedIcon,
	SendOutlined as SendOutlinedIcon,
	FavoriteBorderOutlined as FavoriteBorderOutlinedIcon,
    FavoriteOutlined as FavoriteOutlinedIcon,
    SettingsOutlined as SettingsOutlinedIcon,
    MonetizationOnOutlined as MonetizationOnOutlinedIcon,
    ChatBubble as ChatBubbleIcon
} from "@mui/icons-material";

const GET_MATERIAL_PAGE_ENDPOINT = import.meta.env.VITE_GET_MATERIAL_PAGE_ENDPOINT;

interface IImagePage {
    pageNumber: number;
    imageUrl: string;
}

const MaterialViewPage = () => {
    const [material, setMaterial] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [imagePages, setImagePages] = useState<IImagePage[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [currentView, setCurrentView] = useState("content"); // 'content' or 'about'
    const [avgRating, setAvgRating] = useState(0);
    const [subject, setSubject] = useState<string>("");
    const [imageWidth, setImageWidth] = useState(0);
	const [commentOrder, setCommentOrder] = useState<string>("newest");
	const [commentContent, setCommentContent] = useState<string>("");
	const [allCommentsData, setAllCommentsData] = useState<any[]>([]);
    const [isAuthor, setIsAuthor] = useState<boolean>(false);
    const [isMaterialPaid, setIsMaterialPaid] = useState<boolean>(false);
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

    const userState = useSelector((state: any) => state.user);

    const { materialId } = useParams();
    const userId = localStorage.getItem('user_id') || '';
    const scrollViewRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const getImagePage = async (pageNumber: number) => {
        const imageUrl = GET_MATERIAL_PAGE_ENDPOINT.replace(
            "material-id",
            materialId
        ).replace("page-number", pageNumber.toString());
        console.log(`Fetching page ${pageNumber} from ${imageUrl}`);

        try {
            setImagePages((prevImages) => {
                const newImagePage: IImagePage = {
                    pageNumber: pageNumber,
                    imageUrl: imageUrl,
                };

                if (
                    prevImages.some((image) => image.pageNumber === pageNumber)
                ) {
                    return prevImages
                        .map((image) =>
                            image.pageNumber === pageNumber
                                ? newImagePage
                                : image
                        )
                        .sort((a, b) => a.pageNumber - b.pageNumber);
                }

                return [...prevImages, newImagePage].sort(
                    (a, b) => a.pageNumber - b.pageNumber
                );
            });
        } catch (error) {
            console.error("Error fetching material page:", error);
        }
    };

    useEffect(() => {
        if (!materialId) return;

        const fetchData = async () => {
            const materialData = await getMaterial(materialId);

            if (materialData) {
                setMaterial(materialData);
                setTotalPages(materialData.num_page);
                setAvgRating(
                    materialData.total_rating / materialData.rating_count || 0
                );
                setIsMaterialPaid(!!materialData.price);
            }

            const subjectData = await getSubject(materialData.subject_id);
            if (subjectData) {
                setSubject(subjectData.name);
            }

            const userData = await retrieveUserData(materialData.user_id);
            if (userData) {
                console.log("User data retrieved:", userData);
                setUser(userData);
            }

            try {
                await verifyUser();
                setIsAuthor(true);
            } catch (error) {
                console.error("Error verifying user:", error);
            }

            const historyEntry: History = {
                history_id: `${userId}-${uuidv4()}`,
                user_id: userId,
                material_id: materialData.material_id,
                lesson_id: null,
                type: 'materials',
                viewed_date: new Date(),
            };

            await addEntry(historyEntry);
        };

        fetchData();

        if (scrollViewRef.current) {
            const elementWidth = scrollViewRef.current.offsetWidth;
            setImageWidth(elementWidth);
            console.log("Initial image width set to:", elementWidth);
        }

    }, [materialId]);

    useEffect(() => {
        if (!materialId || !currentPage) return;

        const getImagePageAsync = async (page: number) => {
            await getImagePage(page);
        };
        getImagePageAsync(currentPage);
    }, [currentPage]);

    useEffect(() => {
        const fetchComments = async () => {
            if (!materialId) return;

            const comments = await getComments(materialId, commentOrder);

            for (const element of comments) {
                const userOfComment = await retrieveUserData(element.user_id);
                if (userOfComment) {
                    const isUpvoted = await checkUpvoteRecord(userId, element.comment_id) ? true : false;
                    setAllCommentsData((prevComments) => {
                        if (!prevComments.some((c) => c.comment.comment_id === element.comment_id)) {
                            return [...prevComments, { comment: element, user: userOfComment, isUpvoted }];
                        }
                        return prevComments;
                    });
                }
            }

        };

        fetchComments();
    }, []);

    const handleOnScroll = async (e: any) => {
        const scrollTop = e.target.scrollTop;
        const scrollHeight = e.target.scrollHeight;
        const clientHeight = e.target.clientHeight;

        // console.log('Scroll Top:', scrollTop);
        // console.log('Scroll Height:', scrollHeight);
        // console.log('Client Height:', clientHeight);
        // console.log('Current Page:', currentPage);
        // console.log('Total Pages:', totalPages);

        if (
            scrollTop + clientHeight >= scrollHeight - 10 &&
            currentPage < totalPages
        ) {
            console.log("Loading next page:", currentPage + 1);

            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handleViewChange = (view: "content" | "about") => {
        setCurrentView(view);
    };

    useEffect(() => {
        console.log("Image width updated:", imageWidth);
    }, [imageWidth]);

    const handleZoomIn = () => {
        if (scrollViewRef.current) {
            const newWidth = imageWidth * 1.2;
            console.log("Zooming in to new width:", newWidth);
            setImageWidth(newWidth);
        }
    };

    const handleZoomOut = () => {
        if (scrollViewRef.current) {
            const newWidth = imageWidth * 0.8;
            console.log("Zooming out to new width:", newWidth);
            setImageWidth(newWidth);
        }
    };

    const handleUpvote = async (commentId: string, vote: 'upvote' | 'cancel-upvote') => {
        if (!userState.loggedIn) {
            alert("Please log in to vote on comments.");
            return;
        }

        console.log(`Voting on comment ${commentId} with action: ${vote}`);
        await voteComment(commentId, vote);
        setAllCommentsData((prevComments) =>
            prevComments.map((c) => {
                if (c.comment.comment_id === commentId) {
                    console.log(`Updating comment ${commentId} upvote status to: ${vote === 'upvote'}`);
                    
                    // Deep copy to avoid mutation
                    const newCommentData = { ...c, comment: { ...c.comment } }
                    newCommentData.isUpvoted = vote === 'upvote';
                    newCommentData.comment.upvote += vote === 'upvote' ? 1 : -1;
                    return newCommentData;
                }
                return c;
            })
        );
        console.log(allCommentsData);
    };

    const downloadMaterial = async () => {
        if (!material) {
            console.error("No material loaded");
            return;
        }

        try {
            const fileUrl = await getMaterialUrl(material.material_id);
            
            // Fetch the file as a blob
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            
            // Create a blob URL
            const blobUrl = window.URL.createObjectURL(blob);
            
            const anchor = document.createElement('a');
            anchor.href = blobUrl;
            anchor.download = material.name;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            
            // Clean up the blob URL
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Error downloading material:", error);
        }
    }

    return (
        <div className={`relative bg-gray-100 min-h-screen scrollbar-hide h-[100vh] ${ isChatOpen ? 'overflow-hidden' : 'overflow-y-auto' }`}>
            <div className="p-12 pb-36">
            {isAuthor && (
                <div className="mb-6 flex justify-end">
                    <button 
                        className="flex items-center gap-2 rounded-xl shadow-lg bg-white py-3 px-4 cursor-pointer hover:bg-zinc-100"
                        onClick={() => navigate(`/material/${material?.material_id}/edit`)}>
                        <SettingsOutlinedIcon/>
                        <h3>Edit Material</h3>
                    </button>
                </div>
            )}
            <div className="flex flex-col gap-10 max-w-7xl mx-auto">
                {/* Header Section: Title, User Info, and CTA */}
                <div className="bg-white rounded-3xl card-shadow p-12">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-2">
                                {material?.name}
                            </h1>
                            <div className="flex items-center gap-4 text-gray-600 mt-2">
                                <img
                                    src={
                                        user?.profile_picture_url ||
                                        "https://placehold.co/100x100/E5E7EB/4B5563?text=User"
                                    }
                                    alt="Uploader Profile"
                                    className="w-12 h-12 rounded-full border-2 border-blue-500 p-0.5"
                                />
                                <div>
                                    <a
                                        href={`/user/${user?.user_id}`}
                                        className="text-blue-600 hover:underline font-bold text-lg transition-colors duration-200"
                                    >
                                        {user?.full_name || "Unknown User"}
                                    </a>
                                    <p className="text-gray-500 text-sm flex items-center gap-1 mt-0.5">
                                        <DateRangeOutlinedIcon className="h-4 w-4" />
                                        Uploaded on{" "}
                                        {material?.upload_date
                                            ? new Date(
                                                  material.upload_date
                                              ).toLocaleDateString()
                                            : "Unknown Date"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                            <button
                                className={`flex items-center gap-2 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl
                         bg-gradient-to-r ${isMaterialPaid && userId !== user?.user_id ? 'from-lime-500 to-green-600' : 'from-blue-500 to-indigo-600'} focus:outline-none focus:ring-4 ${isMaterialPaid && userId !== user?.user_id ? 'focus:ring-green-300' : 'focus:ring-blue-300'} w-full sm:w-auto justify-center cursor-pointer`}
                                onClick={() => {
                                        if (isMaterialPaid && userId !== user?.user_id) {
                                            if (!user.stripe_account_id) {
                                                alert('Please connect your Stripe account first.');
                                                return;
                                            }

                                            makePayment({
                                                material_id: material.material_id,
                                                name: material.name,
                                                buyer_id: userId,
                                                seller_id: user.user_id,
                                                seller_stripe_account_id: user.stripe_account_id,
                                                amount: material.price,
                                                currency: "usd",
                                            });
                                        } else {
                                            downloadMaterial();
                                        }
                                    }
                                }
                            >
                                { isMaterialPaid && userId !== user?.user_id ? (
                                    <MonetizationOnOutlinedIcon className="-mt-[1px]" />
                                ) : (
                                    <FileDownloadOutlinedIcon className="-mt-[1px]" />
                                )}
                                {isMaterialPaid && userId !== user?.user_id ? 'Buy' : 'Download'}
                            </button>
                            <AddLessonCard user_id={user?.user_id} material_id={material?.material_id} />
                            <button className="flex items-center gap-2 text-gray-700 bg-gray-100 hover:bg-gray-200 py-3 px-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-md w-full sm:w-auto justify-center">
                                <ShareOutlinedIcon />
                                Share
                            </button>
                        </div>
                    </div>

                    {/* Rating Section */}
                    <div className="flex items-center gap-4 mt-6">
                        <div className="flex items-center gap-2">
                            <span className="text-4xl font-extrabold text-gray-900">
                                {avgRating.toFixed(1)}
                            </span>
                            <div className="flex">
                                {Array.from({ length: 5 }, (_, index) => (
                                    <StarIcon
                                        key={index}
                                        className={`${
                                            avgRating > index
                                                ? "text-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm">
                            {material?.rating_count
                                ? `Based on ${material.rating_count} ratings`
                                : "No ratings yet"}
                        </p>
                    </div>
                </div>

                {/* Main Content Area: Tabs, Viewer, and Metadata Grid */}
                <div className="flex flex-col gap-8">
                    {/* (Viewer and Tabs) */}
                    <div className=" bg-white rounded-3xl card-shadow p-8">
                        <div className="flex items-center gap-6 border-b border-gray-200 mb-6">
                            <button
                                className={`text-lg font-bold pb-3 transition-colors duration-200
                         ${
                             currentView === "content"
                                 ? "text-blue-600 border-b-4 border-blue-600"
                                 : "text-gray-500 hover:text-gray-800"
                         }`}
                                onClick={() => handleViewChange("content")}
                            >
                                Content
                            </button>
                            <button
                                className={`text-lg font-bold pb-3 transition-colors duration-200
                         ${
                             currentView === "about"
                                 ? "text-blue-600 border-b-4 border-blue-600"
                                 : "text-gray-500 hover:text-gray-800"
                         }`}
                                onClick={() => handleViewChange("about")}
                            >
                                About
                            </button>
                        </div>

                        {currentView === "content" ? (
                            <div className="w-full h-[80vh] bg-gray-100 rounded-2xl flex items-center justify-center p-4 relative">
                                <div
                                    className="w-full h-full overflow-y-auto rounded-xl scrolltrack-hide"
                                    onScroll={handleOnScroll}
                                    ref={scrollViewRef}
                                >
                                    {imagePages.length > 0 ? (
                                        imagePages.map((page, index) => (
                                            <div
                                                key={index}
                                                className="w-full overflow-x-auto"
                                            >
                                                <img
                                                    src={page.imageUrl}
                                                    alt={`Page ${page.pageNumber}`}
                                                    className="object-contain h-auto my-4 mx-auto rounded-xl shadow-md"
                                                    style={{
                                                        width: '100%',
                                                        maxWidth: "none",
                                                    }}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center">
                                            <DescriptionOutlinedIcon className="text-gray-400 w-16 h-16 mb-4" />
                                            <p className="text-gray-500 font-bold text-2xl">
                                                PDF Preview Not Available
                                            </p>
                                            <p className="text-gray-400 mt-2">
                                                A full-featured, scrollable PDF
                                                viewer would go here.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg p-2 flex items-center gap-6">
                                    <button
                                        className="text-gray-500 hover:text-gray-800 transition-colors duration-200 cursor-pointer"
                                        onClick={handleZoomIn}
                                    >
                                        <ZoomInOutlinedIcon />
                                    </button>
                                    <button
                                        className="text-gray-500 hover:text-gray-800 transition-colors duration-200 cursor-pointer"
                                        onClick={handleZoomOut}
                                    >
                                        <ZoomOutOutlinedIcon />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">
                                    Info
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                    <MetadataCard
                                        icon={<SchoolOutlinedIcon />}
                                        label="Subject"
                                        value={subject || "Unknown"}
                                    />
                                    <MetadataCard
                                        icon={<DescriptionOutlinedIcon />}
                                        label="Type"
                                        value={material?.file_type || "Unknown"}
                                    />
                                    <MetadataCard
                                        icon={<CloudDownloadOutlinedIcon />}
                                        label="Size"
                                        value={
                                            material?.size
                                                ? `${(
                                                      material.size /
                                                      1024 /
                                                      1024
                                                  ).toFixed(2)} MB`
                                                : "Unknown"
                                        }
                                    />
                                    <MetadataCard
                                        icon={<SubjectOutlinedIcon />}
                                        label="Pages"
                                        value={material?.num_page || 0}
                                    />
                                    <MetadataCard
                                        icon={<VisibilityOutlinedIcon />}
                                        label="Views"
                                        value={material?.view_count || 0}
                                    />
                                    <MetadataCard
                                        icon={<CloudDownloadOutlinedIcon />}
                                        label="Downloads"
                                        value={material?.download_count || 0}
                                    />
                                    <MetadataCard
                                        icon={<AttachMoneyOutlinedIcon />}
                                        label="Price"
                                        value={
                                            material?.price
                                                ? `$${material.price}`
                                                : "Free"
                                        }
                                        isPaid={isMaterialPaid}
                                    />
                                </div>

                                <div className="border-b border-gray-200 my-10"></div>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">
                                    Description
                                </h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {material?.description ||
                                        "No description available."}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Rating Card */}
                    <RatingCard materialId={materialId} />

					{/* Comment Section */}
					<div className="bg-white rounded-3xl py-6 px-12 card-shadow">
						<div className="flex justify-between items-center">
							<h3 className="text-xl font-bold text-gray-800 mb-2">
								Comments
							</h3>
							<div className="flex justify-evenly p-1 bg-zinc-100 rounded-2xl">
								<button
									className={`px-4 py-2 rounded-2xl cursor-pointer ${
										commentOrder === "newest"
											? "bg-white"
											: "text-zinc-800"
									}`}
									onClick={() => setCommentOrder("newest")}
								>
									Newest
								</button>
								<button
									className={`px-4 py-2 rounded-2xl cursor-pointer ${
										commentOrder === "popular"
											? "bg-white"
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
									onClick={async () => {
										await createComment(commentContent, materialId);
										setCommentContent('');
									}}
								>
									<SendOutlinedIcon />
								</button>
							</div>
						</div>

						<div className="mt-10 border border-b-0 border-zinc-300"></div>

						<div className="mt-4">
							{allCommentsData.length > 0 ? (
								allCommentsData.map((commentData) => (
									<div key={commentData.comment.comment_id} className="py-4 flex gap-6">
										<img
											src={
												commentData.user.profile_picture_url ||
												"https://placehold.co/100x100/E5E7EB/4B5563?text=User"
											}
											alt="User Profile"
											className="w-10 h-10 rounded-full border-2 border-blue-500 p-0.5"
										/>
										<div className="flex-1">
											<div className="flex gap-6 items-center text-xs text-zinc-400">
												<a className="text-lg font-semibold text-zinc-800 hover:underline" href={`/user/${commentData.user.user_id}`} target="_blank">
													{commentData.user.full_name}
												</a>
												<span>{new Date(commentData.comment.created_date).toLocaleString()}</span>
											</div>
											<p className="mt-2 text-sm text-zinc-600">{commentData.comment.content}</p>
											<div className="flex gap-4 mt-2">
												<button 
                                                    className="flex items-center gap-1 text-zinc-500 hover:text-zinc-800 transition-colors duration-200" 
                                                    onClick={() => {
                                                        handleUpvote(commentData.comment.comment_id, commentData.isUpvoted ? 'cancel-upvote' : 'upvote');
                                                    }}
                                                >
													{ commentData.isUpvoted ? <FavoriteOutlinedIcon fontSize="small" /> : <FavoriteBorderOutlinedIcon fontSize="small" /> }
													<span>{commentData.comment.upvote}</span>
												</button>
                                                <span className="ml-4 cursor-pointer" onClick={() => deleteComment(commentData.comment.comment_id)}>Delete</span>
											</div>
										</div>
									</div>
								))
							) : (
								<p className="text-gray-500">No comments yet.</p>
							)}
						</div>
					</div>
                </div>
            </div>
            </div>
            <button
                className="fixed bottom-8 right-8 z-40 button-primary p-4 flex items-center gap-2 transition-all hover:scale-105"
                onClick={() => setIsChatOpen(true)}
                style={{ borderRadius: '50%'}}
            >
                <ChatBubbleIcon fontSize="small"/>
            </button>
            <ChatPannel userId={userId} materialId={materialId ?? ''} open={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </div>
    );
};

export default MaterialViewPage;
