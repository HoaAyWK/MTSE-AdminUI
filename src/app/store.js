import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobReducer from './slices/jobSlice';
import messageReducer from './slices/messageSlice';
import categoryReducer from './slices/categorySlice';
import packagesReducer from './slices/packagesSlice';
import statisticReducer from './slices/statisticSlice';
import commentReducer from './slices/commentSlice';
import transactionReducer from './slices/transactionSlice';
import skillReducer from './slices/skillSlice';
import freelancerReducer from './slices/freelancerSlice';
import employerReducer from './slices/employerSlice';
import appliedReducer from './slices/appliedSlice';

export const store = configureStore({
    reducer: {
      auth: authReducer,
      jobs: jobReducer,
      message: messageReducer,
      categories: categoryReducer,
      packages: packagesReducer,
      statistic: statisticReducer,
      comments: commentReducer,
      transactions: transactionReducer,
      skills: skillReducer,
      freelancers: freelancerReducer,
      employers: employerReducer,
      applieds: appliedReducer
    },
});