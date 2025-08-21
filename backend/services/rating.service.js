import Rating from "../models/rating.model.js";

class RatingService {
    static async createRating(data) {
        const { user_id, material_id, star_level, rated_date } = data;
        const rating = await Rating.rateMaterial(material_id, star_level);
        await Rating.createRatingLog(user_id, material_id, star_level, rated_date);
        return rating;
    }
}

export default RatingService;
