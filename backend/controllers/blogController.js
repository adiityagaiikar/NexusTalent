const Blog = require('../models/Blog');
const { blogPosts: defaultBlogPosts } = require('../data/defaultData');

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function calculateReadTime(content) {
  const words = String(content || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

async function ensureBlogs() {
  const count = await Blog.countDocuments();
  if (count === 0) {
    await Blog.insertMany(defaultBlogPosts);
  }
}

async function getBlogs(req, res, next) {
  try {
    await ensureBlogs();
    const blogs = await Blog.find({}, { title: 1, slug: 1, author: 1, tags: 1, image: 1, readTime: 1, content: 1, createdAt: 1 }).sort({ createdAt: -1 });

    return res.status(200).json({ message: 'Blogs fetched successfully', data: blogs });
  } catch (error) {
    console.error('getBlogs error:', error);
    return next(error);
  }
}

async function getBlogById(req, res, next) {
  try {
    await ensureBlogs();
    const blog = await Blog.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    return res.status(200).json({ message: 'Blog fetched successfully', data: blog });
  } catch (error) {
    console.error('getBlogById error:', error);
    return next(error);
  }
}

async function createBlog(req, res, next) {
  try {
    const { title, content, author, tags = [], image = '' } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({ message: 'title, content, and author are required' });
    }

    const blog = await Blog.create({
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      tags: Array.isArray(tags) ? tags : String(tags).split(',').map((tag) => tag.trim()).filter(Boolean),
      image: image.trim(),
      slug: slugify(title),
      readTime: calculateReadTime(content),
    });

    return res.status(201).json({ message: 'Blog created successfully', data: blog });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A blog with this slug already exists' });
    }

    console.error('createBlog error:', error);
    return next(error);
  }
}

async function deleteBlog(req, res, next) {
  try {
    const blog = await Blog.findOneAndDelete({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    return res.status(200).json({ message: 'Blog deleted successfully', data: blog });
  } catch (error) {
    console.error('deleteBlog error:', error);
    return next(error);
  }
}

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  deleteBlog,
};