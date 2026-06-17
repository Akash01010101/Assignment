const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const asyncHandler = require('../../middleware/asyncHandler');
const authMiddleware = require('../../middleware/authMiddleware');
const requireAdmin = require('../../middleware/requireAdmin');
const ApiError = require('../../utils/ApiError');

// Apply admin protection to all routes in this file
router.use(authMiddleware, requireAdmin);

// @route   GET /api/admin/business-applications
// @desc    Get all business applications
// @access  Private/Admin
router.get(
  '/business-applications',
  asyncHandler(async (req, res) => {
    // Find all users who have a business profile status other than 'none'
    const applications = await User.find({
      'businessProfile.status': { $in: ['pending', 'approved', 'rejected'] }
    }).select('-passwordHash').sort({ createdAt: -1 });

    res.json(applications);
  })
);

// @route   PUT /api/admin/business-applications/:id/approve
// @desc    Approve business application
// @access  Private/Admin
router.put(
  '/business-applications/:id/approve',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (user.businessProfile.status !== 'pending') {
      throw new ApiError(400, 'Only pending applications can be approved');
    }

    user.businessProfile.status = 'approved';
    user.role = 'organizer'; // Upgrade role

    await user.save();

    res.json(user);
  })
);

// @route   PUT /api/admin/business-applications/:id/reject
// @desc    Reject business application
// @access  Private/Admin
router.put(
  '/business-applications/:id/reject',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (user.businessProfile.status !== 'pending') {
      throw new ApiError(400, 'Only pending applications can be rejected');
    }

    user.businessProfile.status = 'rejected';

    await user.save();

    res.json(user);
  })
);

module.exports = router;
