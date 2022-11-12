import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { styled } from '@mui/material/styles';

const ButtonStyle = styled(Button)(({ theme }) => ({
    backgroundColor: 'none',
    color: theme.palette.grey[600],
    '&:hover': { 
        backgroundColor: theme.palette.grey[500_24]
    }
}));

const AlertDialog = (props) => {
    const { open, handleClose, handleConfirm, title, content, itemId, color } = props;
    
    const handleClick = () => {
        handleConfirm(itemId);
        handleClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <ButtonStyle onClick={handleClose}>Cancel</ButtonStyle>
                <Button onClick={handleClick} autoFocus color={color} >Confirm</Button>
            </DialogActions>
        </Dialog>
    )
};

export default AlertDialog;