const TABLES = {
    USER: 'User',
    MATERIAL: 'Material',
    MATERIAL_PAGE: 'MaterialPage',
    MATERIAL_SUMMARY: 'MaterialSummary',
    LESSON: 'Lesson',
    SUBJECT: 'Subject',
    COMMENT: 'Comment',
    RATING: 'Rating',
    RATING_LOG: 'RatingLog',
    HISTORY: 'History',
    PAYMENT: 'Payment',
    UPVOTE: 'Upvote',
    TASK: 'Task',
};

const TEMP_FILE_PATH = './temp/files/';
const TEMP_IMAGE_PATH = './temp/images/';

const MAX_STAR_LEVEL = 5;

const PDF_TO_WEBP_URL = 'http://localhost:5000/convert/pdf-to-webp';
const DOCX_TO_WEBP_URL = 'http://localhost:5000/convert/docx-to-webp';

const REDIS_TTL = 900; // 15 minutes

export { TABLES, TEMP_FILE_PATH, TEMP_IMAGE_PATH, MAX_STAR_LEVEL, PDF_TO_WEBP_URL, DOCX_TO_WEBP_URL, REDIS_TTL };