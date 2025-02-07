import auth from './auth/auth.route.js';
import product from './products/product.route.js';
import category from "./category/category.route.js";
import variant from "./variants/variants.route.js";
import shipping from "./shipping/index.route.js";
import discount from "./discount/discount.route.js";
import customer from "./customer/customer.route.js";
import tax from "./tax/tax.route.js";
import banner from "./banners/banner.route.js";
import express from "express";
const router = express.Router();


router.use('/auth', auth);
router.use('/product', product);
router.use('/category', category);
router.use('/variant', variant);
router.use('/shipping', shipping);
router.use('/discount', discount);
router.use('/customer', customer);
router.use('/tax', tax);
router.use('/banners', banner);

export default router;
