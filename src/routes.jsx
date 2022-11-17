import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import DashboardApp from './pages/DashboardApp';
import Login from './pages/Login';
import Register from './pages/Register';
import Category from './pages/Category';
import Profile from './pages/Profile';
import AccountSettings from './pages/AccountSettings';
import Package from './pages/Package';
import NotFound from './pages/Page404';
import Job from './pages/Job';
import JobDetails from './pages/JobDetails';
import Skill from './pages/Skill';
import Freelancer from './pages/Freelancer';
import FreelancerDetails from './pages/FreelancerDetails';
import Employer from './pages/Employer';
import EmployerDetails from './pages/EmployerDetails';
import Transaction from './pages/Transaction';

const Router = () => {
    return useRoutes([
        {
            path: '/dashboard',
            element: 
                <DashboardLayout />
            ,
            children: [
                { path: 'app', element: <DashboardApp /> },
                { path: 'freelancers', element: <Freelancer />},
                { path: 'freelancers/:freelancerId', element: <FreelancerDetails />},
                { path: 'users/profile', element: <Profile />},
                { path: 'users/account', element: <AccountSettings />},
                { path: 'employers', element: <Employer />},
                { path: 'employers/:employerId', element: <EmployerDetails />},
                { path: 'categories', element: <Category />},
                { path: 'jobs', element: <Job />},
                { path: 'jobs/:jobId', element: <JobDetails />},
                { path: 'packages', element: <Package />},
                { path: 'transactions', element: <Transaction />},
                { path: 'skills', element: <Skill />},

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