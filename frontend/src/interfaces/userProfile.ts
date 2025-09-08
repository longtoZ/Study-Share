interface User {
	user_id: string,
	full_name: string,
	gender: string,
	address: string,
	profile_picture_url: string,
	background_image_url: string,
	created_date: string,
	bio: string,
	statistics: Statistic
}

interface Statistic {
	total_materials: number
	total_lessons: number
	total_downloads: number
	average_rating: number
}

interface Material {
	material_id: string,
	name: string,
	description: string,
	subject_id: string,
	upload_date: string,
	download_count: number,
	view_count: number,
	rating: number,
	user_id: string,
	file_type: string,
	price: number,
	is_paid: string
}

interface MaterialExtended extends Material {
	subject_name: string,
	user_name: string,
	profile_picture_url: string,
	background_image_url: string,
}

interface Lesson {
	user_id: string,
	lesson_id: string,
	name: string,
	description: string,
	created_date: string,
	material_count: number,
	is_public: boolean,
	view_count: number,
}

interface LessonExtended extends Lesson {
	user_name: string,
	profile_picture_url: string,
	background_image_url: string,
}

export type { User, Statistic, Material, MaterialExtended, Lesson, LessonExtended };