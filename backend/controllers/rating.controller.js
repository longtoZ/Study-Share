import RatingService from "../services/rating.service.js";
import Rating from "../models/rating.model.js";

class RatingController {
    static async createRating(req, res) {
        const { ratingData } = req.body;

        try {
            const rating = await RatingService.createRating(ratingData);
            res.status(201).json({ message: "Rating created successfully", rating });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getMaterialRating(req, res) {
        const { material_id } = req.params;

        try {
            const rating = await Rating.getMaterialRating(material_id);
            res.status(200).json({ message: "Material rating retrieved successfully", rating });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }
}

export default RatingController;
