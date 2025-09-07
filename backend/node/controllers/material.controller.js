import MaterialService from "../services/material.service.js";
import Material from "../models/material.model.js";
import crypto from "crypto";

class MaterialController {
    static async upload(req, res) {
        const file = req.file;
        const body = req.body;
        const { material_id, name, description, subject_id, file_url, size, file_type, num_page, upload_date, download_count, total_rating, rating_count, view_count, is_paid, price, user_id, lesson_id } = JSON.parse(body.metadata);

        const info = {
            material_id,
            name,
            description,
            subject_id,
            file_url: '',
            size,
            file_type,
            num_page,
            upload_date: new Date(),
            download_count: 0,
            total_rating: 0,
            rating_count: 0,
            view_count: 0,
            is_paid: is_paid,
            price: price,
            user_id,
            lesson_id
        };

        try {
            const { material } = await MaterialService.uploadFile(info, file);
            res.status(201).json({ message: 'Material uploaded successfully', material });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ message: 'Internal server error during file upload.' });
        }
    }

    static async getStatistics(req, res) {
        const { userId } = req.params;

        try {
            const statistics = await MaterialService.getStatistics(userId);
            res.status(200).json({ message: 'Statistics fetched successfully', statistics });
        } catch (error) {
            console.error('Error fetching statistics:', error);
            res.status(500).json({ message: 'Internal server error while fetching statistics.' });
        }
    }

    static async getMaterialsByUserId(req, res) {
        const { userId } = req.params;
        const { order, from, to } = req.query;

        try {
            const materials = await Material.getMaterialsByUserId(userId, order, from, to);
            res.status(200).json({ message: 'Materials fetched successfully', materials: Array.from(materials) });
        } catch (error) {
            console.error('Error fetching materials:', error);
            res.status(500).json({ message: 'Internal server error while fetching materials.' });
        }
    }

    static async getMaterialById(req, res) {
        const { materialId } = req.params;

        try {
            const material = await Material.getMaterialById(materialId);
            res.status(200).json({ message: 'Material fetched successfully', material });
        } catch (error) {
            console.error('Error fetching material:', error);
            res.status(500).json({ message: 'Internal server error while fetching material.' });
        }
    }

    static async getMaterialUrlById(req, res) {
        const { materialId } = req.params;

        try {
            const fileUrl = await Material.getMaterialUrlById(materialId);
            if (!fileUrl) {
                return res.status(404).json({ message: 'Material URL not found' });
            }
            res.status(200).json({ message: 'Material URL fetched successfully', fileUrl });
        } catch (error) {
            console.error('Error fetching material URL:', error);
            res.status(500).json({ message: 'Internal server error while fetching material URL.' });
        }
    }

    static async getMaterialPage(req, res) {
        const { materialId, page } = req.params;

        try {
            const { contentType, imgBuffer } = await MaterialService.getMaterialPage(materialId, page);

            const etag = crypto.createHash("md5").update(imgBuffer).digest("hex");

            res.set({
                "Cache-Control": "public, max-age=86400", // 1 day
                "ETag": etag,
                "Content-Type": contentType,
            });

            if (req.headers["if-none-match"] === etag) {
                return res.status(304).end();
            }

            res.send(imgBuffer);
        } catch (error) {
            console.error('Error fetching material page:', error);
            res.status(500).json({ message: 'Internal server error while fetching material page.' });
        }
    }

    static async updateMaterial(req, res) {
        const { materialId } = req.params;
        const userId = req.user.user_id;
        const { authorId, updatedData } = req.body;

        if (userId !== authorId) {
            return res.status(403).json({ message: 'Forbidden: You are not the author of this material.' });
        }

        try {
            const material = await Material.updateMaterial(materialId, updatedData);
            res.status(200).json({ message: 'Material updated successfully', material });
        } catch (error) {
            console.error('Error updating material:', error);
            res.status(500).json({ message: 'Internal server error while updating material.' });
        }
    }

    static async searchMaterial(req, res) {
        const { query } = req.query;
        const { filters } = req.body;

        try {
            const materials = await MaterialService.searchMaterial(query, filters);
            res.status(200).json({ message: 'Search results fetched successfully', materials });
        } catch (error) {
            console.error('Error fetching search results:', error);
            res.status(500).json({ message: 'Internal server error while fetching search results.' });
        }
    }

    static async deleteMaterial(req, res) {
        const { materialId } = req.params;
        const userId = req.user.user_id;
        const { authorId } = req.body;

        if (userId !== authorId) {
            return res.status(403).json({ message: 'Forbidden: You are not the author of this material.' });
        }

        try {
            const material = await Material.deleteMaterial(materialId);
            res.status(200).json({ message: 'Material deleted successfully', material });
        }
        catch (error) {
            console.error('Error deleting material:', error);
            res.status(500).json({ message: 'Internal server error while deleting material.' });
        } 
    }
}

export default MaterialController;