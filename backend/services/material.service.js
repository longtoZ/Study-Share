import Material from '../models/material.model.js';

class MaterialService {
    static async uploadFile(info, file) {
        const publicFileUrl = await Material.createFileUrl(info.user_id, file);

        info.file_url = publicFileUrl;
        const newMaterial = await Material.createData(info);

        return { material: newMaterial };
    }
}

export default MaterialService;