import { asyncHandler, httpResponse, httpError, responseMessage, logger } from '../../../shared/index.js';
import {
  getCategoriesService,
  createSubcategoryService,
  addLibraryContentService,
  getCategoryLibraryService,
  getStudentTopicAccessService,
  manageStudentTopicAccessService,
  getMyLibraryService,
  updateSubcategoryService,
  updateLibraryContentService,
  deleteLibraryContentService,
  deleteSubcategoryService,
} from '../services/library.service.js';

const getCategories = asyncHandler(async (req, res) => {
  try {
    const result = await getCategoriesService();
    logger.info('Categories fetched', { requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Categories fetched'), result);
  } catch (error) {
    logger.error('Get categories failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const createSubcategory = asyncHandler(async (req, res) => {
  try {
    const result = await createSubcategoryService(req.body);
    logger.info('Subcategory created', { name: req.body.name, requestId: req.requestId });
    return httpResponse(req, res, 201, responseMessage.custom('Subcategory created'), result);
  } catch (error) {
    logger.error('Create subcategory failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const addLibraryContent = asyncHandler(async (req, res) => {
  try {
    const result = await addLibraryContentService(req.body);
    logger.info('Library content added', { title: req.body.title, requestId: req.requestId });
    return httpResponse(req, res, 201, responseMessage.custom('Content added to library'), result);
  } catch (error) {
    logger.error('Add library content failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const getCategoryLibrary = asyncHandler(async (req, res) => {
  try {
    const result = await getCategoryLibraryService(req.params.categoryId);
    logger.info('Category library fetched', { categoryId: req.params.categoryId, requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Library fetched'), result);
  } catch (error) {
    logger.error('Get category library failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const getStudentTopicAccess = asyncHandler(async (req, res) => {
  try {
    const result = await getStudentTopicAccessService(req.params.studentId);
    logger.info('Student topic access fetched', { studentId: req.params.studentId, requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Student access fetched'), result);
  } catch (error) {
    logger.error('Get student topic access failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const manageStudentTopicAccess = asyncHandler(async (req, res) => {
  try {
    const { studentId, topicId, action } = req.body;
    await manageStudentTopicAccessService(studentId, topicId, action);
    logger.info('Student topic access updated', { studentId, topicId, action, requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Access updated'), null);
  } catch (error) {
    logger.error('Manage student topic access failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const getMyLibrary = asyncHandler(async (req, res) => {
  try {
    const result = await getMyLibraryService(req.user._id);
    logger.info('Student library fetched', { studentId: req.user._id, requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Your library fetched'), result);
  } catch (error) {
    logger.error('Get my library failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const updateSubcategory = asyncHandler(async (req, res) => {
  try {
    const result = await updateSubcategoryService(req.params.id, req.body.name);
    logger.info('Subcategory updated', { id: req.params.id, requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Subcategory updated'), result);
  } catch (error) {
    logger.error('Update subcategory failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const deleteSubcategory = asyncHandler(async (req, res) => {
  try {
    await deleteSubcategoryService(req.params.id);
    logger.info('Subcategory deleted', { id: req.params.id, requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Subcategory deleted'), null);
  } catch (error) {
    logger.error('Delete subcategory failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const updateLibraryContent = asyncHandler(async (req, res) => {
  try {
    const result = await updateLibraryContentService(req.params.id, req.body);
    logger.info('Library content updated', { id: req.params.id, requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Content updated'), result);
  } catch (error) {
    logger.error('Update library content failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const deleteLibraryContent = asyncHandler(async (req, res) => {
  try {
    await deleteLibraryContentService(req.params.id);
    logger.info('Library content deleted', { id: req.params.id, requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Content deleted'), null);
  } catch (error) {
    logger.error('Delete library content failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

export {
  getCategories,
  createSubcategory,
  addLibraryContent,
  getCategoryLibrary,
  getStudentTopicAccess,
  manageStudentTopicAccess,
  getMyLibrary,
  updateSubcategory,
  deleteSubcategory,
  updateLibraryContent,
  deleteLibraryContent,
};
