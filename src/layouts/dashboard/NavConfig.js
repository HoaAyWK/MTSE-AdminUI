import Iconify from '../../components/Iconify';

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
    {
        title: 'dashboard',
        path: '/dashboard/app',
        icon: getIcon('eva:pie-chart-2-fill'),
    },
    {
        title: 'job',
        path: '/dashboard/jobs',
        icon: getIcon('ic:round-work'),
    },
    {
        title: 'freelancer',
        path: '/dashboard/freelancers',
        icon: getIcon('clarity:employee-group-solid'),
    },
    {
        title: 'employer',
        path: '/dashboard/employers',
        icon: getIcon('ic:round-people'),
    },
    {
        title: 'category',
        path: '/dashboard/categories',
        icon: getIcon('ic:outline-category'),
    },
    {
        title: 'skill',
        path: '/dashboard/skills',
        icon: getIcon('clarity:node-group-line'),
    },
    {
        title: 'Package',
        path: '/dashboard/packages',
        icon: getIcon('mdi:package-outline'),
    },
    {
        title: 'transaction',
        path: '/dashboard/transactions',
        icon: getIcon('icon-park-outline:transaction'),
    },
];

export default navConfig;