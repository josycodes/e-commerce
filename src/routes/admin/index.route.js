import auth from './auth/auth.route.js';
import collection from './category/category.route.js';
import product from './products/product.route.js';
import category from "./category/category.route.js";
import variant from "./variants/variants.route.js";
import shipping from "./shipping/index.route.js";
import promotion from "./promotion/promotion.route.js";
import customer from "./customer/customer.route.js";
import express from "express";
const router = express.Router();


router.use('/auth', auth);
router.use('/product', product);
router.use('/category', category);
router.use('/variant', variant);
router.use('/shipping', shipping);
router.use('/promotion', promotion);
router.use('/customer', customer);

export default router;
