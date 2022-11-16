import React, { useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { Avatar, Box, Button, Card, CardContent, Typography, Paper, Stack } from '@mui/material';

import LetterAvatar from '../../components/LetterAvatar';
import Iconify from '../../components/Iconify';
import { useEffect } from 'react';
import ClickableTypography from '../../components/ClickableTypography';
import Label from '../../components/Label';

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

const CardStyle = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.grey[500_12],
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[0]
}));

const Offer = ({ offer }) => {
    const [showMore, setShowMore] = useState(false);
    const [showMoreHidden, setShowMoreHidden] = useState(false);
    const [lineChars, setLineChars] = useState(offer?.content?.length);
    const ref = useRef(null);

    const handleResize = () => {
        const chars = Math.ceil((ref.current ? ref.current.offsetWidth : 0 ) / 8);
        setLineChars(chars * 2);
        if (offer?.content?.length > chars * 2) {
            if (!showMore) {
                setShowMore(true);
            }
        } else {
            setShowMoreHidden(true);
        }
    };

    useEffect(() => {
        const chars = Math.ceil((ref.current ? ref.current.offsetWidth : 0 ) / 8);
        setLineChars(chars * 2);
        if (offer?.content?.length > chars * 2) {
            setShowMore(true);
        } else {
            setShowMoreHidden(true);
        }
    }, [ref.current, offer]);

    useEffect(() => {
        window.addEventListener('resize', handleResize, false);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleShowMoreClick = () => {
        setShowMore(false);
    };

    const handleShowLessClick = () => {
        setShowMore(true);
    };

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
                        {offer?.freelancer?.avatar?.url ? (
                            <Avatar src={offer.freelancer.avatar.url} alt={offer?.freelancer?.name} />
                        ) : (
                            <LetterAvatar name={offer?.freelancer?.name} />
                        )}
                        <Stack spacing={0}>
                            <Typography variant='body2'>
                                {offer?.freelancer?.name}
                            </Typography>
                            <Typography variant='caption' color='text.secondary'>
                                {offer?.freelancer?.email}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack spacing={1}>
                        <Stack spacing={0.5} direction='row'>
                            <Iconify icon='bxs:dollar-circle' width={25} height={25} style={{ color: '#00b074' }} />
                            <Typography variant='body1'>
                                {`${offer?.price}$`}
                            </Typography>
                        </Stack>
                        <Label
                            variant='ghost'
                            color={(offer?.status === 'Pending' && 'warning') ||
                                (offer?.status === 'Selected' && 'primary') ||
                                (offer?.status === 'Accepted' && 'success') ||
                                'error'
                            }
                        >
                            {offer?.status}
                        </Label>
                    </Stack>
                </Box>
                <CardStyle>
                    <CardContent >
                        <Typography variant='body1' ref={ref}>
                            {showMore ? (
                                `${offer?.content.slice(0, lineChars)}...`
                            ) : (
                                offer?.content
                            )}
                        </Typography>
                        {showMoreHidden ? (<></>) : (
                            <Box>
                                {showMore ? (
                                    <ClickableTypography handleClick={handleShowMoreClick}>
                                        Show more
                                    </ClickableTypography>
                                ) : (
                                    <ClickableTypography handleClick={handleShowLessClick}>
                                        Show less
                                    </ClickableTypography>
                                )}
                            </Box>
                        )}
                    </CardContent>
                </CardStyle>
            </Stack>
        </PaperStyle>
    );
};

export default Offer;