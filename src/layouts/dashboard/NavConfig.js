import Iconify from '../../components/Iconify';

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
    {
        title: 'dashboard',
        path: '/dashboard/app',
        icon: getIcon('eva:pie-chart-2-fill'),
    },
    {
        title: 'user',
        path: '/dashboard/users',
        icon: getIcon('eva:people-fill'),
    },
    {
        title: 'category',
        path: '/dashboard/categories',
        icon: getIcon('ic:outline-category'),
    },
    {
        title: 'job',
        path: '/dashboard/jobs',
        icon: getIcon('ic:round-work'),
    },
    {
        title: 'point',
        path: '/dashboard/points',
        icon: getIcon('akar-icons:credit-card'),
    },
    {
        title: 'payment',
        path: '/dashboard/payments',
        icon: getIcon('fa6-solid:file-invoice-dollar'),
    },
    {
        title: 'transaction',
        path: '/dashboard/transactions',
        icon: getIcon('icon-park-outline:transaction'),
    }
];

export default navConfig;