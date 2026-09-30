const Project = require('../models/Project');

// GET /api/projects
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, projects });
  } catch (err) {
    next(err);
  }
};

// GET /api/projects/:id
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

// POST /api/projects
const createProject = async (req, res, next) => {
  try {
    const { title, description, icon, status, startDate, endDate, team, tasks } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });

    const project = new Project({
      user: req.user._id,
      title,
      description,
      icon,
      status,
      startDate,
      endDate,
      team,
      tasks: tasks || [],
    });

    project.recalculateProgress();
    await project.save();

    res.status(201).json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

// PUT /api/projects/:id
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const fields = ['title', 'description', 'icon', 'status', 'startDate', 'endDate', 'team', 'tasks'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) project[f] = req.body[f];
    });

    project.recalculateProgress();
    await project.save();

    res.json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res, next) => {
  try {
    const removed = await Project.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!removed) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project removed' });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/projects/:id/tasks/:taskId
const toggleTask = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const task = project.tasks.find((t) => t.id === Number(req.params.taskId));
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    task.completed = !task.completed;
    project.recalculateProgress();
    await project.save();

    res.json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  toggleTask,
};