
import { useNavigate } from "react-router-dom";
import {
    FileDownloadOutlined as FileDownloadOutlinedIcon,
    Star as StarIcon,
    ShareOutlined as ShareOutlinedIcon,
    DateRangeOutlined as DateRangeOutlinedIcon,
    SettingsOutlined as SettingsOutlinedIcon,
    MonetizationOnOutlined as MonetizationOnOutlinedIcon,
} from "@mui/icons-material";
import AddLessonCard from "./AddLessonCard";
import { makePayment } from "@/services/paymentService";
import { getMaterialUrl } from "@services/materialService";

interface HeaderSectionProps {
    material: any;
    user: any;
    avgRating: number;
    isMaterialPaid: boolean;
    userId: string;
    isAuthor: boolean;
}

const HeaderSection = ({ material, user, avgRating, isMaterialPaid, userId, isAuthor }: HeaderSectionProps) => {
    const navigate = useNavigate();

    const downloadMaterial = async () => {
        if (!material) {
            console.error("No material loaded");
            return;
        }

        try {
            const fileUrl = await getMaterialUrl(material.material_id);
            
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            
            const blobUrl = window.URL.createObjectURL(blob);
            
            const anchor = document.createElement('a');
            anchor.href = blobUrl;
            anchor.download = material.name;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Error downloading material:", error);
        }
    }

    return (
        <>
            {isAuthor && (
                <div className="mb-6 flex justify-end">
                    <button 
                        className="flex items-center gap-2 rounded-xl py-3 px-4 cursor-pointer bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-amber-300 hover:opacity-85 transition-opacity duration-100 ease"
                        onClick={() => navigate(`/material/${material?.material_id}/edit`)}>
                        <SettingsOutlinedIcon/>
                        <h3>Edit Material</h3>
                    </button>
                </div>
            )}
            <div className="bg-white rounded-3xl card-shadow p-12">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-2">
                            {material?.name}
                        </h1>
                        <div className="flex items-center gap-4 text-gray-600 mt-2">
                            <img
                                referrerPolicy="no-referrer"
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
                            className={`flex items-center gap-2 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg
                     bg-gradient-to-r ${isMaterialPaid && userId !== user?.user_id ? 'from-lime-500 to-green-600 shadow-lime-300' : 'from-blue-500 to-indigo-600 shadow-blue-300'} focus:outline-none focus:ring-4 ${isMaterialPaid && userId !== user?.user_id ? 'focus:ring-green-300' : 'focus:ring-blue-300'} w-full sm:w-auto justify-center cursor-pointer`}
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
        </>
    );
};

export default HeaderSection;
