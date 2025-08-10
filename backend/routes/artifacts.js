const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Artifact } = require('../models/index');
const { Tribe } = require('../models/index');
const { auth, optionalAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/artifacts
// @desc    Get all artifacts with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().isString().withMessage('Category must be a string'),
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
    const filter = { visibility: true };
    
    if (req.query.category) {
      filter.category = req.query.category;
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
        { name: { $regex: req.query.search, $options: 'i' } },
        { displayName: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    // Sort options
    let sort = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'name':
          sort = { name: 1 };
          break;
        case 'popular':
          sort = { viewCount: -1 };
          break;
        case 'featured':
          sort = { featured: -1, viewCount: -1 };
          break;
        case 'newest':
          sort = { createdAt: -1 };
          break;
        default:
          sort = { featured: -1, name: 1 };
      }
    } else {
      sort = { featured: -1, name: 1 };
    }

    const artifacts = await Artifact.find(filter)
      .populate('tribe', 'name displayName')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Artifact.countDocuments(filter);

    res.json({
      success: true,
      data: artifacts,
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
    console.error('Get artifacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching artifacts'
    });
  }
});

// @route   GET /api/artifacts/:id
// @desc    Get single artifact by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const artifact = await Artifact.findById(req.params.id)
      .populate('tribe', 'name displayName counties');
    
    if (!artifact) {
      return res.status(404).json({
        success: false,
        message: 'Artifact not found'
      });
    }

    // Check visibility
    if (!artifact.visibility && (!req.currentUser || !req.currentUser.isAdmin)) {
      return res.status(404).json({
        success: false,
        message: 'Artifact not found'
      });
    }

    // Increment view count and record user view
    const userId = req.currentUser?._id;
    await artifact.incrementViews(userId);

    // Get related artifacts from same tribe
    const relatedArtifacts = await Artifact.find({ 
      tribe: artifact.tribe._id,
      _id: { $ne: artifact._id },
      visibility: true 
    })
    .select('name displayName category media.primaryImage featured')
    .limit(4);

    res.json({
      success: true,
      data: {
        artifact,
        relatedArtifacts
      }
    });

  } catch (error) {
    console.error('Get artifact error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid artifact ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching artifact'
    });
  }
});

module.exports = router; 