import mongoose, { Schema } from 'mongoose';

const mongoosePaginate = require('mongoose-paginate-v2');

const BookHistorySchema = new Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  personNationalId: {
    type: String,
    required: true,
    index: true,
    match: [/^\d{11}$/, 'is invalid'],
  },
  personName: {
    type: String,
    required: true,
    lowercase: true,
  },
  personMobileNumber: {
    type: String,
    required: true,
    index: true,
    match: [/^\d{2}-\d{3} \d{4}$/, 'is invalid'],
  },
  checkoutTimeStamp: { type: Date, default: Date.now },
  requiredReturnTimeStamp: { type: Date, required: true },
  actualReturnTimeStamp: { type: Date },
  checkoutStatus: {
    type: String,
    enum: [true, false],
    required: true,
  },
});

BookHistorySchema.plugin(mongoosePaginate);

export default mongoose.model('BookHistory', BookHistorySchema, 'booksHistory');
