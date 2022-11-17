import React from 'react';
import { styled } from '@mui/material/styles';
import { Avatar, Box, Typography, Paper, Stack, Tooltip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import LetterAvatar from '../../components/LetterAvatar';
import Label from '../../components/Label';
import { fToNow } from '../../utils/formatTime';

const PaperStyle = styled(Paper)(({ theme }) => ({
    color: theme.palette.main,
    overflow: 'hidden',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    zIndex: 0,
    padding: theme.spacing(1),
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2)
}));

const Applied = ({ applied }) => {
    console.log(applied);

    return (
        <PaperStyle>
            <Stack spacing={2}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Stack spacing={1} direction='row'>
                        {applied?.freelancer?.user?.image ? (
                            <Avatar src={applied?.freelancer?.user?.image} alt={applied?.freelancer?.firstName} />
                        ) : (
                            <LetterAvatar name={applied?.freelancer?.firstName} />
                        )}
                        <Stack spacing={0}>
                            <Tooltip title={`${applied?.freelancer?.firstName} ${applied?.freelancer?.lastName}`}>
                                <Typography
                                    component={RouterLink}
                                    to={`/dashboard/freelancers/${applied?.freelancer?.id}`}
                                    color='text.primary'
                                    sx={{
                                        textDecoration: 'none',
                                        fontWeight: 600
                                    }}
                                    variant='body2'
                                >
                                    {`${applied?.freelancer?.firstName} ${applied?.freelancer?.lastName}`}
                                </Typography>
                            </Tooltip>
                            <Typography variant='caption' color='text.secondary'>
                                {applied?.freelancer?.user?.email}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack spacing={1}>
                        <Stack spacing={0.5} direction='row'>
                            <Typography variant='body1'>
                                {fToNow(applied?.appliedAt)}
                            </Typography>
                        </Stack>
                        <Label
                            variant='ghost'
                            color={applied?.status ? 'warning' : 'error' }
                        >
                            {applied?.status ? 'Pending' : 'Cancel'}
                        </Label>
                    </Stack>
                </Box>
            </Stack>
        </PaperStyle>
    );
};

export default Applied;