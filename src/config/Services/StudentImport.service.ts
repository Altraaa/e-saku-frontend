import { ApiRequest } from './Api.service';

interface ImportStudentResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export class StudentImportService {

  static async importStudents(
    file: File,
    classId: number,
    onProgress?: (progress: number) => void
  ): Promise<ImportStudentResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('classId', classId.toString());

      const response = await ApiRequest({
        url: 'import/students',
        method: 'POST',
        body: formData,
        isMultipart: true,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percent > 90 ? 90 : percent);
          }
        }
      });

      return {
        success: true,
        message: 'Data siswa berhasil diimport',
        data: response.data
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file. Please try again.';
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  static validateFile(file: File): { isValid: boolean; error?: string } {
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    const validExtensions = ['.xls', '.xlsx'];
    const fileExtension = file.name
      .toLowerCase()
      .slice(file.name.lastIndexOf('.'));

    if (
      !validTypes.includes(file.type) &&
      !validExtensions.includes(fileExtension)
    ) {
      return {
        isValid: false,
        error: 'Please select a valid Excel file (.xls or .xlsx)'
      };
    }

    if (file.size > 10 * 1024 * 1024) {
      return {
        isValid: false,
        error: 'File size must be less than 10MB'
      };
    }

    return { isValid: true };
  }
}