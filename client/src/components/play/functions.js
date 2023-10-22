import StraightIcon from '@mui/icons-material/Straight';
import TurnLeftIcon from '@mui/icons-material/TurnLeft';
import TurnRightIcon from '@mui/icons-material/TurnRight';
import { Box, Popover, Typography } from '@mui/material';
import React, { useState } from 'react';
import { moveColors } from '../../helpers/utilities';

function Functions(props) {
  const { functions, setFunctionMove } = props

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState()

  const handleClose = () => {
    setAnchorEl(null);
  };

  const setMove = (colorIndex, move) => {
    setFunctionMove(move, colorIndex, ...selectedFunction)
    setSelectedFunction([])
    handleClose()
  }

  function renderChosenMove(move) {
    const color = moveColors[Math.floor((move - 1) / (3 + functions.length))]
    const type = (move - 1) % (3 + functions.length)

    return <Box sx={styles.tile} bgcolor={move ? color : '#282729'}>
      {type === 0 && <StraightIcon htmlColor='white' />}
      {type === 1 && <TurnRightIcon htmlColor='white' />}
      {type === 2 && <TurnLeftIcon htmlColor='white' />}
      {type > 2 && <Typography>F{type - 2}</Typography>}
    </Box>
  }

  function renderPossibleMove(color, icon, colorIndex, move) {
    return <Box sx={styles.move} bgcolor={color} onClick={() => setMove(colorIndex, move)}>
      {icon}
    </Box>
  }

  return (
    <Box sx={styles.container}>

      {React.Children.toArray(
        functions.map((func, i) => (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography mr={2}>
                F{i + 1}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>

              {React.Children.toArray(
                func.map((move, moveIndex) => {
                  return <Box onClick={event => { setAnchorEl(event.currentTarget); setSelectedFunction([i, moveIndex]); }}>
                    {renderChosenMove(move)}
                  </Box>
                })
              )}

            </Box>
          </>
        )))}

      <Popover
        open={Boolean(anchorEl) && !props.disableEdit}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={styles.menu}>
          {React.Children.toArray(
            moveColors.map((color, colorIndex) => {
              return <Box display='flex'>

                {renderPossibleMove(color, <StraightIcon htmlColor='white' />, colorIndex, 1)}
                {renderPossibleMove(color, <TurnRightIcon htmlColor='white' sx={{ paddingBottom: '3px' }} />, colorIndex, 2)}
                {renderPossibleMove(color, <TurnLeftIcon htmlColor='white' sx={{ paddingBottom: '3px' }} />, colorIndex, 3)}

                {React.Children.toArray(
                  functions.map((_, i) => renderPossibleMove(color, <Typography>F{i + 1}</Typography>, colorIndex, 4 + i))
                )}
              </Box>
            })
          )}

          <Box sx={styles.move} bgcolor={'#282729'} onClick={() => setMove(0, 0)} />

        </Box>
      </Popover>
    </Box >
  )
}

export default Functions

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  tile: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '2px',
    width: '30px',
    height: '30px',
    cursor: 'pointer',
    transition: '0.3s',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    '&:hover': {
      border: '1px solid rgba(255, 255, 255, 0.8)',
    },
  },
  menu: {
    backgroundColor: '#1F1E1F',
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
    padding: 1
  },
  move: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '2px',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    transition: '0.3s',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    '&:hover': {
      border: '1px solid rgba(255, 255, 255, 0.8)',
    },
  }
}