import React from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';

import Iconify from '../../components/Iconify';

const MoreMenuItem = ({ iconName, title, handleClick, id }) => {

    const handleMenuClick = (e) => {
        handleClick(id);
    }

    return (
        <MenuItem sx={{ color: 'tex.secondary' }} onClick={handleMenuClick}>
            <ListItemIcon>
                <Iconify icon={iconName} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary={title} primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
    );
};

export default MoreMenuItem;