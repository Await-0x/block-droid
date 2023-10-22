import { Box, TextField } from '@mui/material'
import React from 'react'
import { TileColors } from '../../helpers/utilities'
import AdbIcon from '@mui/icons-material/Adb';
import StarIcon from '@mui/icons-material/Star';

function Grid(props) {
  const { handleChange, values, grid, stars, updateGrid } = props

  return (
    <Box sx={styles.container}>

      {React.Children.toArray(
        Array.from({ length: values.rows }, (_, row) => (
          <Box sx={styles.row}>

            {React.Children.toArray(
              Array.from({ length: values.cols }, (_, col) => {
                const position = row * values.cols + col

                return <Box sx={styles.tile} onClick={() => updateGrid(row, col)} bgcolor={TileColors[grid[position]]}>
                  {stars.includes(position) && <StarIcon color='primary' sx={{ fontSize: '14px' }} />}

                  {position === values.startPos && <AdbIcon htmlColor='white' fontSize='small' sx={{ rotate: `${values.startDir * 90}deg` }} />}
                </Box>
              })
            )}

          </Box>
        ))
      )}

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
  }
}