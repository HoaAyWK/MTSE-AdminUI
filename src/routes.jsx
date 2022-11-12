import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import DashboardApp from './pages/DashboardApp';
import Login from './pages/Login';
import Register from './pages/Register';
import Category from './pages/Category';
import CreateCategory from './pages/CreateCategory';
import UpdateCategory from './pages/UpdateCategory';
import useLocalStorage from './hooks/useLocalStorage';
import User from './pages/User';
import Profile from './pages/Profile';
import AccountSettings from './pages/AccountSettings';
import Point from './pages/Point';
import CreatePoint from './pages/CreatePoint';
import NotFound from './pages/Page404';
import Payment from './pages/Payment';
import Job from './pages/Job';
import UserDetails from './pages/UserDetails';
import JobDetails from './pages/JobDetails';
import Transaction from './pages/Transaction';


const ProtectedRoute = ({ children }) => {
    const [user, setUser] = useLocalStorage('user', null);

    return (user ? <>{children}</> : <Navigate to='/login' />);
};

const Router = () => {
    return useRoutes([
        {
            path: '/dashboard',
            element: 
                (<ProtectedRoute>
                    <DashboardLayout />
                </ ProtectedRoute>)
            ,
            children: [
                { path: 'app', element: <DashboardApp /> },
                { path: 'users', element: <User />},
                { path: 'users/profile', element: <Profile />},
                { path: 'users/account', element: <AccountSettings />},
                { path: 'users/:userId', element: <UserDetails />},
                { path: 'categories', element: <Category />},
                { path: 'categories/new', element: <CreateCategory />},
                { path: 'categories/update/:categoryId', element: <UpdateCategory />},
                { path: 'jobs', element: <Job />},
                { path: 'jobs/:jobId', element: <JobDetails />},
                { path: 'points', element: <Point />},
                { path: 'points/new', element: <CreatePoint />},
                { path: 'payments', element: <Payment />},
                { path: 'transactions', element: <Transaction />}
            ]
        },
        {
            path: 'login',
            element: <Login />,
        },
        {
            path: 'register',
            element: <Register />,
        },
        {
            path: '/',
            element: <LogoOnlyLayout />,
            children: [
                { path: '/', element: <Navigate to='/dashboard/app' /> },
                { path: '404', element: <NotFound /> },
                { path: '*', element: <Navigate to="/404" /> },
            ]
        },
        {
            path: '*',
            element: <Navigate to="/404" replace />,
        },
    ]);
};

export default Router;