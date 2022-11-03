import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';


const LinkRouter = (props) => (<Link {...props} component={RouterLink} />);
const LinkRouterStyle = styled(LinkRouter)(({ theme }) => ({
    color: theme.palette.primary.light,
    textTransform: 'capitalize'
}));

const BreadcrumbRouter = (props) => {
    const { exclude, breadcrumbNameMap, id } = props;
    const { pathname } = useLocation();
    let pathnames = pathname.split('/').filter((x) => x).filter((x) => x !== exclude);

    if (id) {
        pathnames = pathnames.filter((x) => x !== id);
    }

    return (
        <Breadcrumbs aria-label='breadcrumb'>
            <LinkRouterStyle underline='hover' to='/dashboard'>
                {exclude ? `${exclude}` : 'Home' }
            </LinkRouterStyle>
            {
                pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    const to = `${pathnames.slice(0, index + 1).join('/')}`;

                    return last ? (
                        <Typography color='text.primary' key={to}>
                            {breadcrumbNameMap[to]}
                        </Typography>
                    ) : (
                        <LinkRouterStyle underline="hover" to={`/${exclude}/${to}`} key={to}>
                            {breadcrumbNameMap[to]}
                        </LinkRouterStyle>
                    )
                })
            }
        </Breadcrumbs>
    );
};

export default BreadcrumbRouter;