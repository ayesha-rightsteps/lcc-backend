import { asyncHandler, httpResponse, httpError, responseMessage, logger } from '../../../shared/index.js';
import {
  getStudentsService,
  createStudentService,
  updateHeartbeatService,
  updateStudentStatusService,
  resetStudentPasswordService,
  updateIpsService,
} from '../services/user.service.js';

const getStudents = asyncHandler(async (req, res) => {
  try {
    const students = await getStudentsService();
    return httpResponse(req, res, 200, responseMessage.custom('Students fetched successfully'), students);
  } catch (error) {
    logger.error('Get students failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const createStudent = asyncHandler(async (req, res) => {
  try {
    const result = await createStudentService(req.user._id, req.body);
    logger.info('Student created', { adminId: req.user._id, requestId: req.requestId });
    return httpResponse(req, res, 201, responseMessage.custom('Student onboarded successfully'), result);
  } catch (error) {
    logger.error('Create student failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const updateHeartbeat = asyncHandler(async (req, res) => {
  try {
    await updateHeartbeatService(req.user._id, req.body);
    return httpResponse(req, res, 200, responseMessage.custom('Heartbeat updated'), null);
  } catch (error) {
    logger.error('Heartbeat update failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const updateStudentStatus = asyncHandler(async (req, res) => {
  try {
    const result = await updateStudentStatusService(req.params.studentId, req.body);
    logger.info('Student status updated', { studentId: req.params.studentId, requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Student status updated successfully'), result);
  } catch (error) {
    logger.error('Update student status failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const resetStudentPassword = asyncHandler(async (req, res) => {
  try {
    const result = await resetStudentPasswordService(req.params.studentId);
    logger.info('Student password reset', { studentId: req.params.studentId, requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Password reset and emailed to student'), result);
  } catch (error) {
    logger.error('Reset password failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const updateIps = asyncHandler(async (req, res) => {
  try {
    await updateIpsService(req.params.studentId, req.body);
    logger.info('Student IPs updated', { studentId: req.params.studentId, requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('IP restrictions updated'), null);
  } catch (error) {
    logger.error('Update IPs failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

export { getStudents, createStudent, updateHeartbeat, updateStudentStatus, resetStudentPassword, updateIps };
