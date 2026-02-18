const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const AIService = require('../services/ai');

// Generate code
router.post('/generate', auth, async (req, res) => {
  try {
    const { prompt, context } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: { message: 'Prompt is required', status: 400 }
      });
    }

    const result = await AIService.generateCode(prompt, context);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message, status: 500 }
    });
  }
});

// Analyze code
router.post('/analyze', auth, async (req, res) => {
  try {
    const { code, analysisType } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: { message: 'Code is required', status: 400 }
      });
    }

    const result = await AIService.analyzeCode(code, analysisType);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message, status: 500 }
    });
  }
});

// Chat with AI
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: { message: 'Message is required', status: 400 }
      });
    }

    const result = await AIService.chat(message, conversationHistory);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message, status: 500 }
    });
  }
});

// Fix code
router.post('/fix', auth, async (req, res) => {
  try {
    const { code, error } = req.body;

    if (!code || !error) {
      return res.status(400).json({
        success: false,
        error: { message: 'Code and error are required', status: 400 }
      });
    }

    const result = await AIService.fixCode(code, error);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message, status: 500 }
    });
  }
});

// Generate tests
router.post('/tests', auth, async (req, res) => {
  try {
    const { code, framework } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: { message: 'Code is required', status: 400 }
      });
    }

    const result = await AIService.generateTests(code, framework);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message, status: 500 }
    });
  }
});

module.exports = router;
