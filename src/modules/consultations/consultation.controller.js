import { asyncHandler, httpResponse, responseMessage } from '../../shared/index.js';
import {
  requestConsultationService, getMyConsultationsService,
  getAllConsultationsService, acceptConsultationService,
  rejectConsultationService, markCompletedService
} from './consultation.service.js';

const requestConsultation = asyncHandler(async (req, res) => {
  const result = await requestConsultationService(req.user._id, req.body);
  return httpResponse(req, res, 201, responseMessage.custom('Consultation requested'), result);
});

const getMyConsultations = asyncHandler(async (req, res) => {
  const result = await getMyConsultationsService(req.user._id);
  return httpResponse(req, res, 200, responseMessage.custom('Consultations fetched'), result);
});

const getAllConsultations = asyncHandler(async (req, res) => {
  const result = await getAllConsultationsService(req.query);
  return httpResponse(req, res, 200, responseMessage.custom('Consultations fetched'), result);
});

const acceptConsultation = asyncHandler(async (req, res) => {
  const result = await acceptConsultationService(req.params.id, req.body);
  return httpResponse(req, res, 200, responseMessage.custom('Consultation accepted and emailed'), result);
});

const rejectConsultation = asyncHandler(async (req, res) => {
  const result = await rejectConsultationService(req.params.id, req.body);
  return httpResponse(req, res, 200, responseMessage.custom('Consultation rejected and emailed'), result);
});

const completeConsultation = asyncHandler(async (req, res) => {
  const result = await markCompletedService(req.params.id, req.body);
  return httpResponse(req, res, 200, responseMessage.custom('Consultation marked completed'), result);
});

export { 
  requestConsultation, getMyConsultations, getAllConsultations, 
  acceptConsultation, rejectConsultation, completeConsultation 
};
