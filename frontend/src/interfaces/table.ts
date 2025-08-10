interface Subject {
    subject_id: string;
    name: string;
    description: string;
}

interface Material {
    material_id: string;
    name: string;
    description: string;
    subject_id: string;
    file_url: string;
    size: number;
    file_type: string;
    num_page: number;
    upload_date: Date;
    download_count: number;
    total_rating: number;
    rating_count: number;
    view_count: number;
    is_paid: boolean;
    price: number;
    user_id: string;
    lesson_id: string;
}

interface User {
    user_id: string;
    email: string;
    full_name: string;
    gender: string;
    bio: string;
    profile_picture_url: string;
    background_image_url: string;
    date_of_birth: Date;
    address: string;
}

export type { Subject, Material, User };
