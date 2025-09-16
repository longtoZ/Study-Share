import { useEffect, useState } from 'react';
import { rateMaterial, getMaterialRating, checkUserRating } from '@/services/ratingService';

import type { Rating } from '@/interfaces/table.d';

import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarIcon from '@mui/icons-material/Star';


interface RatingData {
    [key: number]: number; // star level -> number of users
}

const RatingCard = ({ materialId } : { materialId: string | undefined}) => {
    const [ratingData, setRatingData] = useState<RatingData | null>(null);
    const [totalRatings, setTotalRatings] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [hasRated, setHasRated] = useState(false);

    useEffect(() => {
        if (!materialId) return;

        const fetchRatingData = async () => {
            try {
                const data = await getMaterialRating(materialId);

                const ratingData: RatingData = data.reduce((acc: RatingData, rating: any) => {
                    acc[rating.star_level] = rating.count;
                    return acc;
                }, {});
                console.log('Rating data:', ratingData);

                const totalRatings = Object.values(ratingData).reduce((sum, count) => sum + count, 0);
                const averageRating = totalRatings > 0
                    ? Object.entries(ratingData).reduce((sum, [star, count]) => sum + (parseInt(star) * count), 0) / totalRatings
                    : 0;
                
                const hasRated = await checkUserRating(materialId, localStorage.getItem('user_id') || '');

                setRatingData(ratingData);
                setTotalRatings(totalRatings);
                setAverageRating(averageRating);
                setHasRated(hasRated);
            } catch (error) {
                console.error('Error fetching material rating:', error);
            }
        };

        fetchRatingData();
    }, [materialId]);

    const onRate = async (star_level: number) => {
        if (!materialId) return;

        const ratingData: Rating = {
            material_id: materialId,
            user_id: localStorage.getItem('user_id') || '',
            star_level: star_level,
            rated_date: new Date()
        }

        try {
            await rateMaterial(ratingData);
        } catch (error) {
            console.error('Error rating material:', error);
        }
    };

    const renderStars = (rating: number, interactive: boolean = false) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                stars.push(
                    <StarIcon
                        key={i}
                        className={`${interactive ? 'cursor-pointer hover:scale-110' : ''} text-yellow-400`}
                        onClick={interactive ? () => onRate(i) : undefined}
                        onMouseEnter={interactive ? () => setHoverRating(i) : undefined}
                        onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
                    />
                );
            } else if (rating >= i - 0.5) {
                stars.push(
                    <StarHalfIcon
                        key={i}
                        className={`${interactive ? 'cursor-pointer hover:scale-110' : ''} text-yellow-400`}
                        onClick={interactive ? () => onRate(i) : undefined}
                        onMouseEnter={interactive ? () => setHoverRating(i) : undefined}
                        onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
                    />
                );
            } else {
                stars.push(
                    <StarOutlineIcon
                        key={i}
                        className={`${interactive ? 'cursor-pointer hover:scale-110' : ''} text-gray-300`}
                        onClick={interactive ? () => onRate(i) : undefined}
                        onMouseEnter={interactive ? () => setHoverRating(i) : undefined}
                        onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
                    />
                );
            }
        }
        return stars;
    };

    const getBarWidth = (starLevel: number) => {
        const count = ratingData ? ratingData[starLevel] || 0 : 0;
        return totalRatings > 0 ? (count / totalRatings) * 100 : 0;
    };

    return (
        <div className="bg-white rounded-3xl card-shadow p-6">
            <div className="flex gap-8">
                {/* Left side - Average Rating */}
                <div className="flex flex-col items-center justify-center min-w-[200px]">
                    <div className="text-6xl font-bold text-gray-800 mb-2">
                        {averageRating.toFixed(1)}
                    </div>
                    <div className="flex gap-1 mb-2">
                        {renderStars(averageRating)}
                    </div>
                    <div className="text-sm text-gray-600">
                        Based on {totalRatings} reviews
                    </div>
                </div>

                {/* Right side - Rating Distribution */}
                <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>
                    <div className="space-y-2 mb-6">
                        {[5, 4, 3, 2, 1].map((starLevel) => (
                            <div key={starLevel} className="flex items-center gap-3">
                                <div className="flex items-center gap-1 min-w-[60px]">
                                    <span className="text-sm">{starLevel}</span>
                                    <StarIcon className="text-yellow-400 w-4 h-4" />
                                </div>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${getBarWidth(starLevel)}%` }}
                                    />
                                </div>
                                <span className="text-sm text-gray-600 min-w-[30px]">
                                    {ratingData ? ratingData[starLevel] || 0 : 0}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* User Rating Section */}
                    {!hasRated && (
                        <div className="border-t pt-4">
                            <h4 className="text-md font-medium mb-3">Rate this material</h4>
                            <div className="flex gap-1">
                                {renderStars(hoverRating || 0, true)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RatingCard;
