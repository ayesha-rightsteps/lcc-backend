import { asyncHandler, httpResponse, httpError, responseMessage, logger } from '../../../shared/index.js';
import { createLeadService, getLeadsService, updateLeadStatusService } from '../services/lead.service.js';

const createLead = asyncHandler(async (req, res) => {
  try {
    const result = await createLeadService(req.body);
    logger.info('Lead created', { leadId: result._id });
    return httpResponse(req, res, 201, responseMessage.custom('Your information has been submitted. We will contact you soon!'), result);
  } catch (error) {
    logger.error('Create lead failed', { error: error.message });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const getLeads = asyncHandler(async (req, res) => {
  try {
    const result = await getLeadsService(req.query);
    return httpResponse(req, res, 200, responseMessage.custom('Leads fetched successfully'), result);
  } catch (error) {
    logger.error('Get leads failed', { error: error.message });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const updateLeadStatus = asyncHandler(async (req, res) => {
  try {
    const result = await updateLeadStatusService(req.params.leadId, req.body.status);
    return httpResponse(req, res, 200, responseMessage.custom('Lead status updated'), result);
  } catch (error) {
    logger.error('Update lead status failed', { error: error.message });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

export { createLead, getLeads, updateLeadStatus };
