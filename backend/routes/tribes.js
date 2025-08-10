const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Tribe, Artifact, VRExperience } = require('../models/index');
const { auth, optionalAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tribes
// @desc    Get all tribes with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('county').optional().isString().withMessage('County must be a string'),
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
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter conditions for Sequelize
    const where = { visibility: true };

    if (req.query.county) {
      // For JSON field search in Sequelize SQLite
      const { Op } = require('sequelize');
      where.counties = {
        [Op.like]: `%${req.query.county}%`
      };
    }

    if (req.query.featured !== undefined) {
      where.featured = req.query.featured === 'true';
    }

    if (req.query.search) {
      const searchTerm = req.query.search;
      const { Op } = require('sequelize');
      where[Op.or] = [
        {
          name: {
            [Op.like]: `%${searchTerm}%`
          }
        },
        {
          displayName: {
            [Op.like]: `%${searchTerm}%`
          }
        },
        {
          description: {
            [Op.like]: `%${searchTerm}%`
          }
        }
      ];
    }

    // Build order array for Sequelize
    let order = [];
    if (req.query.sort === 'name') {
      order = [['name', 'ASC']];
    } else if (req.query.sort === 'population') {
      order = [['population', 'DESC']];
    } else {
      order = [['featured', 'DESC'], ['name', 'ASC']];
    }

    const { count, rows: tribes } = await Tribe.findAndCountAll({
      where,
      order,
      offset: skip,
      limit
    });

    // Calculate pagination
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      message: `${tribes.length} tribes retrieved successfully`,
      data: tribes,
      pagination: {
        currentPage: page,
        totalPages,
        totalResults: count,
        resultsPerPage: limit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null
      }
    });

  } catch (error) {
    console.error('Get tribes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tribes'
    });
  }
});

// @route   GET /api/tribes/:id
// @desc    Get single tribe by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const tribe = await Tribe.findById(req.params.id);
    
    if (!tribe) {
      return res.status(404).json({
        success: false,
        message: 'Tribe not found'
      });
    }

    // Check visibility
    if (!tribe.visibility && (!req.currentUser || !req.currentUser.isAdmin)) {
      return res.status(404).json({
        success: false,
        message: 'Tribe not found'
      });
    }

    // Increment view count
    await tribe.incrementViews();

    // Get related artifacts
    const artifacts = await Artifact.find({ 
      tribe: tribe._id, 
      visibility: true 
    })
    .select('name displayName category media.primaryImage featured')
    .limit(6);

    // Get related VR experiences
    const vrExperiences = await VRExperience.find({ 
      tribe: tribe._id, 
      status: 'Published',
      visibility: 'Public' 
    })
    .select('title description category difficulty media analytics.totalViews')
    .limit(3);

    res.json({
      success: true,
      data: {
        tribe,
        relatedArtifacts: artifacts,
        relatedVRExperiences: vrExperiences
      }
    });

  } catch (error) {
    console.error('Get tribe error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid tribe ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching tribe'
    });
  }
});

// @route   GET /api/tribes/name/:name
// @desc    Get tribe by name
// @access  Public
router.get('/name/:name', optionalAuth, async (req, res) => {
  try {
    const tribeName = req.params.name;
    
    const tribe = await Tribe.findOne({ 
      where: {
        [require('sequelize').Op.or]: [
          {
            name: {
              [require('sequelize').Op.like]: tribeName
            }
          },
          {
            displayName: {
              [require('sequelize').Op.like]: tribeName
            }
          }
        ]
      }
    });

    if (!tribe) {
      return res.status(404).json({
        success: false,
        message: `Tribe '${tribeName}' not found`
      });
    }

    // Increment view count if user is viewing
    if (req.currentUser) {
      await tribe.incrementViews();
    }

    res.json({
      success: true,
      data: tribe
    });

  } catch (error) {
    console.error('Get tribe by name error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tribe'
    });
  }
});

// @route   POST /api/tribes
// @desc    Create new tribe
// @access  Private (Admin only)
router.post('/', [
  auth,
  requireAdmin,
  body('name').isIn(['Bassa', 'Belleh', 'Dei', 'Gbandi', 'Gio', 'Gola', 'Grebo', 'Kissi', 'Kpelle', 'Krahn', 'Kru', 'Lorma', 'Mandingo', 'Mano', 'Mende', 'Vai']).withMessage('Invalid tribe name'),
  body('displayName').trim().isLength({ min: 1 }).withMessage('Display name is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters')
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

    // Check if tribe already exists
    const existingTribe = await Tribe.findOne({ name: req.body.name });
    if (existingTribe) {
      return res.status(400).json({
        success: false,
        message: 'Tribe with this name already exists'
      });
    }

    const tribe = new Tribe(req.body);
    await tribe.save();

    res.status(201).json({
      success: true,
      message: 'Tribe created successfully',
      data: tribe
    });

  } catch (error) {
    console.error('Create tribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating tribe'
    });
  }
});

// @route   PUT /api/tribes/:id
// @desc    Update tribe
// @access  Private (Admin only)
router.put('/:id', [
  auth,
  requireAdmin,
  body('displayName').optional().trim().isLength({ min: 1 }).withMessage('Display name cannot be empty'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters')
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

    const tribe = await Tribe.findById(req.params.id);
    if (!tribe) {
      return res.status(404).json({
        success: false,
        message: 'Tribe not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        tribe[key] = req.body[key];
      }
    });

    tribe.lastUpdated = new Date();
    await tribe.save();

    res.json({
      success: true,
      message: 'Tribe updated successfully',
      data: tribe
    });

  } catch (error) {
    console.error('Update tribe error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid tribe ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating tribe'
    });
  }
});

// @route   DELETE /api/tribes/:id
// @desc    Delete tribe
// @access  Private (Admin only)
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const tribe = await Tribe.findById(req.params.id);
    if (!tribe) {
      return res.status(404).json({
        success: false,
        message: 'Tribe not found'
      });
    }

    await Tribe.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Tribe deleted successfully'
    });

  } catch (error) {
    console.error('Delete tribe error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid tribe ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting tribe'
    });
  }
});

// @route   GET /api/tribes/:id/artifacts
// @desc    Get artifacts for a specific tribe
// @access  Public
router.get('/:id/artifacts', optionalAuth, async (req, res) => {
  try {
    const tribe = await Tribe.findById(req.params.id);
    if (!tribe) {
      return res.status(404).json({
        success: false,
        message: 'Tribe not found'
      });
    }

    const artifacts = await Artifact.find({ 
      tribe: tribe._id,
      visibility: true
    })
    .select('name displayName category description media.primaryImage featured viewCount')
    .sort({ featured: -1, viewCount: -1 });

    res.json({
      success: true,
      data: artifacts
    });

  } catch (error) {
    console.error('Get tribe artifacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tribe artifacts'
    });
  }
});

// @route   GET /api/tribes/:id/vr-experiences
// @desc    Get VR experiences for a specific tribe
// @access  Public
router.get('/:id/vr-experiences', optionalAuth, async (req, res) => {
  try {
    const tribe = await Tribe.findById(req.params.id);
    if (!tribe) {
      return res.status(404).json({
        success: false,
        message: 'Tribe not found'
      });
    }

    const vrExperiences = await VRExperience.find({ 
      tribe: tribe._id,
      status: 'Published',
      visibility: 'Public'
    })
    .select('title description category difficulty userExperience.estimatedDuration analytics.totalViews')
    .sort({ featured: -1, 'analytics.totalViews': -1 });

    res.json({
      success: true,
      data: vrExperiences
    });

  } catch (error) {
    console.error('Get tribe VR experiences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tribe VR experiences'
    });
  }
});

module.exports = router; 