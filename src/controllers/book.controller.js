import dotenv from 'dotenv';
import Book from '../models/book.model';
import BookHistory from '../models/bookHistory.model';
import axiosInstances from '../utils/api.utils';

const { googleApi } = axiosInstances;

dotenv.config();

/**
 * calculate only working days - excluding any holidays and weekends
 */
const returnDaysCalculate = async (checkoutDate = new Date()) => {
  // create count variable and currentDate variable to iterate
  let countDays = 0;
  const currentDate = checkoutDate;
  currentDate.setUTCHours(0, 0, 0, 0);
  console.log(currentDate, 'current Date');
  const url =
    '/calendar/v3/calendars/en.pk%23holiday%40group.v.calendar.google.com/events?key=AIzaSyDfKWdpeRjC-731P6PQkR8DsKuuVewHpqc';
  const calendarData = await googleApi.get(url);
  const isHoliday = calendarData?.data?.items.find((item) => {
    const itemDate = new Date(item.start.date);
    if (itemDate.getTime() === currentDate.getTime()) {
      return item;
    }
    return undefined;
  });
  // iterate (while) until count reaches 15
  while (countDays < 15) {
    const dayOfWeek = currentDate.getDay();
    // skip saturdays and sundays as weekends
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // skip count if currentDate is holiday
      if (!isHoliday) countDays += 1;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }
  return currentDate;
};

const calculatePenalty = async (book, personNationalId) => {
  const bookDocument = await BookHistory.findOne({
    book,
    personNationalId,
    checkoutStatus: true,
  });
  let diff = 0;
  const today = new Date();
  const { requiredReturnTimeStamp } = bookDocument;

  if (today > requiredReturnTimeStamp) {
    diff = Math.floor(
      (today - requiredReturnTimeStamp) / (1000 * 60 * 60 * 24),
    );
  }
  return diff * 5;
};

export default {
  /**
   * create a record for book
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  createBook: async (req, res) => {
    try {
      const { bookTitle, isbn, publishYear, coverPrice } = req.body;
      if (!(bookTitle && isbn && publishYear && coverPrice)) {
        return res.status(400).json({
          status: 'error',
          error: {
            status: 'error',
            message: 'all fields are required',
          },
        });
      }
      const book = {
        bookTitle,
        isbn,
        publishYear,
        coverPrice,
      };
      const savedBook = await new Book(book).save();

      res.status(200).json({
        status: 'success',
        message: 'book record successfully saved',
        body: { savedBook },
      });
    } catch (err) {
      res.status(500).json({
        status: 'fail',
        message: 'Unexpected Error',
        error: err.toString(),
      });
    }
  },
  /**
   * get all books
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  getBooks: async (req, res) => {
    try {
      const { page, perPage, id = '' } = req.query;
      const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(perPage, 10) || 10,
      };
      let filter = {};

      if (id) {
        filter = { _id: id };
      }
      Book.paginate(filter, options)
        .then((books) => {
          res.status(200).json({
            status: 'success',
            message: 'books record successfully fetched',
            body: { books },
          });
        })
        .catch((err) => {
          return res.status(400).json({
            status: 'fail',
            message: 'Unexpected Error',
            error: err.message,
          });
        });
    } catch (err) {
      res.status(500).json({
        status: 'fail',
        message: 'Unexpected Error',
        error: err.toString(),
      });
    }
  },
  /**
   * check out a book
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  checkOutBook: async (req, res) => {
    try {
      // get [bookId, personName, personNationalId, personMobileNumber, checkoutTimeStamp] of book to check out from req
      const {
        bookId,
        personName,
        personNationalId,
        personMobileNumber,
        checkoutTimeStamp,
      } = req.body;
      // check data
      if (!(bookId && personName && personNationalId && personMobileNumber)) {
        return res.status(400).json({
          status: 'error',
          error: {
            status: 'error',
            message: 'missing required field',
          },
        });
      }
      if (
        !personNationalId.match(/^\d{11}$/) ||
        !personMobileNumber.match(/^\d{2}-\d{3} \d{4}$/)
      ) {
        return res.status(400).json({
          status: 'error',
          error: {
            status: 'error',
            message: 'validation error',
          },
        });
      }
      // get book from db
      const book = await Book.findById(bookId);
      // check if book is present
      if (!book) {
        return res.status(400).json({
          status: 'error',
          error: {
            status: 'error',
            message: 'can not find book with given id',
          },
        });
      }
      // check if book status is already checkedOut - if so return error
      if (book.status === 'checkedOut') {
        return res.status(400).json({
          status: 'error',
          error: {
            status: 'error',
            message: 'book is already checked out',
          },
        });
      }
      const returnDays = await returnDaysCalculate(checkoutTimeStamp);
      // create a bookHistory object from data
      const bookHistory = {
        book: bookId,
        personName,
        personNationalId,
        personMobileNumber,
        checkoutTimeStamp,
        requiredReturnTimeStamp: returnDays,
        checkoutStatus: true,
      };
      // store this object in bookHistory
      const savedBookHistory = await new BookHistory(bookHistory).save();
      // change status of book to checkedOut
      console.log(savedBookHistory, 'saved history');
      const bookHistories = await BookHistory.find({ book: bookId }).distinct(
        '_id',
      );
      await Book.findOneAndUpdate(
        { _id: bookId },
        { status: 'checkedOut', history: bookHistories },
      );

      res.status(200).json({
        status: 'success',
        message: 'book history record successfully saved',
        body: { savedBookHistory },
      });
    } catch (err) {
      res.status(500).json({
        status: 'fail',
        message: 'Unexpected Error',
        error: err.toString(),
      });
    }
  },
  /**
   * check in a book
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  checkInBook: async (req, res) => {
    try {
      // get [bookId, personNationalId] of book to check out from req
      const { bookId, personNationalId } = req.body;
      const penalty = await calculatePenalty(bookId, personNationalId);
      await Book.findOneAndUpdate({ _id: bookId }, { status: 'checkedIn' });
      await BookHistory.findOneAndUpdate(
        { book: bookId },
        { checkoutStatus: false },
      );
      res.status(200).json({
        status: 'success',
        message: 'book record successfully updated',
        body: { penalty },
      });
    } catch (err) {
      res.status(500).json({
        status: 'fail',
        message: 'Unexpected Error',
        error: err.toString(),
      });
    }
  },
};
