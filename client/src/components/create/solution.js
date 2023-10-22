import { Box, Button, Popover, Typography } from '@mui/material';
import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import StraightIcon from '@mui/icons-material/Straight';
import TurnRightIcon from '@mui/icons-material/TurnRight';
import TurnLeftIcon from '@mui/icons-material/TurnLeft';
import { TileColors, moveColors } from '../../helpers/utilities';

function Solution(props) {
  const { solution, setSolution, updateFunctionSize, setSolutionMove } = props

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState()

  const handleClose = () => {
    setAnchorEl(null);
  };

  const setMove = (colorIndex, move) => {
    setSolutionMove(move, colorIndex, ...selectedFunction)
    setSelectedFunction([])
    handleClose()
  }

  function renderChosenMove(move) {
    const color = moveColors[Math.floor((move - 1) / (3 + solution.length))]
    const type = (move - 1) % (3 + solution.length)

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

      <Typography color='primary' variant='h6' mb={1}>
        Solution
      </Typography>

      {React.Children.toArray(
        solution.map((func, i) => (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography mr={2}>
                F{i + 1}
              </Typography>

              <RemoveIcon sx={{ cursor: 'pointer' }} fontSize='small' htmlColor='white' onClick={() => updateFunctionSize(i, false)} />
              <AddIcon sx={{ cursor: 'pointer' }} fontSize='small' htmlColor='white' onClick={() => updateFunctionSize(i, true)} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>

              {React.Children.toArray(
                func.map((move, moveIndex) => (
                  <Box onClick={event => { setAnchorEl(event.currentTarget); setSelectedFunction([i, moveIndex]); }}>
                    {renderChosenMove(move)}
                  </Box>
                ))
              )}

            </Box>
          </>
        )))}

      <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => setSolution([...solution.map(x => x.map(_ => 0)), [0, 0, 0, 0, 0]])}>
          <AddIcon fontSize='small' color='primary' />
          <Typography color='primary' variant='subtitle1'>
            Add
          </Typography>
        </Box>

        {solution.length > 1 && <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => setSolution(solution.slice(0, -1).map(x => x.map(_ => 0)))}>
          <RemoveIcon fontSize='small' color='primary' />
          <Typography color='primary' variant='subtitle1'>
            Remove
          </Typography>
        </Box>}
      </Box>

      <Popover
        open={Boolean(anchorEl)}
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
                  solution.map((_, i) => renderPossibleMove(color, <Typography>F{i + 1}</Typography>, colorIndex, 4 + i))
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

export default Solution

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '200px'
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