const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

// Middleware to verify webhook secret
const verifyWebhookSecret = (req, res, next) => {
  const providedSecret = req.body.secret || req.query.secret;
  
  if (!providedSecret || providedSecret !== process.env.GITHUB_WEBHOOK_SECRET) {
    return res.status(401).json({ message: 'Invalid webhook secret' });
  }
  next();
};

router.post('/git-update', verifyWebhookSecret, (req, res) => {
  exec('git pull', (error, stdout, stderr) => {
    if (error) {
      console.error(`Git pull error: ${error}`);
      return res.status(500).json({ 
        message: 'Git pull failed', 
        error: error.message 
      });
    }
    
    res.json({ 
      message: 'Git pull successful',
      output: stdout,
      errors: stderr
    });
  });
});

module.exports = router;
