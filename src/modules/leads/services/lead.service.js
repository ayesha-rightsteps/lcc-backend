import Lead from '../../../models/lead.model.js';

const createLeadService = async (data) => {
  return await Lead.create(data);
};

const getLeadsService = async (query = {}) => {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.branch) filter.branch = query.branch;
  return await Lead.find(filter).sort('-createdAt').lean();
};

const updateLeadStatusService = async (leadId, status) => {
  const lead = await Lead.findByIdAndUpdate(leadId, { status }, { new: true });
  if (!lead) {
    const error = new Error('Lead not found');
    error.statusCode = 404;
    throw error;
  }
  return lead;
};

export { createLeadService, getLeadsService, updateLeadStatusService };
