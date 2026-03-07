const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/payments/create-payment-intent
// @desc    Create payment intent for order
// @access  Private
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns this order
    if (order.customer.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // Convert to cents
      currency: order.currency.toLowerCase(),
      metadata: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ error: 'Payment processing error' });
  }
});

// @route   POST /api/payments/confirm
// @desc    Confirm payment and update order
// @access  Private
router.post('/confirm', auth, async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // Update order payment status
      order.paymentStatus = 'paid';
      order.paymentDetails = {
        transactionId: paymentIntent.id,
        paymentIntentId: paymentIntent.id,
        paymentDate: new Date(),
        gateway: 'stripe'
      };
      order.status = 'confirmed';
      
      await order.save();

      res.json({
        message: 'Payment confirmed successfully',
        order
      });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ error: 'Payment confirmation error' });
  }
});

// @route   POST /api/payments/webhook
// @desc    Handle Stripe webhooks
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handlePaymentSuccess(paymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await handlePaymentFailure(failedPayment);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Handle successful payment
async function handlePaymentSuccess(paymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId;
    const order = await Order.findById(orderId);
    
    if (order) {
      order.paymentStatus = 'paid';
      order.paymentDetails = {
        transactionId: paymentIntent.id,
        paymentIntentId: paymentIntent.id,
        paymentDate: new Date(),
        gateway: 'stripe'
      };
      order.status = 'confirmed';
      
      await order.save();
      
      // TODO: Send confirmation email
      console.log(`Payment successful for order: ${order.orderNumber}`);
    }
  } catch (error) {
    console.error('Handle payment success error:', error);
  }
}

// Handle failed payment
async function handlePaymentFailure(paymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId;
    const order = await Order.findById(orderId);
    
    if (order) {
      order.paymentStatus = 'failed';
      order.status = 'cancelled';
      
      await order.save();
      
      // TODO: Send failure notification
      console.log(`Payment failed for order: ${order.orderNumber}`);
    }
  } catch (error) {
    console.error('Handle payment failure error:', error);
  }
}

// @route   POST /api/payments/refund
// @desc    Process refund (Admin only)
// @access  Private/Admin
router.post('/refund', auth, async (req, res) => {
  try {
    const { orderId, amount, reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({ error: 'Order is not paid' });
    }

    // Process refund through Stripe
    const refund = await stripe.refunds.create({
      payment_intent: order.paymentDetails.paymentIntentId,
      amount: Math.round(amount * 100), // Convert to cents
      reason: 'requested_by_customer'
    });

    // Update order
    order.paymentStatus = 'refunded';
    order.refund = {
      amount: amount,
      reason: reason,
      processedAt: new Date(),
      processedBy: req.user.userId
    };

    await order.save();

    res.json({
      message: 'Refund processed successfully',
      refund,
      order
    });
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({ error: 'Refund processing error' });
  }
});

module.exports = router; 