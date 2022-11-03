import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography, Alert  } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import useResponsive from '../hooks/useResponsive';
import Page from '../components/Page';
import Logo from '../components/Logo';
import { LoginForm } from '../features/auth/login';
import { action_status } from '../app/constants';
import { clearMessage } from '../features/message/messageSlice';

const RootStyle = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
}));
  
const HeaderStyle = styled('header')(({ theme }) => ({
    top: 0,
    zIndex: 9,
    lineHeight: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    padding: theme.spacing(3),
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      alignItems: 'flex-start',
      padding: theme.spacing(7, 5, 0, 7),
    },
}));
  
const SectionStyle = styled(Card)(({ theme }) => ({
    width: '100%',
    maxWidth: 464,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: theme.spacing(2, 0, 2, 2),
}));
  
const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
}));


const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [hiddenAlert, setHiddenAlert] = useState(0);
    const { status } = useSelector((state) => state.auth);
    const { message } = useSelector((state) => state.message);
    const smUp = useResponsive('up', 'sm');

    const mdUp = useResponsive('up', 'md');

    useEffect(() => {
        dispatch(clearMessage());
    }, [dispatch])

    useEffect(() => {
        if (status === action_status.SUCCEEDED) {
            navigate('/dashboard/app', { replace: true });
        }

        if (status === action_status.FAILED) {
            setHiddenAlert(1);
        }
    }, [status, navigate])

    // if (status === action_status.SUCCEEDED) {
    //     navigate('/dashboard/app', { replace: true });
    // }
    
    // if (status === action_status.LOADING) {
    //     return (
    //         <Page title='Login'>
    //             <RootStyle>
    //                 <Box 
    //                     sx={{
    //                         width: '100%',
    //                         height: '100vh',
    //                         display: 'flex',
    //                         justifyContent: 'center',
    //                         alignItems: 'center'
    //                     }}
    //                 >
    //                     <Box 
    //                         sx={{
    //                             width: '100%',
    //                             height: '100%',
    //                             display: 'flex',
    //                             flexDirection: 'column',
    //                             justifyContent: 'center',
    //                             alignItems: 'center'
    //                         }}
    //                     >
    //                         <Logo />
    //                         <Box sx={{ width: '15%' }}>
    //                             <LinearProgress />
    //                         </Box>
    //                     </Box>                    
    //                 </Box>
    //             </RootStyle>
    //         </Page>
    //     )
    // }

    return (
        <Page title="Login">
            <RootStyle>
                <HeaderStyle>
                <Logo />

                {smUp && (
                    <Typography variant="body2" sx={{ mt: { md: -2 } }}>
                        Don’t have an account? {''}
                    <Link variant="subtitle2" component={RouterLink} to="/register">
                        Get started
                    </Link>
                    </Typography>
                )}
                </HeaderStyle>

                {mdUp && (
                <SectionStyle>
                    <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                    Hi, Welcome Back
                    </Typography>
                    <img src="/static/illustrations/illustration_login.png" alt="login" />
                </SectionStyle>
                )}

                <Container maxWidth="sm">
                    <ContentStyle>
                        <Typography variant="h4" gutterBottom>
                            Sign in to Minimal
                        </Typography>

                        <Typography sx={{ color: 'text.secondary', mb: 2 }}>Enter your details below.</Typography>
                        
                        <Alert variant='filled' severity='error' sx={{ marginBlockEnd: 2, opacity: `${hiddenAlert}` }} >{message}</Alert>

                        <LoginForm />

                        {!smUp && (
                        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                            Don’t have an account?{' '}
                            <Link variant="subtitle2" component={RouterLink} to="/register">
                            Get started
                            </Link>
                        </Typography>
                        )}
                    </ContentStyle>
                </Container>
            </RootStyle>
        </Page>
    );
};

export default Login;