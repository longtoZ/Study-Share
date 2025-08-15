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
	subject: string,
	upload_date: string,
	download_count: number,
	rating: number,
	file_type: string,
}

interface Lesson {
  lesson_id: string,
  name: string,
  description: string,
  created_date: string,
  material_count: number,
  is_public: boolean
}

export type { User, Statistic, Material, Lesson};