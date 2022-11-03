import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';

import Iconify from '../../components/Iconify';

const MoreMenuLinkItem = ({ to, title, iconName }) => {
    return (
        <MenuItem component={RouterLink} to={to} sx={{ color: 'text.primary' }}>
            <ListItemIcon>
                <Iconify icon={iconName} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary={title} primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
    );
};

export default MoreMenuLinkItem;