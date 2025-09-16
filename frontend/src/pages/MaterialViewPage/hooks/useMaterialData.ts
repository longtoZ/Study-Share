
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMaterial } from "@services/materialService";
import { addEntry } from "@/services/historyService";
import { verifyUser } from '@services/authService';
import { v4 as uuidv4 } from 'uuid';
import { checkMaterialPayment } from "@/services/paymentService";
import type { History } from "@/interfaces/table.d";

export const useMaterialData = () => {
    const [material, setMaterial] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [isAuthor, setIsAuthor] = useState<boolean>(false);
    const [isMaterialPaid, setIsMaterialPaid] = useState<boolean>(false);
    const [avgRating, setAvgRating] = useState(0);
    const [subject, setSubject] = useState<string>("");
    const { materialId } = useParams();
    const userId = localStorage.getItem('user_id') || '';

    useEffect(() => {
        if (!materialId) return;

        const fetchData = async () => {
            const materialData = await getMaterial(materialId);
            const paymentData = await checkMaterialPayment(materialId);

            if (materialData) {
                setMaterial(materialData);
                setSubject(materialData.subject_name);
                setAvgRating(
                    materialData.total_rating / materialData.rating_count || 0
                );
                setUser({
                    full_name: materialData.user_name,
                    profile_picture_url: materialData.profile_picture_url,
                    user_id: materialData.user_id,
                    stripe_account_id: materialData.user_stripe_account_id
                });
                setIsMaterialPaid(paymentData && paymentData.status === 'paid' ? false : materialData.price > 0);
            }

            try {
                await verifyUser(materialData.user_id);
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
    }, [materialId]);

    return { material, user, isAuthor, isMaterialPaid, avgRating, subject, materialId, userId };
};
