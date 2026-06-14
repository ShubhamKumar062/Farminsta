const Project = require('../models/Project');
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({}).populate('owner', 'email role');
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: 'Please add a project title' });
    }
  
    const project = await Project.create({
      title,
      description,
      owner: req.user._id
    });
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
   
    if (req.user.role !== 'ADMIN' && project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this project. You do not own it.'
      });
    }

    const { title, description } = req.body;
    if (title) project.title = title;
    if (description) project.description = description;
    const updatedProject = await project.save();
    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    await Project.deleteOne({ _id: req.params.id });
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject
};
