import Content from '../../../models/content.model.js';
import ContentLog from '../../../models/contentLog.model.js';
import User from '../../../models/user.model.js';

const getAllContentService = async () => {
  return await Content.find({ isActive: true }).lean();
};

const getMyContentService = async (studentId) => {
  return await Content.find({
    isActive: true,
    grantedStudents: studentId
  }).select('-grantedStudents -driveId').lean();
};

const createContentService = async (data) => {
  const existing = await Content.findOne({ driveId: data.driveId });
  if (existing) {
    const error = new Error('Content with this Drive ID already exists');
    error.statusCode = 400;
    throw error;
  }

  const content = await Content.create(data);
  return content;
};

const manageAccessService = async (contentId, data) => {
  const content = await Content.findById(contentId);
  if (!content) {
    const error = new Error('Content not found');
    error.statusCode = 404;
    throw error;
  }

  const student = await User.findById(data.studentId);
  if (!student) {
    const error = new Error('Student not found');
    error.statusCode = 404;
    throw error;
  }

  const hasAccess = content.grantedStudents.includes(student._id);

  if (data.action === 'grant') {
    if (!hasAccess) { content.grantedStudents.push(student._id); }
  } else if (data.action === 'revoke') {
    if (hasAccess) {
      content.grantedStudents = content.grantedStudents.filter(
        id => id.toString() !== student._id.toString()
      );
    }
  }

  await content.save();
  return content;
};

const logContentAccess = async (studentId, contentId, ip, device) => {
  await ContentLog.create({
    student: studentId,
    content: contentId,
    ip,
    device
  });
};

export { getAllContentService, getMyContentService, createContentService, manageAccessService, logContentAccess };
