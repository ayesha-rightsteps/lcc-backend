import { z } from 'zod';

export const createSubcategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Subcategory name is required'),
    categoryId: z.string().min(1, 'Category is required'),
  }),
});

export const addLibraryContentSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title is required'),
    description: z.string().optional(),
    driveId: z.string().min(1, 'Drive ID is required'),
    topicId: z.string().min(1, 'Topic is required'),
  }),
});

export const updateSubcategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
  }),
});

export const updateLibraryContentSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title is required'),
    description: z.string().optional(),
    driveId: z.string().min(1, 'Drive ID is required'),
  }),
});

export const manageAccessSchema = z.object({
  body: z.object({
    studentId: z.string().min(1, 'Student is required'),
    topicId: z.string().min(1, 'Topic is required'),
    action: z.enum(['grant', 'revoke']),
  }),
});
