/**
 * File Storage Service
 * Handles file serving for uploaded resumes
 */
class FileStorageService {
  /**
   * Format the URL for accessing uploaded file
   * @param {Object} req - Express request object
   * @param {Object} file - Multer file object
   * @returns {string} public URL or path
   */
  getFileUrl(req, file) {
    if (!file) return '';
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return `${baseUrl}/uploads/${file.filename}`;
  }
}

module.exports = new FileStorageService();
