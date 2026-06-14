const User = require('../models/User');

const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const { email, password } = req.body;
    if (email) {
      user.email = email;
    }
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
      }
      user.password = password; 
    }
    const updatedUser = await user.save();
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser._id,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    // Validate the role
    const validRoles = ['USER', 'MANAGER', 'ADMIN'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        error: `Please provide a valid role: ${validRoles.join(', ')}`
      });
    }
    const user = await User.findById(req.user._id);
    // Prevent admin from changing their own role (good security practice)
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: 'Administrators cannot change their own role'
      });
    }
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    targetUser.role = role;
    await targetUser.save();
    res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfully`,
      data: {
        id: targetUser._id,
        email: targetUser.email,
        role: targetUser.role
      }
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
  updateUserRole
};