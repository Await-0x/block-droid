import { Box, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { TileColors, forwardCoords } from '../../helpers/utilities'
import AdbIcon from '@mui/icons-material/Adb';
import StarIcon from '@mui/icons-material/Star';
import { useAnimationControls, motion } from 'framer-motion';
import { useSnackbar } from 'notistack';

function Grid(props) {
  const { rows, grid, start, testResult, isPlaying, stopSequence } = props

  const { enqueueSnackbar } = useSnackbar()
  const controls = useAnimationControls()

  const cols = grid.length / rows

  const [position] = useState({
    x: (start.position % cols) * 40 + 6,
    y: Math.floor(start.position / cols) * 40 + 4
  })

  const [direction] = useState(start.direction)

  useEffect(() => {
    if (isPlaying && testResult) {
      startAnimations()
    } else {
      stopAnimations()
    }
  }, [isPlaying])

  const stopAnimations = () => {
    controls.stop()

    controls.set({
      left: position.x,
      top: position.y,
      rotate: direction * 90
    })

    stopSequence()
  }

  const startAnimations = async () => {
    let coords = { ...position }
    let rotation = direction * 90

    for (const sequence of testResult) {

      if (sequence.type === 'forward') {
        coords = forwardCoords(sequence.direction, coords)

        await controls.start({
          left: coords.x,
          top: coords.y,
          transition: { delay: 0.1, ease: 'linear' }
        })
      }

      if (sequence.type === 'turn') {
        rotation += sequence.moveType === 1 ? 90 : -90

        await controls.start({
          rotate: rotation,
          transition: { delay: 0.1, ease: 'linear' }
        })
      }

    }

    let endResult = testResult[testResult.length - 1]
    if (endResult.type === 'error') {
      enqueueSnackbar(endResult.msg, { variant: 'warning', anchorOrigin: { vertical: 'top', horizontal: 'center' } })
    }

    if (endResult.type === 'success') {
      enqueueSnackbar('Success', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } })
    }

    controls.set({
      left: position.x,
      top: position.y,
      rotate: direction * 90
    })

    stopSequence()
  }

  return (
    <Box sx={styles.container}>
      {React.Children.toArray(
        Array.from({ length: rows }, (_, row) => (
          <Box sx={styles.row}>

            {React.Children.toArray(
              Array.from({ length: cols }, (_, col) => {
                const tile = grid[row * cols + col]

                return <Box sx={styles.tile} bgcolor={TileColors[tile._type]}>
                  {tile.star && <StarIcon color='primary' sx={{ fontSize: '14px' }} />}
                </Box>
              })
            )}

          </Box>
        ))
      )}

      <motion.div style={{ ...styles.robot, top: `${position.y}px`, left: `${position.x}px`, rotate: direction * 90 }} animate={controls}>
        <AdbIcon htmlColor='white' fontSize='small' />
      </motion.div>

    </Box >
  )
}

export default Grid

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 1,
    position: 'relative'
  },

  row: {
    display: 'flex',
    gap: 1
  },

  tile: {
    width: '30px',
    height: '30px',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  robot: {
    position: 'absolute'
  }
}