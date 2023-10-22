import { Box, Button, Stack, Typography } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import DetectiveIcon from '../assets/detective.png'

function MenuPage() {
  const navigate = useNavigate()

  function renderBackgroundEffects() {
    return (
      <Box className='backgroundEffects'>
        <Box className="line line-one" />
        <Box className="line line-two" />
        <Box className="line line-three" />
        <Box className="line line-four" />
        <Box className="line line-five" />
        <Box className="line line-six" />
        <Box className="line line-seven" />
        <Box className="line line-eight" />
        <Box className="line line-nine" />
        <Box className="circle circle-one" />
        <Box className="circle circle-two" />
        <Box className="circle circle-three" />
        <Box className="circle circle-four" />
        <Box className="circle circle-five" />
        <Box className="circle circle-six" />
      </Box>
    )
  }

  return (
    <Box sx={styles.container}>

      <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} width={'100%'}>
        <Box sx={styles.buttonsContainer}>
          <Typography variant='h2' sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Block Droid
          </Typography>

          <Stack sx={{ mt: 5 }}>
            <Button variant='text' onClick={() => navigate('/select')} sx={{ textTransform: 'none' }}>
              <Typography variant='h3' color='primary'>
                Play
              </Typography>
            </Button>

            <Button variant='text' onClick={() => navigate('/create')} sx={{ textTransform: 'none' }}>
              <Typography variant='h3' color='primary'>
                Create
              </Typography>
            </Button>

            <Button variant='text' sx={{ textTransform: 'none' }} disabled>
              <Typography variant='h3' color='primary' sx={{ opacity: 0.3 }}>
                Leaderboard
              </Typography>
            </Button>
          </Stack>

        </Box>

      </Box>

      {renderBackgroundEffects()}
    </Box>
  );
}

export default MenuPage

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    background: 'radial-gradient(ellipse at bottom, #4EC9A215 0%, #000 100%)',
    cursor: 'pointer',
    display: 'flex'
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '45%',
    zIndex: 4,
    textAlign: 'center'
  },
};
