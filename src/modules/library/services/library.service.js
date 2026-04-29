import Category from '../../../models/category.model.js';
import Subcategory from '../../../models/subcategory.model.js';
import Topic, { TOPIC_NAMES } from '../../../models/topic.model.js';
import LibraryContent from '../../../models/libraryContent.model.js';
import StudentAccess from '../../../models/studentAccess.model.js';
import User from '../../../models/user.model.js';

const getCategoriesService = async () => {
  return await Category.find({ isActive: true }).select('name slug').lean();
};

const createSubcategoryService = async (data) => {
  const category = await Category.findById(data.categoryId);
  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  const existing = await Subcategory.findOne({
    name: data.name,
    category: category._id,
    isActive: true,
  });
  if (existing) {
    const error = new Error('Subcategory already exists in this category');
    error.statusCode = 400;
    throw error;
  }

  const subcategory = await Subcategory.create({ name: data.name, category: category._id });

  await Topic.insertMany(
    TOPIC_NAMES.map((name) => ({ name, subcategory: subcategory._id }))
  );

  return subcategory;
};

const addLibraryContentService = async (data) => {
  const topic = await Topic.findById(data.topicId);
  if (!topic) {
    const error = new Error('Topic not found');
    error.statusCode = 404;
    throw error;
  }

  return await LibraryContent.create({
    title: data.title,
    description: data.description || '',
    driveId: data.driveId,
    topic: topic._id,
  });
};

const buildCategoryTree = async (categoryId) => {
  const category = await Category.findById(categoryId).select('name slug').lean();
  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  const subcategories = await Subcategory.find({ category: categoryId, isActive: true })
    .select('name').lean();

  if (!subcategories.length) {
    return { category, subcategories: [] };
  }

  const subcategoryIds = subcategories.map((s) => s._id);

  const topics = await Topic.find({ subcategory: { $in: subcategoryIds }, isActive: true })
    .select('name subcategory').lean();

  const topicIds = topics.map((t) => t._id);

  const contents = await LibraryContent.find({ topic: { $in: topicIds }, isActive: true })
    .select('title description driveId topic').lean();

  const contentByTopic = contents.reduce((acc, c) => {
    const key = c.topic.toString();
    if (!acc[key]) { acc[key] = []; }
    acc[key].push(c);
    return acc;
  }, {});

  const topicsBySubcategory = topics.reduce((acc, t) => {
    const key = t.subcategory.toString();
    if (!acc[key]) { acc[key] = []; }
    acc[key].push({ ...t, content: contentByTopic[t._id.toString()] || [] });
    return acc;
  }, {});

  return {
    category,
    subcategories: subcategories.map((s) => ({
      ...s,
      topics: topicsBySubcategory[s._id.toString()] || [],
    })),
  };
};

const getCategoryLibraryService = async (categoryId) => {
  return await buildCategoryTree(categoryId);
};

const getStudentTopicAccessService = async (studentId) => {
  const student = await User.findById(studentId).select('category fullName').populate('category', 'name').lean();
  if (!student) {
    const error = new Error('Student not found');
    error.statusCode = 404;
    throw error;
  }

  if (!student.category) {
    return {
      student: { _id: student._id, fullName: student.fullName, category: null },
      subcategories: [],
    };
  }

  const [tree, accesses] = await Promise.all([
    buildCategoryTree(student.category._id),
    StudentAccess.find({ student: studentId, isActive: true }).select('topic').lean(),
  ]);

  const grantedTopicIds = new Set(accesses.map((a) => a.topic.toString()));

  const subcategoriesWithAccess = tree.subcategories.map((sub) => ({
    ...sub,
    topics: sub.topics.map((t) => ({
      ...t,
      hasAccess: grantedTopicIds.has(t._id.toString()),
    })),
  }));

  return {
    student: { _id: student._id, fullName: student.fullName, category: student.category },
    subcategories: subcategoriesWithAccess,
  };
};

const manageStudentTopicAccessService = async (studentId, topicId, action) => {
  const [student, topic] = await Promise.all([
    User.findById(studentId).select('_id').lean(),
    Topic.findById(topicId).select('_id').lean(),
  ]);

  if (!student) {
    const error = new Error('Student not found');
    error.statusCode = 404;
    throw error;
  }
  if (!topic) {
    const error = new Error('Topic not found');
    error.statusCode = 404;
    throw error;
  }

  if (action === 'grant') {
    await StudentAccess.findOneAndUpdate(
      { student: studentId, topic: topicId },
      { isActive: true },
      { upsert: true, new: true }
    );
  } else if (action === 'revoke') {
    await StudentAccess.findOneAndUpdate(
      { student: studentId, topic: topicId },
      { isActive: false }
    );
  }

  return null;
};

const getMyLibraryService = async (studentId) => {
  const [student, accesses] = await Promise.all([
    User.findById(studentId).select('category').populate('category', 'name').lean(),
    StudentAccess.find({ student: studentId, isActive: true }).select('topic').lean(),
  ]);

  if (!accesses.length) {
    return { category: student?.category || null, subcategories: [] };
  }

  const topicIds = accesses.map((a) => a.topic);

  const [topics, contents] = await Promise.all([
    Topic.find({ _id: { $in: topicIds }, isActive: true }).select('name subcategory').lean(),
    LibraryContent.find({ topic: { $in: topicIds }, isActive: true })
      .select('title description driveId topic').lean(),
  ]);

  if (!topics.length) {
    return { category: student?.category || null, subcategories: [] };
  }

  const subcategoryIds = [...new Set(topics.map((t) => t.subcategory.toString()))];

  const subcategories = await Subcategory.find({ _id: { $in: subcategoryIds }, isActive: true })
    .select('name').lean();

  const contentByTopic = contents.reduce((acc, c) => {
    const key = c.topic.toString();
    if (!acc[key]) { acc[key] = []; }
    acc[key].push(c);
    return acc;
  }, {});

  const topicsBySubcategory = topics.reduce((acc, t) => {
    const key = t.subcategory.toString();
    if (!acc[key]) { acc[key] = []; }
    acc[key].push({ ...t, content: contentByTopic[t._id.toString()] || [] });
    return acc;
  }, {});

  return {
    category: student?.category || null,
    subcategories: subcategories.map((s) => ({
      ...s,
      topics: topicsBySubcategory[s._id.toString()] || [],
    })),
  };
};

export {
  getCategoriesService,
  createSubcategoryService,
  addLibraryContentService,
  getCategoryLibraryService,
  getStudentTopicAccessService,
  manageStudentTopicAccessService,
  getMyLibraryService,
};
