import { Box, Typography } from '@mui/material'
import React from 'react'
import { ellipseAddress } from '../../helpers/utilities'
import { useNavigate } from 'react-router-dom'

function SelectPuzzle(props) {
  const { puzzles } = props

  const navigate = useNavigate()

  return (
    <Box sx={styles.container}>

      <Typography variant='h4'>
        Select Puzzle
      </Typography>

      <Box sx={styles.puzzles} mt={4}>
        {React.Children.toArray(
          puzzles.map(puzzle => {
            const rowSize = 250 / (puzzle.grid_length / puzzle.rows)
            const colSize = 123 / puzzle.rows
            const tileSize = Math.min(rowSize, colSize)

            return <Box sx={styles.puzzleContainer} onClick={() => navigate(`/puzzle/${puzzle.id}`)}>
              <Box textAlign={'center'}>
                <Typography variant='h6'>
                  Puzzle #{puzzle.id}
                </Typography>

                <Typography noWrap color={'#8B8B8B'} variant='subtitle2'>
                  {ellipseAddress(puzzle.creator, 16, 4)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '1px' }} maxWidth={`${(tileSize + 3) * puzzle.rows}px`}>
                {React.Children.toArray(
                  Array.from({ length: puzzle.grid_length }, () => (
                    <Box sx={styles.gridTile} width={`${tileSize}px`} height={`${tileSize}px`} ></Box>
                  ))
                )}
              </Box>
            </Box>
          })
        )}
      </Box>

    </Box >
  )
}

export default SelectPuzzle

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    pt: 2,
  },
  puzzles: {
    width: '950px',
    display: 'flex',
    gap: 2,
    flexWrap: 'wrap'
  },
  puzzleContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    width: '300px',
    height: '250px',
    background: '#282729',
    border: '1px solid rgba(255, 255, 255, 0.24)',
    borderRadius: '4px',
    padding: 2,
    boxSizing: 'border-box',
    cursor: 'pointer',
    transition: '0.3s',
    '&:hover': {
      border: '1px solid rgba(255, 255, 255, 0.6)',
    },
  },
  title: {
    fontSize: '18px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
  },
  gridTile: {
    border: '1px solid #FFE97F'
  }
}