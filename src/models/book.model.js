import mongoose, { Schema } from 'mongoose';

const mongoosePaginate = require('mongoose-paginate-v2');

const BookSchema = new Schema({
  bookTitle: { type: String, required: true },
  isbn: {
    type: String,
    required: true,
    index: true,
    trim: true,
  },
  publishYear: { type: Date, required: true },
  coverPrice: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  status: {
    type: String,
    enum: ['checkedIn', 'checkedOut'],
    default: 'checkedIn',
  },
  history: [{ type: Schema.Types.ObjectId, ref: 'BookHistory' }],
});

BookSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'history',
  });
  next();
});

BookSchema.plugin(mongoosePaginate);

export default mongoose.model('Book', BookSchema, 'books');
