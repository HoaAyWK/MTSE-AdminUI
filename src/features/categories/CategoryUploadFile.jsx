import React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

import { RHFUploadFile } from '../../components/hook-form';
import Iconify from '../../components/Iconify';

const UploadFileWrapper = styled('div')(({ theme }) => ({
    outline: 'none',
    cursor: 'pointer',
    overflow: 'hidden',
    position: 'relative',
    borderRadius: theme.shape.borderRadius[5],
    backgroundColor: theme.palette.grey[500_12],
    border: '1px dashed rgb(145, 158, 171, 0.32)'
}));

const UploadShowerStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}));

const UploadIconStyle = styled(Box)(({theme}) => ({
    width: '200',
    height: '200',
}));

const CategoryUploadFile = () => {
    return (
        <UploadFileWrapper>
            <RHFUploadFile name="image" style={{ display: 'none' }} />
            <UploadShowerStyle>
                <UploadIconStyle>
                    <Iconify icon="eva:image-fill" sx={{ width: 100, height: 100 }} />
                </UploadIconStyle>
            </UploadShowerStyle>
        </UploadFileWrapper>
    );
};

export default CategoryUploadFile;