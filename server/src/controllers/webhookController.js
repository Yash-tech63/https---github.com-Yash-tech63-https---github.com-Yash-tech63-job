const paymentService = require('../services/paymentService');

/**
 * Handle incoming Razorpay Webhook events
 */
const handleRazorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    // Use rawBody buffer if available from express.json verify hook, otherwise fallback to req.body
    const rawPayload = req.rawBody || req.body;

    const result = await paymentService.handleWebhook(rawPayload, signature);
    return res.status(200).json({ status: 'ok', ...result });
  } catch (error) {
    console.error('Razorpay Webhook Controller Error:', error.message);
    // Respond with 400 for bad signature, or 200/500 depending on nature
    return res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  handleRazorpayWebhook
};
