const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { sequelize } = require('../config/database');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

// User model definition (using sequelize.define)
const User = sequelize.define('User', {
  fullName: {
    type: require('sequelize').DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: require('sequelize').DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  phone: {
    type: require('sequelize').DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  password: {
    type: require('sequelize').DataTypes.STRING,
    allowNull: false
  },
  isEmailVerified: {
    type: require('sequelize').DataTypes.BOOLEAN,
    defaultValue: false
  },
  isPhoneVerified: {
    type: require('sequelize').DataTypes.BOOLEAN,
    defaultValue: false
  },
  emailVerificationToken: {
    type: require('sequelize').DataTypes.STRING,
    allowNull: true
  },
  phoneVerificationCode: {
    type: require('sequelize').DataTypes.STRING,
    allowNull: true
  },
  passwordResetToken: {
    type: require('sequelize').DataTypes.STRING,
    allowNull: true
  },
  passwordResetExpires: {
    type: require('sequelize').DataTypes.DATE,
    allowNull: true
  },
  hasCompletedOnboarding: {
    type: require('sequelize').DataTypes.BOOLEAN,
    defaultValue: false
  },
  avatar: {
    type: require('sequelize').DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true
});

// Sync the model
User.sync();

// Helper function to generate verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to send email (mock for now)
const sendVerificationEmail = async (email, code) => {
  console.log(`📧 Sending verification email to ${email} with code: ${code}`);
  // In production, integrate with SendGrid, Nodemailer, etc.
  return true;
};

// Helper function to send SMS (mock for now)
const sendVerificationSMS = async (phone, code) => {
  console.log(`📱 Sending verification SMS to ${phone} with code: ${code}`);
  // In production, integrate with Twilio, AWS SNS, etc.
  return true;
};

// @route   POST /api/auth/register
// @desc    Register user with email or phone
// @access  Public
router.post('/register', [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body().custom((value, { req }) => {
    if (!req.body.email && !req.body.phone) {
      throw new Error('Either email or phone number is required');
    }
    return true;
  }),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phone').optional().matches(/^\+\d{1,4}[\d\s\-\(\)]{6,20}$/).withMessage('Valid phone number with country code is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { fullName, email, phone, password } = req.body;

    // Check if user already exists
    const whereClause = {};
    if (email) whereClause.email = email;
    if (phone) whereClause.phone = phone;

    const existingUser = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          email ? { email } : {},
          phone ? { phone } : {}
        ].filter(obj => Object.keys(obj).length > 0)
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or phone'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate verification codes
    const emailVerificationToken = email ? generateVerificationCode() : null;
    const phoneVerificationCode = phone ? generateVerificationCode() : null;

    // Create user
    const user = await User.create({
      fullName,
      email: email || null,
      phone: phone || null,
      password: hashedPassword,
      emailVerificationToken,
      phoneVerificationCode,
      isEmailVerified: !email, // If no email provided, mark as verified
      isPhoneVerified: !phone   // If no phone provided, mark as verified
    });

    // Send verification codes
    if (email && emailVerificationToken) {
      await sendVerificationEmail(email, emailVerificationToken);
    }
    
    if (phone && phoneVerificationCode) {
      await sendVerificationSMS(phone, phoneVerificationCode);
    }

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        hasCompletedOnboarding: user.hasCompletedOnboarding
      },
      verificationRequired: {
        email: !!email && !user.isEmailVerified,
        phone: !!phone && !user.isPhoneVerified
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user with email/phone and password
// @access  Public
router.post('/login', [
  body().custom((value, { req }) => {
    if (!req.body.email && !req.body.phone) {
      throw new Error('Email or phone number is required');
    }
    return true;
  }),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, phone, password } = req.body;

    // Find user by email or phone
    const whereClause = {};
    if (email) whereClause.email = email;
    if (phone) whereClause.phone = phone;

    const user = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          email ? { email } : {},
          phone ? { phone } : {}
        ].filter(obj => Object.keys(obj).length > 0)
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   POST /api/auth/verify-email
// @desc    Verify email with code
// @access  Private
router.post('/verify-email', [
  body('code').notEmpty().withMessage('Verification code is required')
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

    // For now, just return success without auth check
    // TODO: Add auth middleware back
    res.json({
      success: true,
      message: 'Email verification endpoint working (auth temporarily disabled)'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email verification'
    });
  }
});

// @route   POST /api/auth/verify-phone
// @desc    Verify phone with code
// @access  Private
router.post('/verify-phone', [
  body('code').notEmpty().withMessage('Verification code is required')
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

    // For now, just return success without auth check
    // TODO: Add auth middleware back
    res.json({
      success: true,
      message: 'Phone verification endpoint working (auth temporarily disabled)'
    });

  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during phone verification'
    });
  }
});

// @route   POST /api/auth/resend-verification
// @desc    Resend verification code
// @access  Private
router.post('/resend-verification', [
  body('type').isIn(['email', 'phone']).withMessage('Type must be email or phone')
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

    const { type } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (type === 'email') {
      if (!user.email) {
        return res.status(400).json({
          success: false,
          message: 'No email associated with this account'
        });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message: 'Email is already verified'
        });
      }

      const newCode = generateVerificationCode();
      await user.update({ emailVerificationToken: newCode });
      await sendVerificationEmail(user.email, newCode);

      res.json({
        success: true,
        message: 'Email verification code sent'
      });

    } else if (type === 'phone') {
      if (!user.phone) {
        return res.status(400).json({
          success: false,
          message: 'No phone number associated with this account'
        });
      }

      if (user.isPhoneVerified) {
        return res.status(400).json({
          success: false,
          message: 'Phone is already verified'
        });
      }

      const newCode = generateVerificationCode();
      await user.update({ phoneVerificationCode: newCode });
      await sendVerificationSMS(user.phone, newCode);

      res.json({
        success: true,
        message: 'Phone verification code sent'
      });
    }

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during resend verification'
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset code
// @access  Public
router.post('/forgot-password', [
  body().custom((value, { req }) => {
    if (!req.body.email && !req.body.phone) {
      throw new Error('Email or phone number is required');
    }
    return true;
  })
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

    const { email, phone } = req.body;

    // Find user
    const user = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          email ? { email } : {},
          phone ? { phone } : {}
        ].filter(obj => Object.keys(obj).length > 0)
      }
    });

    if (!user) {
      // Don't reveal if user exists or not
      return res.json({
        success: true,
        message: 'If an account exists, a reset code has been sent'
      });
    }

    // Generate reset token
    const resetToken = generateVerificationCode();
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await user.update({
      passwordResetToken: resetToken,
      passwordResetExpires: resetExpires
    });

    // Send reset code
    if (email && user.email) {
      await sendVerificationEmail(user.email, resetToken);
    } else if (phone && user.phone) {
      await sendVerificationSMS(user.phone, resetToken);
    }

    res.json({
      success: true,
      message: 'Password reset code sent'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset request'
    });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with code
// @access  Public
router.post('/reset-password', [
  body('code').notEmpty().withMessage('Reset code is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body().custom((value, { req }) => {
    if (!req.body.email && !req.body.phone) {
      throw new Error('Email or phone number is required');
    }
    return true;
  })
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

    const { email, phone, code, password } = req.body;

    // Find user
    const user = await User.findOne({
      where: {
        [require('sequelize').Op.and]: [
          {
            [require('sequelize').Op.or]: [
              email ? { email } : {},
              phone ? { phone } : {}
            ].filter(obj => Object.keys(obj).length > 0)
          },
          { passwordResetToken: code },
          { passwordResetExpires: { [require('sequelize').Op.gt]: new Date() } }
        ]
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset code'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user
    await user.update({
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null
    });

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
  try {
    // For now, return a mock user
    // TODO: Add auth middleware back
    res.json({
      success: true,
      user: {
        id: 1,
        fullName: 'Test User',
        email: 'test@example.com',
        phone: null,
        isEmailVerified: true,
        isPhoneVerified: false,
        hasCompletedOnboarding: false,
        avatar: null
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user'
    });
  }
});

// @route   PUT /api/auth/complete-onboarding
// @desc    Mark onboarding as completed
// @access  Private
router.put('/complete-onboarding', async (req, res) => {
  try {
    // For now, just return success
    // TODO: Add auth middleware back
    res.json({
      success: true,
      message: 'Onboarding completed'
    });

  } catch (error) {
    console.error('Complete onboarding error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while completing onboarding'
    });
  }
});

module.exports = router; 