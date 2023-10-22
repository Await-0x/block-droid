import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { Link, useLocation } from "react-router-dom";
import { DojoContext } from '../contexts/dojoContext';
import { ellipseAddress } from '../helpers/utilities';

function Header() {
  const dojo = useContext(DojoContext)
  const location = useLocation()

  return (
    <Box sx={styles.header}>

      <Link to={location.pathname.includes('/puzzle') ? '/select' : '/'}>
        {location.pathname !== "/" && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ArrowBackIcon fontSize='large' htmlColor='white' />
          <Typography variant='h5' color='white'>
            Back
          </Typography>
        </Box>}
      </Link>

      {location.pathname === '/create' && <Typography variant='h5'>
        Create puzzle
      </Typography>}

      <Box>
        {!dojo.address
          ? <LoadingButton variant='outlined' onClick={() => dojo.createBurner()} loading={dojo.isDeploying}>
            Create Wallet
          </LoadingButton>

          : <Button onClick={() => { }}>
            <Typography color='primary' sx={{ fontSize: '13px' }}>
              {ellipseAddress(dojo.address, 4, 4)}
            </Typography>
          </Button>}
      </Box>

    </Box>
  );
}

export default Header

const styles = {
  header: {
    width: '100%',
    height: '55px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    pt: 2,
    pr: 3,
    pl: 2,
    boxSizing: 'border-box',
    gap: 4,
    position: 'absolute'
  },
  item: {
    letterSpacing: '1px',
  },
  logo: {
    cursor: 'pointer'
  },
  content: {
    textDecoration: 'none',
    color: 'white',
  },
};