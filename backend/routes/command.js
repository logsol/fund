const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const crypto = require('crypto');

// Middleware to verify GitHub webhook signature
const verifyWebhookSecret = (req, res, next) => {
  const signature = req.headers['x-hub-signature-256'];
  const payload = JSON.stringify(req.body);
  
  if (!signature) {
    // Fall back to query param check for manual testing
    const providedSecret = req.query.secret;
    if (!providedSecret || providedSecret !== process.env.GITHUB_WEBHOOK_SECRET) {
      return res.status(401).json({ message: 'Invalid webhook secret' });
    }
  } else {
    // Verify GitHub webhook signature
    const hmac = crypto.createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET);
    const calculatedSignature = 'sha256=' + hmac.update(payload).digest('hex');
    
    if (signature !== calculatedSignature) {
      return res.status(401).json({ message: 'Invalid signature' });
    }
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
