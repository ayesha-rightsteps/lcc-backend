import { asyncHandler, httpResponse, httpError, responseMessage, logger } from '../../../shared/index.js';
import {
  requestConsultationService,
  getMyConsultationsService,
  getAllConsultationsService,
  acceptConsultationService,
  rejectConsultationService,
  markCompletedService,
} from '../services/consultation.service.js';

const requestConsultation = asyncHandler(async (req, res) => {
  try {
    const result = await requestConsultationService(req.user._id, req.body);
    logger.info('Consultation requested', { userId: req.user._id, requestId: req.requestId });
    return httpResponse(req, res, 201, responseMessage.custom('Consultation requested'), result);
  } catch (error) {
    logger.error('Request consultation failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const getMyConsultations = asyncHandler(async (req, res) => {
  try {
    const result = await getMyConsultationsService(req.user._id);
    logger.info('My consultations fetched', { userId: req.user._id, requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Consultations fetched'), result);
  } catch (error) {
    logger.error('Get my consultations failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const getAllConsultations = asyncHandler(async (req, res) => {
  try {
    const result = await getAllConsultationsService(req.query);
    logger.info('All consultations fetched', { requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Consultations fetched'), result);
  } catch (error) {
    logger.error('Get all consultations failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const acceptConsultation = asyncHandler(async (req, res) => {
  try {
    const result = await acceptConsultationService(req.params.id, req.body);
    logger.info('Consultation accepted', { requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Consultation accepted and student notified'), result);
  } catch (error) {
    logger.error('Accept consultation failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const rejectConsultation = asyncHandler(async (req, res) => {
  try {
    const result = await rejectConsultationService(req.params.id, req.body);
    logger.info('Consultation rejected', { requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Consultation rejected and student notified'), result);
  } catch (error) {
    logger.error('Reject consultation failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const completeConsultation = asyncHandler(async (req, res) => {
  try {
    const result = await markCompletedService(req.params.id, req.body);
    logger.info('Consultation marked completed', { requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Consultation marked completed'), result);
  } catch (error) {
    logger.error('Complete consultation failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

export {
  requestConsultation,
  getMyConsultations,
  getAllConsultations,
  acceptConsultation,
  rejectConsultation,
  completeConsultation,
};
