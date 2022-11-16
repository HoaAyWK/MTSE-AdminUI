import React from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Card, CardContent, Link as MuiLink } from '@mui/material';

const InfoAreaStyle = styled(Card)(({theme}) => ({
    backgroundColor: 'rgb(255, 255, 255)',
    color: 'rgb(33, 43, 54)',
    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius[5],
    zIndex: 0
}));

const InfoContentStyle = styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    
}));

const CardInfo = ({ children, title }) => {
    return (
        <InfoAreaStyle>
            <CardContent>
                <Typography variant='h5' sx={{ fontWeight: 700, lineHeight: 1.5 }}>
                    {title}
                </Typography>
                <InfoContentStyle>
                    {children}
                </InfoContentStyle>
            </CardContent>
        </InfoAreaStyle>
    );
};

export default CardInfo;