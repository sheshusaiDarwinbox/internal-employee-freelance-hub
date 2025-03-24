import Stripe from 'stripe';
import { Request, Response } from 'express';
import { AccountDetailsModel } from '../models/accountDetails.model';

import * as dotenv from 'dotenv';
dotenv.config();

// console.log("Stripe secret key:", process.env.STRIPE_SECRET_KEY);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount, EID } = req.body;

    console.log("Creating payment intent with amount:", amount, "and EID:", EID); // Log request details
const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses cents  
      currency: 'usd', // Change to your currency
      metadata: { EID: EID },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
    console.log("Payment intent created successfully:", paymentIntent); // Log success
  } catch (error) {
    res.status(500).json({ message: (error instanceof Error) ? error.message : 'An unknown error occurred' });
  }
};

// stripe.service.js
export const handlePaymentSuccess = async (req: Request, res: Response) => {
  try {
      const { paymentIntentId } = req.body;
      console.log("Payment Intent ID received:", paymentIntentId); // Log the received ID

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      console.log("Payment Intent retrieved:", paymentIntent); // Log the retrieved intent

      const EID = paymentIntent.metadata.EID;
      const amount = paymentIntent.amount / 100;

      await AccountDetailsModel.findOneAndUpdate(
          { EID: EID },
          { $inc: { totalBalance: +amount } }
      );

      res.status(200).json({ message: 'Payment processed successfully' });
      console.log("Payment processed successfully.");
  } catch (error) {
      console.error("Error processing payment:", error); // Log the error
      res.status(500).json({ message: (error instanceof Error) ? error.message : 'An unknown error occurred' });
  }
};
