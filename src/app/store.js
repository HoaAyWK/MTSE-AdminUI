import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobReducer from './slices/jobSlice';
import messageReducer from './slices/messageSlice';
import categoryReducer from './slices/categorySlice';
import userReducer from './slices/userSlice';
import packagesReducer from './slices/packagesSlice';
import paymentReducer from './slices/paymentSlice';
import statisticReducer from './slices/statisticSlice';
import feedbackReducer from './slices/feedbackSlice';
import commentReducer from './slices/commentSlice';
import offerReducer from './slices/offerSlice';
import transactionReducer from './slices/transactionSlice';
import skillReducer from './slices/skillSlice';
import freelancerReducer from './slices/freelancerSlice';
import employerReducer from './slices/employerSlice';

export const store = configureStore({
    reducer: {
      auth: authReducer,
      jobs: jobReducer,
      message: messageReducer,
      categories: categoryReducer,
      users: userReducer,
      packages: packagesReducer,
      payments: paymentReducer,
      statistic: statisticReducer,
      feedbacks: feedbackReducer,
      comments: commentReducer,
      offers: offerReducer,
      transactions: transactionReducer,
      skills: skillReducer,
      freelancers: freelancerReducer,
      employers: employerReducer
    },
});