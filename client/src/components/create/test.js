import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import StopIcon from '@mui/icons-material/Stop';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import Functions from '../play/functions';
import Grid from '../play/grid';
import { testSolution } from '../../helpers/utilities';
import CloseIcon from '@mui/icons-material/Close';

function Test(props) {
  const { enqueueSnackbar } = useSnackbar()

  const [puzzle] = useState(props.puzzle)
  const [functions, setFunctions] = useState(props.functions)

  const [playing, setPlaying] = useState(false)
  const [testResult, setTestResult] = useState()

  const setFunctionMove = (move, color, func, index) => {
    const updated = [...functions]

    updated[func][index] = move + (color * (3 + functions.length))
    setFunctions(updated)
  }

  const getResult = () => {
    setPlaying(false)

    const test = testSolution(functions, puzzle.grid, puzzle.puzzle.rows, puzzle.start.position, puzzle.start.direction)

    const endResult = test[test.length - 1]
    if (endResult.type === 'error') {
      enqueueSnackbar(endResult.msg, { variant: 'warning', anchorOrigin: { vertical: 'top', horizontal: 'center' } })
    }

    if (endResult.type === 'success') {
      enqueueSnackbar('Success', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } })
    }
  }

  const startSequence = () => {
    setPlaying(true)
    const result = testSolution(functions, puzzle.grid, puzzle.puzzle.rows, puzzle.start.position, puzzle.start.direction)
    setTestResult(result)
  }

  const stopSequence = () => {
    setPlaying(false)
    setTestResult()
  }

  return (
    <Box sx={styles.container}>
      <Box m={1}>
        <IconButton onClick={() => props.close()}>
          <CloseIcon htmlColor='white' fontSize='large' />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', gap: 4, my: 4 }}>
        <Grid rows={puzzle.puzzle.rows} grid={puzzle.grid} start={puzzle.start} testResult={testResult} isPlaying={playing} stopSequence={stopSequence} />

        <Box>
          <Typography color='primary' variant='h6' mb={1}>
            Solution
          </Typography>

          <Functions functions={functions} setFunctionMove={setFunctionMove} disableEdit />

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => startSequence()}>
              <PlayArrowIcon htmlColor='white' fontSize='large' />
            </IconButton>
            <IconButton onClick={() => stopSequence()}>
              <StopIcon htmlColor='white' fontSize='large' />
            </IconButton>
            <IconButton onClick={() => getResult()}>
              <SkipNextIcon htmlColor='white' fontSize='large' />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Box width={'67px'} />

    </Box>
  );
}

export default Test

const styles = {
  container: {
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    background: '#282729'
  },
};
