import { asyncHandler, httpResponse, responseMessage } from '../../shared/index.js';
import { createStudentService, updateHeartbeatService, updateStudentStatusService, resetStudentPasswordService, updateIpsService } from './user.service.js';

const createStudent = asyncHandler(async (req, res) => {
  const result = await createStudentService(req.user._id, req.body);
  return httpResponse(req, res, 201, responseMessage.custom('Student onboarded successfully'), result);
});

export { createStudent };

const updateHeartbeat = asyncHandler(async (req, res) => {
  await updateHeartbeatService(req.user._id, req.body);
  return httpResponse(req, res, 200, responseMessage.custom('Heartbeat updated'), null);
});

const updateStudentStatus = asyncHandler(async (req, res) => {
  const result = await updateStudentStatusService(req.params.studentId, req.body);
  return httpResponse(req, res, 200, responseMessage.custom('Student status updated successfully'), result);
});

const resetStudentPassword = asyncHandler(async (req, res) => {
  const result = await resetStudentPasswordService(req.params.studentId);
  return httpResponse(req, res, 200, responseMessage.custom('Password reset and emailed to student'), result);
});

const updateIps = asyncHandler(async (req, res) => {
  await updateIpsService(req.params.studentId, req.body);
  return httpResponse(req, res, 200, responseMessage.custom('IP restrictions updated'), null);
});

export { updateHeartbeat, updateStudentStatus, resetStudentPassword, updateIps };
