interface User {
	userId: string,
	fullName: string,
	gender: string,
	address: string,
	profilePictureUrl: string,
	backgroundImageUrl: string,
	createdDate: string,
	description: string,
	statistics: Statistic
}

interface Statistic {
	totalMaterials: number
	totalLessons: number
	totalDownloads: number
	averageRating: number
}

interface Material {
	materialId: string,
	name: string,
	description: string,
	subject: string,
	uploadDate: string,
	downloadCount: number,
	rating: number,
	fileType: string,
}

interface Lesson {
  lessonId: string,
  name: string,
  description: string
  createdDate: string
  materialCount: number
  isPublic: boolean
}

export type { User, Statistic, Material, Lesson};