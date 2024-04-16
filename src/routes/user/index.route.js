import auth from "../user/auth/auth.route.js";
import categories from "./categories/categories.route.js";
import express from "express";
import product from "./products/product.route.js";
import review from "./review/review.route.js";
import cart from "./cart/cart.route.js";
const router = express.Router();

router.use('/auth', auth);
router.use('/categories', categories);
router.use('/product', product);
router.use('/review', review);
router.use('/cart', cart);

export default router;
