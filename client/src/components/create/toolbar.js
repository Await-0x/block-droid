import { Box, IconButton, TextField } from '@mui/material'
import React from 'react'
import AdbIcon from '@mui/icons-material/Adb';
import StarIcon from '@mui/icons-material/Star';
import RotateIcon from '@mui/icons-material/Rotate90DegreesCw';
import { TileColors } from '../../helpers/utilities';

function Toolbar(props) {
  const { handleChange, values } = props

  return (
    <Box sx={styles.container}>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Box width={'80px'}>
          <TextField
            label="Rows"
            value={values.rows}
            size="small"
            onChange={(event) => handleChange("rows", event.target.value)}
          />
        </Box>

        <Box width={'80px'}>
          <TextField
            label="Cols"
            value={values.cols}
            size="small"
            onChange={(event) => handleChange("cols", event.target.value)}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>

        {React.Children.toArray(
          TileColors.map((color, i) => {
            return <Box
              sx={[styles.tile, i === 0 && styles.border, values.selectedColor === i && styles.active]}
              bgcolor={color}
              onClick={() => handleChange("selectedColor", i)}
            />
          })
        )}

      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={[styles.object, values.selectedColor === 5 && styles.objectActive]} onClick={() => handleChange("selectedColor", 5)}>
          <StarIcon color='primary' fontSize='large' />
        </Box>

        <Box sx={[styles.object, values.selectedColor === 6 && styles.objectActive]} display={'flex'} alignItems={'baseline'} onClick={() => handleChange("selectedColor", 6)}>
          <AdbIcon htmlColor='white' fontSize='large' />

          <IconButton size='small' sx={{ marginLeft: '-5px' }} onClick={() => handleChange("startDir", values.startDir < 3 ? values.startDir + 1 : 0)}>
            <RotateIcon htmlColor='white' fontSize='medium' />
          </IconButton>
        </Box>

      </Box>

    </Box >
  )
}

export default Toolbar

const styles = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    pb: 5,
    gap: 3,
  },
  tile: {
    width: '38px',
    height: '38px',
    cursor: 'pointer',
    transition: '0.3s',
    border: '1px solid transparent',
    opacity: 0.6,
    '&:hover': {
      border: '1px solid rgba(255, 255, 255, 0.6)',
      opacity: 1
    },
  },
  border: {
    border: '1px solid rgba(255, 255, 255, 0.6)'
  },
  active: {
    opacity: 1,
    border: '1px solid rgba(255, 255, 255, 1)'
  },
  object: {
    height: '35px',
    cursor: 'pointer',
    transition: '0.3s',
    opacity: 0.5,
    '&:hover': {
      opacity: 1
    },
  },
  objectActive: {
    opacity: 1
  }
}