import https from 'https';
import Content from '../../models/content.model.js';
import { AppError, asyncHandler, httpResponse, responseMessage } from '../../shared/index.js';
import { getMyContentService, createContentService, manageAccessService, logContentAccess } from './content.service.js';

const getMyContent = asyncHandler(async (req, res) => {
  const result = await getMyContentService(req.user._id);
  return httpResponse(req, res, 200, responseMessage.custom('Content fetched successfully'), result);
});

const createContent = asyncHandler(async (req, res) => {
  const result = await createContentService(req.body);
  return httpResponse(req, res, 201, responseMessage.custom('Content added to library'), result);
});

const manageAccess = asyncHandler(async (req, res) => {
  const result = await manageAccessService(req.params.contentId, req.body);
  return httpResponse(req, res, 200, responseMessage.custom('Content access updated'), result);
});

const streamContent = asyncHandler(async (req, res) => {
  const { contentId } = req.params;
  const studentId = req.user._id;

  const content = await Content.findById(contentId);
  if (!content || !content.isActive) {
    throw new AppError('Content not found or unavailable', 404);
  }

  // Double check authorization
  if (req.user.role !== 'admin' && !content.grantedStudents.includes(studentId)) {
    throw new AppError('You do not have access to this content', 403);
  }

  // Validate student expiration if student
  if (req.user.role === 'student' && new Date() > new Date(req.user.validityDate)) {
    throw new AppError('Your course validity has expired. Content blocked.', 403);
  }

  // Log the access asynchronously
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
  const device = req.headers['user-agent'] || 'Unknown';
  if (req.user.role === 'student') {
    logContentAccess(studentId, contentId, ip, device).catch(e => console.error(e));
  }

  // WARNING: Set GOOGLE_DRIVE_API_KEY in your env for this to work natively.
  // We use the REST API: https://www.googleapis.com/drive/v3/files/[FILEID]?alt=media&key=[API_KEY]
  const googleApiKey = process.env.GOOGLE_DRIVE_API_KEY;
  if (!googleApiKey) {
    throw new AppError('Google Drive Proxy is not configured (Missing API Key)', 500);
  }

  const driveUrl = \`https://www.googleapis.com/drive/v3/files/\${content.driveId}?alt=media&key=\${googleApiKey}\`;

  // We must handle range requests for video scrubbing to work correctly in HTML5 <video>
  const options = {
    method: 'GET',
    headers: {}
  };

  if (req.headers.range) {
    options.headers.Range = req.headers.range;
  }

  https.get(driveUrl, options, (googleRes) => {
    // Forward Google's headers down to the browser
    Object.keys(googleRes.headers).forEach((key) => {
      // Avoid forwarding connection headers which might block our pipe
      if (['connection', 'transfer-encoding'].includes(key.toLowerCase())) return;
      res.setHeader(key, googleRes.headers[key]);
    });

    res.status(googleRes.statusCode);
    
    // Pipe the data directly to the client
    googleRes.pipe(res);
  }).on('error', (err) => {
    throw new AppError('Failed to stream content from source', 500);
  });
});

export { getMyContent, createContent, manageAccess, streamContent };
