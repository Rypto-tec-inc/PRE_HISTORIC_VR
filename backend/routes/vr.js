const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { VRExperience } = require('../models/index');
const { Tribe } = require('../models/index');
const { auth, optionalAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/vr
// @desc    Get all VR experiences with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().isString().withMessage('Category must be a string'),
  query('difficulty').optional().isString().withMessage('Difficulty must be a string'),
  query('tribe').optional().isString().withMessage('Tribe must be a string'),
  query('featured').optional().isBoolean().withMessage('Featured must be boolean'),
  query('search').optional().isString().withMessage('Search must be a string')
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { 
      status: 'Published',
      visibility: 'Public'
    };
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.difficulty) {
      filter.difficulty = req.query.difficulty;
    }
    
    if (req.query.tribe) {
      const tribe = await Tribe.findOne({ name: req.query.tribe });
      if (tribe) {
        filter.tribe = tribe._id;
      }
    }
    
    if (req.query.featured !== undefined) {
      filter.featured = req.query.featured === 'true';
    }

    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { 'educational.keyTopics': { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    // Sort options
    let sort = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'title':
          sort = { title: 1 };
          break;
        case 'popular':
          sort = { 'analytics.totalViews': -1 };
          break;
        case 'featured':
          sort = { featured: -1, 'analytics.totalViews': -1 };
          break;
        case 'newest':
          sort = { createdAt: -1 };
          break;
        case 'difficulty':
          sort = { difficulty: 1 };
          break;
        default:
          sort = { featured: -1, title: 1 };
      }
    } else {
      sort = { featured: -1, title: 1 };
    }

    const vrExperiences = await VRExperience.find(filter)
      .populate('tribe', 'name displayName')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-scene.aframeCode -__v'); // Exclude large A-Frame code from list

    const total = await VRExperience.countDocuments(filter);

    res.json({
      success: true,
      data: vrExperiences,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get VR experiences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching VR experiences'
    });
  }
});

// @route   GET /api/vr/:id
// @desc    Get single VR experience by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const vrExperience = await VRExperience.findById(req.params.id)
      .populate('tribe', 'name displayName counties')
      .populate('relatedExperiences', 'title description category difficulty');
    
    if (!vrExperience) {
      return res.status(404).json({
        success: false,
        message: 'VR experience not found'
      });
    }

    // Check visibility
    if (vrExperience.visibility !== 'Public' && (!req.currentUser || !req.currentUser.isAdmin)) {
      return res.status(404).json({
        success: false,
        message: 'VR experience not found'
      });
    }

    // Check status
    if (vrExperience.status !== 'Published' && (!req.currentUser || !req.currentUser.isAdmin)) {
      return res.status(404).json({
        success: false,
        message: 'VR experience not available'
      });
    }

    // Increment view count
    await vrExperience.incrementViews();

    // Get related experiences from same tribe or category
    const relatedExperiences = await VRExperience.find({ 
      $or: [
        { tribe: vrExperience.tribe?._id },
        { category: vrExperience.category }
      ],
      _id: { $ne: vrExperience._id },
      status: 'Published',
      visibility: 'Public'
    })
    .select('title description category difficulty userExperience.estimatedDuration analytics.totalViews')
    .limit(4);

    res.json({
      success: true,
      data: {
        vrExperience,
        relatedExperiences
      }
    });

  } catch (error) {
    console.error('Get VR experience error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid VR experience ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching VR experience'
    });
  }
});

// @route   POST /api/vr/:id/complete
// @desc    Record VR experience completion
// @access  Private
router.post('/:id/complete', [
  auth,
  body('timeSpent').optional().isInt({ min: 0 }).withMessage('Time spent must be a positive integer'),
  body('score').optional().isInt({ min: 0, max: 100 }).withMessage('Score must be between 0 and 100'),
  body('feedback').optional().trim().isLength({ max: 500 }).withMessage('Feedback must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const vrExperience = await VRExperience.findById(req.params.id);
    if (!vrExperience) {
      return res.status(404).json({
        success: false,
        message: 'VR experience not found'
      });
    }

    const { timeSpent = 0, score = 0, feedback = '' } = req.body;
    const userId = req.currentUser._id;

    // Record completion in user progress (handled by user routes)
    // Here we just update the VR experience analytics

    // Update average time spent
    const currentAvg = vrExperience.analytics.averageTimeSpent || 0;
    const currentViews = vrExperience.analytics.totalViews || 1;
    const newAvg = ((currentAvg * (currentViews - 1)) + timeSpent) / currentViews;
    vrExperience.analytics.averageTimeSpent = Math.round(newAvg);

    // Add user rating if provided
    if (score > 0) {
      await vrExperience.addRating(userId, Math.round(score / 20), feedback); // Convert 0-100 to 1-5 scale
    }

    await vrExperience.save();

    res.json({
      success: true,
      message: 'VR experience completion recorded',
      data: {
        experienceId: vrExperience._id,
        timeSpent,
        score,
        averageRating: vrExperience.averageRating
      }
    });

  } catch (error) {
    console.error('Record VR completion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while recording completion'
    });
  }
});

module.exports = router; 