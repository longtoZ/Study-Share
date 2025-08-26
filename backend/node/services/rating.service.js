import Rating from "../models/rating.model.js";

class RatingService {
    static async createRating(data) {
        const { user_id, material_id, star_level, rated_date } = data;
        const rating = await Rating.rateMaterial(material_id, star_level);
        await Rating.createRatingLog(user_id, material_id, star_level, rated_date);
        return rating;
    }

    static async checkUserRating(material_id, user_id) {
        const rating = await Rating.checkUserRating(material_id, user_id);

        if (rating) {
            return true;
        }
        return false;
    }
}

export default RatingService;
