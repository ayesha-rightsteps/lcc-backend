import https from 'https';
import Content from '../../../models/content.model.js';
import { asyncHandler, httpResponse, httpError, responseMessage, logger } from '../../../shared/index.js';
import {
  getAllContentService,
  getMyContentService,
  createContentService,
  manageAccessService,
  logContentAccess,
} from '../services/content.service.js';

const getAllContent = asyncHandler(async (req, res) => {
  try {
    const result = await getAllContentService();
    return httpResponse(req, res, 200, responseMessage.custom('Content library fetched successfully'), result);
  } catch (error) {
    logger.error('Get all content failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const getMyContent = asyncHandler(async (req, res) => {
  try {
    const result = await getMyContentService(req.user._id);
    return httpResponse(req, res, 200, responseMessage.custom('Content fetched successfully'), result);
  } catch (error) {
    logger.error('Get content failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const createContent = asyncHandler(async (req, res) => {
  try {
    const result = await createContentService(req.body);
    return httpResponse(req, res, 201, responseMessage.custom('Content added to library'), result);
  } catch (error) {
    logger.error('Create content failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const manageAccess = asyncHandler(async (req, res) => {
  try {
    const result = await manageAccessService(req.params.contentId, req.body);
    return httpResponse(req, res, 200, responseMessage.custom('Content access updated'), result);
  } catch (error) {
    logger.error('Manage access failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const streamContent = asyncHandler(async (req, res) => {
  try {
    const { contentId } = req.params;
    const studentId = req.user._id;

    const content = await Content.findById(contentId);
    if (!content || !content.isActive) {
      const error = new Error('Content not found or unavailable');
      error.statusCode = 404;
      throw error;
    }

    if (req.user.role !== 'admin' && !content.grantedStudents.includes(studentId)) {
      const error = new Error('You do not have access to this content');
      error.statusCode = 403;
      throw error;
    }

    if (req.user.role === 'student' && new Date() > new Date(req.user.validityDate)) {
      const error = new Error('Your course validity has expired. Content blocked.');
      error.statusCode = 403;
      throw error;
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
    const device = req.headers['user-agent'] || 'Unknown';
    if (req.user.role === 'student') {
      logContentAccess(studentId, contentId, ip, device).catch((_err) => {
        logger.warn('Content access log failed', { contentId });
      });
    }

    const googleApiKey = process.env.GOOGLE_DRIVE_API_KEY;
    if (!googleApiKey) {
      const error = new Error('Google Drive proxy is not configured');
      error.statusCode = 500;
      throw error;
    }

    const driveUrl = `https://www.googleapis.com/drive/v3/files/${content.driveId}?alt=media&key=${googleApiKey}`;

    const options = { method: 'GET', headers: {} };
    if (req.headers.range) {
      options.headers.Range = req.headers.range;
    }

    https.get(driveUrl, options, (googleRes) => {
      Object.keys(googleRes.headers).forEach((key) => {
        if (['connection', 'transfer-encoding'].includes(key.toLowerCase())) {
          return;
        }
        res.setHeader(key, googleRes.headers[key]);
      });
      res.status(googleRes.statusCode);
      googleRes.pipe(res);
    }).on('error', (err) => {
      logger.error('Stream content failed', { error: err.message, contentId });
      if (!res.headersSent) {
        const streamError = new Error('Failed to stream content from source');
        streamError.statusCode = 500;
        httpError(req, res, streamError, 500);
      }
    });
  } catch (error) {
    logger.error('Stream content failed', { error: error.message, requestId: req.requestId });
    httpError(req, res, error, error.statusCode || 500);
  }
});

export { getAllContent, getMyContent, createContent, manageAccess, streamContent };
