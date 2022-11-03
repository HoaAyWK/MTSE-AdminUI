import React, { useRef, useState } from 'react';
import { Menu, IconButton } from '@mui/material';

import Iconify from '../../components/Iconify';

const MoreMenu = ({ children }) => {
    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    return (
         <>
            <IconButton ref={ref} onClick={() => setIsOpen(true)}>
                <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
            </IconButton>

            <Menu
                open={isOpen}
                anchorEl={ref.current}
                onClose={() => setIsOpen(false)}
                PaperProps={{
                    sx: { width: 200, maxWidth: '100%' },
                }}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                {children}
            </Menu>
        </>
    );
};

export default MoreMenu;