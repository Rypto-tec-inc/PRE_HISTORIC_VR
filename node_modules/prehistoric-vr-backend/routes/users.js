const express = require('express');
const { body, validationResult } = require('express-validator');
const { User } = require('../models/index');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.currentUser.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('fullName').optional().trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  body('tribe').optional().isIn(['Bassa', 'Belleh', 'Dei', 'Gbandi', 'Gio', 'Gola', 'Grebo', 'Kissi', 'Kpelle', 'Krahn', 'Kru', 'Lorma', 'Mandingo', 'Mano', 'Mende', 'Vai']).withMessage('Invalid tribe'),
  body('county').optional().isIn(['Bomi', 'Bong', 'Gbarpolu', 'Grand Bassa', 'Grand Cape Mount', 'Grand Gedeh', 'Grand Kru', 'Lofa', 'Margibi', 'Maryland', 'Montserrado', 'Nimba', 'River Cess', 'River Gee', 'Sinoe']).withMessage('Invalid county'),
  body('gender').optional().isIn(['Male', 'Female', 'Other', 'Prefer not to say']).withMessage('Invalid gender'),
  body('ageGroup').optional().isIn(['Under 18', '18-25', '26-35', '36-45', '46-60', 'Over 60']).withMessage('Invalid age group'),
  body('educationLevel').optional().isIn(['Elementary', 'High School', 'College', 'University', 'Graduate', 'Other']).withMessage('Invalid education level')
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

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['fullName', 'tribe', 'county', 'gender', 'ageGroup', 'educationLevel', 'interests', 'profileImage', 'onboardingCompleted', 'notifications', 'language'];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

// @route   POST /api/users/progress/vr-experience
// @desc    Record VR experience completion
// @access  Private
router.post('/progress/vr-experience', [
  auth,
  body('experienceId').notEmpty().withMessage('Experience ID is required'),
  body('score').optional().isInt({ min: 0, max: 100 }).withMessage('Score must be between 0 and 100')
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

    const { experienceId, score = 0 } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if experience already completed
    const existingCompletion = user.vrExperiencesCompleted.find(
      exp => exp.experienceId === experienceId
    );

    if (existingCompletion) {
      // Update existing completion if score is better
      if (score > existingCompletion.score) {
        existingCompletion.score = score;
        existingCompletion.completedAt = new Date();
      }
    } else {
      // Add new completion
      user.vrExperiencesCompleted.push({
        experienceId,
        score,
        completedAt: new Date()
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'VR experience progress recorded',
      data: {
        totalCompleted: user.vrExperiencesCompleted.length,
        latestScore: score
      }
    });

  } catch (error) {
    console.error('Record VR progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while recording progress'
    });
  }
});

// @route   POST /api/users/progress/tribe-visit
// @desc    Record tribe page visit
// @access  Private
router.post('/progress/tribe-visit', [
  auth,
  body('tribeName').notEmpty().withMessage('Tribe name is required')
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

    const { tribeName } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add tribe to visited list if not already visited
    if (!user.tribesVisited.includes(tribeName)) {
      user.tribesVisited.push(tribeName);
      await user.save();
    }

    res.json({
      success: true,
      message: 'Tribe visit recorded',
      data: {
        totalTribesVisited: user.tribesVisited.length,
        tribesVisited: user.tribesVisited
      }
    });

  } catch (error) {
    console.error('Record tribe visit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while recording tribe visit'
    });
  }
});

// @route   POST /api/users/progress/artifact-view
// @desc    Record artifact view
// @access  Private
router.post('/progress/artifact-view', [
  auth,
  body('artifactId').notEmpty().withMessage('Artifact ID is required')
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

    const { artifactId } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add artifact to viewed list if not already viewed
    if (!user.artifactsViewed.includes(artifactId)) {
      user.artifactsViewed.push(artifactId);
      await user.save();
    }

    res.json({
      success: true,
      message: 'Artifact view recorded',
      data: {
        totalArtifactsViewed: user.artifactsViewed.length
      }
    });

  } catch (error) {
    console.error('Record artifact view error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while recording artifact view'
    });
  }
});

// @route   POST /api/users/achievements
// @desc    Award achievement to user
// @access  Private
router.post('/achievements', [
  auth,
  body('achievementName').notEmpty().withMessage('Achievement name is required'),
  body('achievementType').optional().isString().withMessage('Achievement type must be a string')
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

    const { achievementName } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add achievement if not already earned
    if (!user.achievements.includes(achievementName)) {
      user.achievements.push(achievementName);
      await user.save();

      res.json({
        success: true,
        message: 'Achievement awarded!',
        data: {
          newAchievement: achievementName,
          totalAchievements: user.achievements.length,
          allAchievements: user.achievements
        }
      });
    } else {
      res.json({
        success: true,
        message: 'Achievement already earned',
        data: {
          achievement: achievementName,
          totalAchievements: user.achievements.length
        }
      });
    }

  } catch (error) {
    console.error('Award achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while awarding achievement'
    });
  }
});

// @route   GET /api/users/progress
// @desc    Get user progress summary
// @access  Private
router.get('/progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const progressSummary = {
      tribesVisited: user.tribesVisited.length,
      totalTribes: 17, // Total number of Liberian tribes
      artifactsViewed: user.artifactsViewed.length,
      vrExperiencesCompleted: user.vrExperiencesCompleted.length,
      achievements: user.achievements.length,
      totalLearningTime: user.totalLearningTime,
      completionPercentage: Math.round((user.tribesVisited.length / 17) * 100),
      badges: user.achievements,
      recentActivity: {
        lastTribesVisited: user.tribesVisited.slice(-3),
        lastArtifactsViewed: user.artifactsViewed.slice(-3),
        recentVRExperiences: user.vrExperiencesCompleted.slice(-3)
      }
    };

    res.json({
      success: true,
      data: progressSummary
    });

  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching progress'
    });
  }
});

// @route   POST /api/users/learning-time
// @desc    Update user learning time
// @access  Private
router.post('/learning-time', [
  auth,
  body('minutes').isInt({ min: 1 }).withMessage('Minutes must be a positive integer')
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

    const { minutes } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.totalLearningTime += minutes;
    await user.save();

    res.json({
      success: true,
      message: 'Learning time updated',
      data: {
        totalLearningTime: user.totalLearningTime,
        sessionTime: minutes
      }
    });

  } catch (error) {
    console.error('Update learning time error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating learning time'
    });
  }
});

module.exports = router; 