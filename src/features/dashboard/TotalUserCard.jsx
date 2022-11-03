import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';

import SkeletonCard from '../../components/card/skeleton/EarningCard';
import MainCard from '../../components/MainCard'; 
import Iconify from '../../components/Iconify';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.common,
    color: '#000',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.secondary.light,
        borderRadius: '50%',
        top: -85,
        right: -95,
        [theme.breakpoints.down('sm')]: {
            top: -105,
            right: -140
        }
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.secondary.light,
        borderRadius: '50%',
        top: -125,
        right: -15,
        opacity: 0.7,
        [theme.breakpoints.down('sm')]: {
            top: -155,
            right: -70
        }
    }
}));
const TotalUserCard = ({isLoading, total}) => {
    const theme = useTheme();

    return (
        <>
            {isLoading ? (
                <SkeletonCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container>
                                    <Grid item>
                                        <Avatar
                                                variant="rounded"
                                                sx={{
                                                    ...theme.typography.commonAvatar,
                                                    ...theme.typography.largeAvatar,
                                                    backgroundColor: theme.palette.info.main,
                                                    mt: 1
                                                }}
                                            >
                                                <Iconify icon='fa:group' width={25} height={25} style={{ color: '#fff' }} />
                                        </Avatar>    
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }} color='text.secondary'>
                                            {total}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Avatar
                                            sx={{
                                                ...theme.typography.smallAvatar,
                                                backgroundColor: theme.palette.info.lighter,
                                                color: theme.palette.info.main
                                            }}
                                        >
                                            <Iconify icon='ant-design:rise-outlined' width={25} height={25} />
                                        </Avatar>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sx={{ mb: 1.25 }}>
                                <Typography
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        color: 'text.secondary'
                                    }}
                                >
                                    Total Users
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

export default TotalUserCard;