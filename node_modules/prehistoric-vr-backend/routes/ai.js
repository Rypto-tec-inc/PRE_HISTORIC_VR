const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Simulated AI responses for different types of queries
const aiResponses = {
  greeting: [
    "Hello! I'm Mis Nova, your AI guide to prehistoric Liberia! How can I help you explore our rich cultural heritage today?",
    "Greetings! I'm here to help you discover the fascinating history and traditions of Liberia's tribes. What would you like to learn about?",
    "Welcome! I'm Mis Nova, and I'm excited to share the stories of ancient Liberia with you. How can I assist your journey?"
  ],
  
  tribe: {
    bassa: "The Bassa people are one of Liberia's largest ethnic groups, known for their rich oral traditions and skilled craftsmanship. They're particularly famous for their intricate mask-making and traditional pottery. Would you like to learn more about their cultural practices?",
    kpelle: "The Kpelle are the largest ethnic group in Liberia, with a strong tradition of storytelling and music. Their society is organized around age-grade systems and they're known for their beautiful textiles and wood carvings.",
    grebo: "The Grebo people are coastal dwellers known for their fishing traditions and unique architectural styles. Their traditional houses on stilts are perfectly adapted to the coastal environment.",
    gio: "The Gio (or Dan) people are master carvers and musicians, famous throughout West Africa for their wooden masks and sculptures used in traditional ceremonies.",
    mano: "The Mano people share cultural similarities with the Gio and are known for their agricultural expertise and traditional healing practices."
  },
  
  artifact: [
    "Liberian artifacts tell incredible stories of ingenuity and artistry! From intricate Bassa pottery to powerful Grebo masks, each piece connects us to ancestors who lived thousands of years ago. What type of artifact interests you most?",
    "Ancient Liberian artifacts include ceremonial masks, traditional tools, pottery, and textiles. Each tribe developed unique techniques passed down through generations. Would you like to explore artifacts from a specific tribe?",
    "The artifacts of prehistoric Liberia reveal sophisticated societies with rich spiritual and artistic traditions. These objects weren't just functional - they were sacred, beautiful, and meaningful to daily life."
  ],
  
  vr: [
    "Our VR experiences let you walk through ancient Liberian villages, participate in traditional ceremonies, and see how our ancestors lived! You can explore reconstructed settlements, watch craftspeople at work, and experience the sounds and sights of prehistoric Liberia.",
    "Through virtual reality, you can experience what it was like to live in ancient Liberia - from the bustling markets to sacred ritual spaces. Each VR journey is based on archaeological evidence and oral histories.",
    "Step into the past with our immersive VR experiences! You'll visit different tribal territories, see traditional architecture, and witness important cultural practices that shaped Liberian society."
  ],
  
  language: [
    "Liberia is home to over 30 indigenous languages! Each language carries unique worldviews, stories, and wisdom. Learning these languages helps preserve cultural knowledge and connects us to our ancestors.",
    "The languages of Liberia's tribes are living treasures. From Kpelle to Bassa, Grebo to Vai, each language contains thousands of years of accumulated knowledge about medicine, agriculture, spirituality, and more.",
    "Indigenous languages are repositories of cultural knowledge. They contain concepts and ideas that don't exist in other languages, making them invaluable for understanding traditional ways of life."
  ],
  
  history: [
    "Liberia's prehistoric period spans thousands of years, from the earliest settlements along the coast to complex societies that emerged before European contact. Archaeological evidence shows sophisticated ironworking, agriculture, and trade networks.",
    "Before the arrival of freed American slaves in the 1800s, Liberia was home to thriving indigenous societies. These communities had complex political systems, trade relationships, and rich cultural traditions.",
    "The history of prehistoric Liberia is told through oral traditions, archaeological findings, and cultural practices that continue today. Each tribe has its own migration stories and founding legends."
  ],
  
  culture: [
    "Liberian culture is incredibly diverse, with each tribe contributing unique traditions, arts, music, and social practices. Despite this diversity, there are common themes of respect for elders, community cooperation, and spiritual connection to the land.",
    "Traditional Liberian culture emphasizes community, storytelling, and harmony with nature. Ceremonies mark important life transitions, and art serves both practical and spiritual purposes.",
    "The cultural heritage of Liberia includes traditional music, dance, oral literature, crafts, and spiritual practices that have been maintained for generations."
  ]
};

// @route   POST /api/ai/chat
// @desc    Send message to AI assistant
// @access  Private (with optional auth for guests)
router.post('/chat', [
  optionalAuth,
  body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters'),
  body('context').optional().isObject().withMessage('Context must be an object')
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

    const { message, context = {} } = req.body;
    const userId = req.currentUser?._id;
    
    // Simple keyword-based response system
    const lowerMessage = message.toLowerCase();
    let response = "";
    let responseType = "general";

    // Determine response based on keywords
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('greet')) {
      response = aiResponses.greeting[Math.floor(Math.random() * aiResponses.greeting.length)];
      responseType = "greeting";
    } else if (lowerMessage.includes('bassa')) {
      response = aiResponses.tribe.bassa;
      responseType = "tribe_info";
    } else if (lowerMessage.includes('kpelle')) {
      response = aiResponses.tribe.kpelle;
      responseType = "tribe_info";
    } else if (lowerMessage.includes('grebo')) {
      response = aiResponses.tribe.grebo;
      responseType = "tribe_info";
    } else if (lowerMessage.includes('gio') || lowerMessage.includes('dan')) {
      response = aiResponses.tribe.gio;
      responseType = "tribe_info";
    } else if (lowerMessage.includes('mano')) {
      response = aiResponses.tribe.mano;
      responseType = "tribe_info";
    } else if (lowerMessage.includes('artifact') || lowerMessage.includes('pottery') || lowerMessage.includes('mask') || lowerMessage.includes('tool')) {
      response = aiResponses.artifact[Math.floor(Math.random() * aiResponses.artifact.length)];
      responseType = "artifact_info";
    } else if (lowerMessage.includes('vr') || lowerMessage.includes('virtual reality') || lowerMessage.includes('experience')) {
      response = aiResponses.vr[Math.floor(Math.random() * aiResponses.vr.length)];
      responseType = "vr_info";
    } else if (lowerMessage.includes('language') || lowerMessage.includes('speak') || lowerMessage.includes('dialect')) {
      response = aiResponses.language[Math.floor(Math.random() * aiResponses.language.length)];
      responseType = "language_info";
    } else if (lowerMessage.includes('history') || lowerMessage.includes('past') || lowerMessage.includes('ancient')) {
      response = aiResponses.history[Math.floor(Math.random() * aiResponses.history.length)];
      responseType = "history_info";
    } else if (lowerMessage.includes('culture') || lowerMessage.includes('tradition') || lowerMessage.includes('custom')) {
      response = aiResponses.culture[Math.floor(Math.random() * aiResponses.culture.length)];
      responseType = "culture_info";
    } else if (lowerMessage.includes('help') || lowerMessage.includes('what can you') || lowerMessage.includes('how')) {
      response = "I can help you explore Liberian cultural heritage! Ask me about:\n\n🏛️ Specific tribes (Bassa, Kpelle, Grebo, etc.)\n🏺 Traditional artifacts and crafts\n🥽 VR experiences and virtual tours\n🗣️ Indigenous languages\n📜 History and oral traditions\n🎭 Cultural practices and ceremonies\n\nWhat would you like to learn about?";
      responseType = "help";
    } else {
      // Default response for unclear queries
      response = "That's an interesting question! I'm here to help you explore Liberian cultural heritage. You can ask me about specific tribes, traditional artifacts, VR experiences, languages, or cultural practices. What aspect of prehistoric Liberia interests you most?";
      responseType = "clarification";
    }

    // Generate suggestions based on the response type
    let suggestions = [];
    switch (responseType) {
      case "greeting":
        suggestions = [
          "Tell me about Bassa culture",
          "What VR experiences are available?",
          "Show me traditional artifacts",
          "How do I learn tribal languages?"
        ];
        break;
      case "tribe_info":
        suggestions = [
          "What artifacts did they create?",
          "Are there VR experiences for this tribe?",
          "Tell me about their language",
          "What are their traditional ceremonies?"
        ];
        break;
      case "artifact_info":
        suggestions = [
          "Show me pottery examples",
          "Tell me about ceremonial masks",
          "What tools did they use?",
          "How were these artifacts made?"
        ];
        break;
      case "vr_info":
        suggestions = [
          "How do I start a VR experience?",
          "What tribes can I visit in VR?",
          "Are there guided VR tours?",
          "What do I need for VR?"
        ];
        break;
      default:
        suggestions = [
          "Tell me about Kpelle traditions",
          "Show me Grebo artifacts",
          "What VR experiences can I try?",
          "Help me learn about Liberian history"
        ];
    }

    // In a real implementation, you would save this conversation to the database
    // For now, we'll just return the response
    
    res.json({
      success: true,
      data: {
        response,
        type: responseType,
        suggestions,
        timestamp: new Date().toISOString(),
        conversationId: userId ? `${userId}_${Date.now()}` : `guest_${Date.now()}`
      }
    });

  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Sorry, I encountered an error. Please try again.',
      data: {
        response: "I apologize, but I'm having trouble right now. Please try asking your question again!",
        type: "error",
        suggestions: [
          "Tell me about Liberian tribes",
          "Show me artifacts",
          "What can you help with?"
        ]
      }
    });
  }
});

// @route   GET /api/ai/suggestions
// @desc    Get conversation starters and suggestions
// @access  Public
router.get('/suggestions', async (req, res) => {
  try {
    const suggestions = {
      welcomeMessages: [
        "Hello! Tell me about Liberian culture",
        "What VR experiences are available?",
        "Show me traditional artifacts",
        "Help me learn about tribal languages"
      ],
      categories: [
        {
          title: "Explore Tribes",
          suggestions: [
            "Tell me about Bassa traditions",
            "What is Kpelle culture like?",
            "Show me Grebo coastal life",
            "Learn about Gio wood carving"
          ]
        },
        {
          title: "Discover Artifacts",
          suggestions: [
            "Show me traditional pottery",
            "Tell me about ceremonial masks",
            "What tools did ancient Liberians use?",
            "Explain traditional textiles"
          ]
        },
        {
          title: "Virtual Reality",
          suggestions: [
            "What VR experiences can I try?",
            "Take me on a virtual village tour",
            "Show me ancient ceremonies in VR",
            "Experience traditional crafts in VR"
          ]
        },
        {
          title: "Languages & History",
          suggestions: [
            "How do I learn tribal languages?",
            "Tell me about oral traditions",
            "What is Liberian prehistoric history?",
            "Explain cultural migration stories"
          ]
        }
      ],
      quickHelp: [
        "What can you help me with?",
        "How do I navigate the app?",
        "Tell me about your features",
        "Give me a guided tour"
      ]
    };

    res.json({
      success: true,
      data: suggestions
    });

  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load suggestions'
    });
  }
});

// @route   POST /api/ai/feedback
// @desc    Submit feedback on AI responses
// @access  Private
router.post('/feedback', [
  auth,
  body('messageId').notEmpty().withMessage('Message ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
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

    const { messageId, rating, feedback } = req.body;
    const userId = req.currentUser._id;

    // In a real implementation, you would save this feedback to the database
    console.log('AI Feedback received:', {
      messageId,
      rating,
      feedback,
      userId,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Thank you for your feedback! It helps me provide better assistance.',
      data: {
        messageId,
        rating,
        acknowledged: true
      }
    });

  } catch (error) {
    console.error('AI feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback'
    });
  }
});

// @route   GET /api/ai/conversation-history
// @desc    Get user's conversation history
// @access  Private
router.get('/conversation-history', auth, async (req, res) => {
  try {
    const userId = req.currentUser._id;
    
    // In a real implementation, you would fetch from database
    // For now, return mock data
    const mockHistory = [
      {
        id: 1,
        message: "Tell me about Bassa culture",
        response: "The Bassa people are one of Liberia's largest ethnic groups...",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        type: "tribe_info"
      },
      {
        id: 2,
        message: "What VR experiences are available?",
        response: "Our VR experiences let you walk through ancient Liberian villages...",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        type: "vr_info"
      }
    ];

    res.json({
      success: true,
      data: {
        conversations: mockHistory,
        totalCount: mockHistory.length
      }
    });

  } catch (error) {
    console.error('Get conversation history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load conversation history'
    });
  }
});

module.exports = router; 