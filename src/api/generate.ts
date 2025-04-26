import express from 'express';

const router = express.Router();

// Mock route for generation
router.post('/generate', (req, res) => {
  const { topic } = req.body;
  const mockScript = `Here’s your AI-generated short: 'Boost your productivity in 30 seconds with these 3 hacks...'`;
  res.json({ result: mockScript });
});

export default router;