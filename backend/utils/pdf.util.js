import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs';
import path from 'path';

// pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.mjs';

class PDFUtils {
    static async getTotalPages(filePath) {
        try {
            const loadingTask = pdfjsLib.getDocument(filePath);
            const pdf = await loadingTask.promise;
            return pdf.numPages;
        } catch (error) {
            console.error('Error getting total pages:', error);
            throw new Error('Failed to get total pages from PDF');
        }
    }

    static checkFileExistsWithRegex(directoryPath, regexPattern) {
        const matchedFiles = [];

        try {
            const files = fs.readdirSync(directoryPath);
            const regex = new RegExp(regexPattern);

            for (const file of files) {
                if (regex.test(file)) {
                    // Construct the full path to confirm it's a file, not a directory
                    const fullPath = path.join(directoryPath, file);
                    if (fs.statSync(fullPath).isFile()) {
                        console.log(`File matching regex "${regexPattern}" found: ${fullPath}`);
                        matchedFiles.push(fullPath);
                    }
                }
            }
            if (matchedFiles.length === 0) {
                console.log(`No file matching regex "${regexPattern}" found in "${directoryPath}".`);
            }
            return matchedFiles; // Return all matching files
        } catch (error) {
            console.error(`Error checking files: ${error.message}`);
            return [];
        }
    }
}

export default PDFUtils;
