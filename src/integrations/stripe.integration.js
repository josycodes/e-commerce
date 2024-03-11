import LoggerLib from "../libs/Logger.lib.js";
import stripePackage from 'stripe';
import { config } from 'dotenv';
import ErrorLib from "../libs/Error.lib.js";
config();

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

export default class StripeIntegration{
    constructor() {}

    async createCustomer(options){
        try{
            return await stripe.customers.create(options);
        }
        catch (error) {
            LoggerLib.error(error);
            if (error instanceof stripe.errors.StripeConnectionError) {
                // Handle Stripe connection error
                throw new ErrorLib('Stripe connection error occurred');
            }
        }
    }
}