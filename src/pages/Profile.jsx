import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Container, Box, Typography, Stack, Avatar, Grid, Link as MuiLink, Card, CardContent, CardHeader } from '@mui/material';

import Page from '../components/Page';
import BreadcrumbRouter from '../components/BreadcrumbRouter';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../app/slices/authSlice';
import Iconify from '../components/Iconify';
import CardInfo from '../components/CardInfo';
import LetterAvatar from '../components/LetterAvatar';
import ShowMoreParagraph from '../components/ShowMoreParagraph';

const breadcrumbNameMap = {
    '': 'Dashboard',
    'users': 'Users',
    'users/profile': 'Profile'
};

const PaperStyle = styled(Page)(({theme}) => ({
    backgroundColor: 'rgb(255, 255, 255)',
    backgroundImage: 'none',
    overflow: 'hidden',
    borderRadius: theme.shape.borderRadius,
    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    zIndex: 0,
    height: 280,
    position: 'relative',
    margin: theme.spacing(5, 0)
}));

const AvatarAreaStyle = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('xs')]: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: '0',
        right: '0',
        margin: theme.spacing(5, 0, 0, 2),
        zIndex: 100,
    },
    [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
        left: 24,
        bottom: 24,
        right: 'auto',
    }
}));

const AvatarStyle = styled(Avatar)(({ theme }) => ({
    [theme.breakpoints.up('xs')]: {
        width: 80,
        height: 80
    },
    [theme.breakpoints.up('md')]: {
        width: 128,
        height: 128,
    }
}));


const NameAreaStyle = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('xs')]: {
        marginTop: 8,
        textAlign: 'center'
    },
    [theme.breakpoints.up('md')]: {
        marginLeft: 24,
        textAlign: 'left'
    },
}));

const BackgroundStyled = styled('span')(({theme}) => ({
    lineHeight: 1,
    display: 'block',
    overflow: 'hidden',
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    color: 'transparent'
}));

const BackgroundImageStyled = styled(Box)(({theme}) => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.8,
}));

const BackgroundImageOverlayStyle = styled('div')(({theme}) => ({
    position: 'absolute',
        top: 0,
        zIndex: 9,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
}));

const InfoLineStyle = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    marginBlockStart: theme.spacing(2)
}));

const InfoHighlightStyle = styled(Typography)(({theme}) => ({
    margin: 0,
    fontWeight: 600,
}));

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user) {
            dispatch(getCurrentUser());
        }
    }, [dispatch, user])

    return (
       <Container maxWidth='xl'>
            <Box sx={{ marginBlockEnd: '5' }}>
                <Stack spacing={2}>
                    <Typography variant="h4" >
                        Profile
                    </Typography>
                    <BreadcrumbRouter exclude='dashboard' breadcrumbNameMap={breadcrumbNameMap} />
                </Stack>
            </Box>
            <PaperStyle title="Profile">
                <AvatarAreaStyle>
                    {user?.image ? (
                        <AvatarStyle src={user?.image} alt={user?.email} />
                    ) : (
                        <AvatarStyle />
                    )}
                    <NameAreaStyle>
                        <Typography variant='h4' color={'white'} sx={{ textTransform: 'capitalize' }}>
                            Admin
                        </Typography>
                        <Typography variant='h6' color={'white'} sx={{ opacity: 0.72 }}>
                            {user?.email}
                        </Typography>
                    </NameAreaStyle>
                </AvatarAreaStyle>
                <BackgroundImageOverlayStyle />
                <BackgroundStyled>
                    <BackgroundImageStyled component={'img'} src="/static/mock_images/backgrounds/bg_01.jpg" alt='image' />
                </BackgroundStyled>
            </PaperStyle>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={5}>
                        <CardInfo title='About'>
                            <InfoLineStyle>
                                <Iconify icon='eva:pin-fill' width={25} height={25} sx={{ marginInlineEnd: 2 }} />
                                <Typography variant='body1'>
                                    {'Live at '}
                                    <InfoHighlightStyle variant='body1' component={'span'}>
                                        {`${user?.address}`}
                                    </InfoHighlightStyle>
                                </Typography>
                            </InfoLineStyle>
                            <InfoLineStyle>
                                <Iconify icon='eva:email-fill' width={25} height={25} sx={{ marginInlineEnd: 2 }} />
                                <Typography variant='body1'>
                                    {user?.email}
                                </Typography>
                            </InfoLineStyle>
                            <InfoLineStyle>
                                <Iconify icon='eva:phone-fill' width={25} height={25} sx={{ marginInlineEnd: 2 }} />
                                <Typography variant='body1'>
                                    {user?.phone}
                                </Typography>
                            </InfoLineStyle>
                        </CardInfo>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        {user?.introduction && (
                            <Card>
                                <CardContent>
                                <Typography variant='h5' sx={{ marginBlockEnd: 2, fontWeight: 700, lineHeight: 1.5 }}>
                                    Introduction
                                </Typography>
                                    <ShowMoreParagraph text={user?.introduction} />
                                </CardContent>
                            </Card>
                        )} 
                    </Grid>
                </Grid>
            </Box>
       </Container>
    );
};

export default Profile;