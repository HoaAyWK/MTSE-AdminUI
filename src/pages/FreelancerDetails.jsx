import React, { useEffect } from 'react';
import {
    Avatar, Container, Box, Stack, Paper, Grid, Typography, Rating
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getFreelancers, selectFreelancerById } from '../app/slices/freelancerSlice';
import Page from '../components/Page';
import { action_status } from '../app/constants';
import Iconify from '../components/Iconify';
import ShowMoreParagraph from '../components/ShowMoreParagraph';
import { fDate } from '../utils/formatTime';

const PaperStyle = styled(Paper)(({ theme }) => ({
    color: theme.palette.main,
    overflow: 'hidden',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    zIndex: 0,
    padding: theme.spacing(1),
    boxShadow: theme.shadows[2]
}));

const InfoLineStyle = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    marginBlockStart: theme.spacing(2)
}));

const InfoHighlightStyle = styled(Typography)(({theme}) => ({
    margin: 0,
    fontWeight: 550
}));

const FreelancerDetails = () => {
    const { freelancerId } = useParams();
    const freelancer = useSelector((state) => selectFreelancerById(state, freelancerId));
    const { status } = useSelector((state) => state.freelancers);

    const dispatch = useDispatch();

    useEffect(() => {
        if (status === action_status.IDLE) {
            dispatch(getFreelancers());
        }
    }, [status, dispatch])

    return (
        <Page title={`Freelancer ${freelancer?.firstName} ${freelancer?.lastName}`}>
            <Container maxWidth='xl'>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" >
                        {`Freelancer ${freelancer?.firstName} ${freelancer?.lastName}`}
                    </Typography>
                </Stack>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <PaperStyle
                            sx={{
                                padding: 3
                            }}
                        >
                            <Box 
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                }}
                            >
                                {freelancer?.user?.image ? (
                                    <Avatar
                                        src={freelancer?.user?.image}
                                        alt={`${freelancer?.firstName} ${freelancer?.lastName}`}
                                        sx={{ width: 120, height: 120 }}
                                    />
                                ) : (
                                    <Avatar
                                        sx={{ width: 120, height: 120, fontSize: '64px' }}
                                    >
                                        {freelancer?.firstName[0]}
                                    </Avatar>
                                )}
                                <Typography display={'block'} variant='h4' textAlign={'center'} sx={{ marginBlockStart: 2 }}>
                                    {`${freelancer?.firstName} ${freelancer?.lastName}`}
                                </Typography>
                                <Stack direction='row' spacing={1} sx={{ marginBlock: 1 }}>
                                    <Rating name="freelancer-rating" value={freelancer?.rating?.stars} precision={0.5} readOnly />
                                </Stack>
                                {freelancer?.user?.createdAt && (
                                    <InfoLineStyle>
                                        <Iconify icon='material-symbols:calendar-today' width={25} height={25} sx={{ marginInlineEnd: 1 }} />
                                        <Typography variant='body2'>
                                            {`Joined ${fDate(freelancer?.user?.createdAt)}`}
                                        </Typography>
                                    </InfoLineStyle>
                                )}
                            </Box>
                        </PaperStyle>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <PaperStyle
                             sx={{
                                paddingInline: 3,
                                paddingBlockStart: 1,
                                paddingBlockEnd: 2
                            }}
                        >
                            <Typography variant='h5' sx={{ marginBlockEnd: 2 }}>
                                About
                            </Typography>
                            <Stack spacing={2}>
                                {freelancer?.user?.introduction && (
                                    <ShowMoreParagraph text={freelancer?.user?.introduction} line={2} />
                                )}
                                <Grid container>
                                    <Grid item xs={12} md={6}>
                                        <InfoLineStyle>
                                            <Iconify icon='eva:email-fill' width={25} height={25} sx={{ marginInlineEnd: 2 }} />
                                            <Typography variant='body2'>
                                                {freelancer?.user?.email}
                                            </Typography>
                                        </InfoLineStyle>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <InfoLineStyle>
                                            <Iconify icon='eva:phone-fill' width={25} height={25} sx={{ marginInlineEnd: 2 }} />
                                            <Typography variant='body1'>
                                                {freelancer?.user?.phone}
                                            </Typography>
                                        </InfoLineStyle>
                                    </Grid>
                                </Grid>
                                <InfoLineStyle>
                                    <Iconify icon='eva:pin-fill' width={25} height={25} sx={{ marginInlineEnd: 2 }} />
                                    <Typography variant='body2'>
                                        {'Live at '}
                                        <InfoHighlightStyle variant='body2' component={'span'}>
                                            {`${freelancer?.user?.address}`}
                                        </InfoHighlightStyle>
                                    </Typography>
                                </InfoLineStyle>
                                <InfoLineStyle>
                                    <Iconify icon='ph:gender-intersex-bold' width={25} height={25} sx={{ marginInlineEnd: 2 }} />
                                    <Typography variant='body1'>
                                        {freelancer?.gender}
                                    </Typography>
                                </InfoLineStyle>
                            </Stack>
                        </PaperStyle>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    )
}

export default FreelancerDetails;