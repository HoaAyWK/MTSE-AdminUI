import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import jobReducer from '../features/jobs/jobSlice';
import messageReducer from '../features/message/messageSlice';
import categoryReducer from '../features/categories/categorySlice';
import userReducer from '../features/users/userSlice';
import pointReducer from '../features/points/pointSlice';
import paymentReducer from '../features/payments/paymentSlice';
import statisticReducer from '../features/statistic/statisticSlice';
import feedbackReducer from '../features/feedbacks/feedbackSlice';
import commentReducer from '../features/comments/commentSlice';
import offerReducer from '../features/offers/offerSlice'

export const store = configureStore({
    reducer: {
      auth: authReducer,
      jobs: jobReducer,
      message: messageReducer,
      categories: categoryReducer,
      users: userReducer,
      points: pointReducer,
      payments: paymentReducer,
      statistic: statisticReducer,
      feedbacks: feedbackReducer,
      comments: commentReducer,
      offers: offerReducer
    },
});