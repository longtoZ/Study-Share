
import { useState, useEffect, useRef } from "react";
import { getMaterialPage } from "@services/materialService";

interface IImagePage {
    pageNumber: number;
    imageUrl: string;
}

export const useMaterialContent = (materialId: string | undefined, totalPages: number, isMaterialPaid: boolean) => {
    const [imagePages, setImagePages] = useState<IImagePage[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [imageWidth, setImageWidth] = useState(0);
    const scrollViewRef = useRef<HTMLDivElement>(null);

    const getImagePage = async (pageNumber: number) => {
        if (!materialId) return;
        const imageUrl = await getMaterialPage(materialId, pageNumber, isMaterialPaid);

        if (!imageUrl) return;

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
        if (scrollViewRef.current) {
            const elementWidth = scrollViewRef.current.offsetWidth;
            setImageWidth(elementWidth);
        }
    }, []);

    useEffect(() => {
        if (!materialId || !currentPage) return;

        const getImagePageAsync = async (page: number) => {
            await getImagePage(page);
        };
        getImagePageAsync(currentPage);
    }, [currentPage, materialId]);

    const handleOnScroll = (e: any) => {
        const scrollTop = e.target.scrollTop;
        const scrollHeight = e.target.scrollHeight;
        const clientHeight = e.target.clientHeight;

        if (
            scrollTop + clientHeight >= scrollHeight - 20 &&
            currentPage < totalPages
        ) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handleZoomIn = () => {
        if (scrollViewRef.current) {
            const newWidth = imageWidth * 1.2;
            setImageWidth(newWidth);
        }
    };

    const handleZoomOut = () => {
        if (scrollViewRef.current) {
            const newWidth = imageWidth * 0.8;
            setImageWidth(newWidth);
        }
    };

    return {
        imagePages,
        scrollViewRef,
        handleOnScroll,
        handleZoomIn,
        handleZoomOut,
        imageWidth
    };
};
