import { ENDPOINTS } from "@/constants/endpoints";

const GET_SUBJECT_ENDPOINT = ENDPOINTS.GET_SUBJECT;

const getSubject = async (subjectId: string) => {
    const getSubjectUrl = GET_SUBJECT_ENDPOINT.replace('subject-id', subjectId);

    try {
        const response = await fetch(getSubjectUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch subject');
        }
        const data = await response.json();
        return data.subject;
    } catch (error) {
        console.error('Error fetching subject:', error);
    }
    return null;
};

export { getSubject };