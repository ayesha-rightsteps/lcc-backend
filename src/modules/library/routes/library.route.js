import express from 'express';
import { authenticate, isAdmin, validateRequest } from '../../../shared/index.js';
import {
  createSubcategorySchema,
  addLibraryContentSchema,
  manageAccessSchema,
  updateSubcategorySchema,
  updateLibraryContentSchema,
} from '../validations/library.schema.js';
import {
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
} from '../controllers/library.controller.js';

const router = express.Router();

router.get('/my', authenticate, getMyLibrary);

router.get('/categories', authenticate, isAdmin, getCategories);
router.get('/categories/:categoryId', authenticate, isAdmin, getCategoryLibrary);
router.post('/subcategories', authenticate, isAdmin, validateRequest(createSubcategorySchema), createSubcategory);
router.post('/subcategories/:id/update', authenticate, isAdmin, validateRequest(updateSubcategorySchema), updateSubcategory);
router.post('/subcategories/:id/delete', authenticate, isAdmin, deleteSubcategory);
router.post('/content', authenticate, isAdmin, validateRequest(addLibraryContentSchema), addLibraryContent);
router.post('/content/:id/update', authenticate, isAdmin, validateRequest(updateLibraryContentSchema), updateLibraryContent);
router.post('/content/:id/delete', authenticate, isAdmin, deleteLibraryContent);

router.get('/access/:studentId', authenticate, isAdmin, getStudentTopicAccess);
router.post('/access', authenticate, isAdmin, validateRequest(manageAccessSchema), manageStudentTopicAccess);

export { router as libraryRoutes };
