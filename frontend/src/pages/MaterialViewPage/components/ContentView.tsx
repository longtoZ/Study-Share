
import { useState } from "react";
import MetadataCard from "./MetadataCard";
import {
    SchoolOutlined as SchoolOutlinedIcon,
    DescriptionOutlined as DescriptionOutlinedIcon,
    CloudDownloadOutlined as CloudDownloadOutlinedIcon,
    VisibilityOutlined as VisibilityOutlinedIcon,
    SubjectOutlined as SubjectOutlinedIcon,
    AttachMoneyOutlined as AttachMoneyOutlinedIcon,
    ZoomInOutlined as ZoomInOutlinedIcon,
    ZoomOutOutlined as ZoomOutOutlinedIcon,
    MonetizationOnOutlined as MonetizationOnOutlinedIcon,
} from "@mui/icons-material";

interface ContentViewProps {
    material: any;
    subject: string;
    isMaterialPaid: boolean;
    imagePages: { pageNumber: number; imageUrl: string }[];
    imageWidth: number;
    scrollViewRef: any;
    handleOnScroll: (e: any) => void;
    handleZoomIn: () => void;
    handleZoomOut: () => void;
}

const ContentView = ({
    material,
    subject,
    isMaterialPaid,
    imagePages,
    imageWidth,
    scrollViewRef,
    handleOnScroll,
    handleZoomIn,
    handleZoomOut,
}: ContentViewProps) => {
    const [currentView, setCurrentView] = useState("content");

    return (
        <div className=" bg-white rounded-3xl card-shadow p-8">
            <div className="flex items-center gap-6 border-b border-gray-200 mb-6">
                <button
                    className={`text-lg font-bold pb-3 transition-colors duration-200
                     ${
                         currentView === "content"
                             ? "text-blue-600 border-b-4 border-blue-600"
                             : "text-gray-500 hover:text-gray-800"
                     }`}
                    onClick={() => setCurrentView("content")}
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
                    onClick={() => setCurrentView("about")}
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
                                    className="w-full overflow-x-auto relative"
                                >
                                    <img
                                        referrerPolicy="no-referrer"
                                        src={page.imageUrl}
                                        alt={`Page ${page.pageNumber}`}
                                        className="object-contain h-auto my-4 mx-auto rounded-xl shadow-md"
                                        style={{
                                            width: `${imageWidth}px`,
                                            maxWidth: "none",
                                        }}
                                    />
                                    { isMaterialPaid && page.pageNumber > 2 && (
                                        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                                            <div className="text-zinc-600 bg-white rounded-3xl py-6 px-12 flex flex-col items-center justify-center shadow-[0_0_20px_20px_rgba(255,255,255,1)]">
                                                <MonetizationOnOutlinedIcon className="mb-4" style={{color: '#ffdf2e', width: '48px', height: '48px'}}/>
                                                <h1 className="text-2xl text-center font-semibold mb-2">This page is blurred because it is paid content. Please purchase to access.</h1>
                                            </div>
                                        </div>
                                    )}
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
    );
};

export default ContentView;
