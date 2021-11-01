import express from 'express';

import bookController from '../../controllers/book.controller';
import authentication from '../../middlewares/authenticate.middleware';
import catchAsync from '../../middlewares/catchAsync.middleware';

const { createBook, getBooks, checkOutBook, checkInBook } = bookController;

const { authenticate } = authentication;

const router = express.Router();

router.post('/create-book', authenticate, catchAsync(createBook));
router.post('/checkout-book', authenticate, catchAsync(checkOutBook));
router.post('/checkin-book', authenticate, catchAsync(checkInBook));
router.get('/', authenticate, catchAsync(getBooks));

export default router;
