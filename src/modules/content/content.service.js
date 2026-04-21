import Content from '../../models/content.model.js';
import ContentLog from '../../models/contentLog.model.js';
import User from '../../models/user.model.js';
import { AppError } from '../../shared/index.js';
import config from '../../config/index.js';

const getMyContentService = async (studentId) => {
  return await Content.find({
    isActive: true,
    grantedStudents: studentId
  }).select('-grantedStudents -driveId').lean(); // Never return driveId directly
};

const createContentService = async (data) => {
  const existing = await Content.findOne({ driveId: data.driveId });
  if (existing) {
    throw new AppError('Content with this Drive ID already exists', 400);
  }

  const content = await Content.create(data);
  return content;
};

const manageAccessService = async (contentId, data) => {
  const content = await Content.findById(contentId);
  if (!content) throw new AppError('Content not found', 404);

  const student = await User.findById(data.studentId);
  if (!student) throw new AppError('Student not found', 404);

  const hasAccess = content.grantedStudents.includes(student._id);

  if (data.action === 'grant') {
    if (!hasAccess) content.grantedStudents.push(student._id);
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

// Log generic access
const logContentAccess = async (studentId, contentId, ip, device) => {
  await ContentLog.create({
    student: studentId,
    content: contentId,
    ip,
    device
  });
};

export { getMyContentService, createContentService, manageAccessService, logContentAccess };
