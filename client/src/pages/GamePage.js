import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import StopIcon from '@mui/icons-material/Stop';
import { Box, Button, CircularProgress, IconButton, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPuzzle } from '../api/puzzles';
import Functions from '../components/play/functions';
import Grid from '../components/play/grid';
import { ellipseAddress, testSolution } from '../helpers/utilities';
import { useSnackbar } from 'notistack';
import { DojoContext } from '../contexts/dojoContext';

function GamePage() {
  let { id } = useParams();
  const { enqueueSnackbar } = useSnackbar()
  const dojo = useContext(DojoContext)

  const [loading, setLoading] = useState(true)
  const [puzzle, setPuzzle] = useState()
  const [functions, setFunctions] = useState()

  const [playing, setPlaying] = useState(false)
  const [testResult, setTestResult] = useState()

  useEffect(() => {
    async function fetchPuzzle() {
      const data = await getPuzzle(id)

      if (data?.puzzle?.creator) {
        setPuzzle(data)
        setFunctions(data.functions.map(func => Array.from({ length: func.moves }, () => 0)))
      }

      setLoading(false)
    }

    fetchPuzzle()
  }, [id])

  const submitSolution = async () => {
    const result = await dojo.executeTx('actions', 'solve', [id, functions])

    if (!result) {
      return
    }

    if (result[0].success) {
      return enqueueSnackbar('Puzzle completed', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } })
    }

    if (!result[0].success) {
      return enqueueSnackbar('Incorrect solution', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } })
    }
  }

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

  if (loading) {
    return <Box sx={styles.container}>
      <CircularProgress sx={{ alignSelf: 'center', marginTop: '250px' }} />
    </Box>
  }

  if (!puzzle) {
    return <Box sx={styles.container}>
      <Typography variant='h4' marginTop='250px'>
        Puzzle not found :(
      </Typography>
    </Box>
  }

  return (
    <Box sx={styles.container}>
      <Typography variant='h4'>
        Puzzle #{puzzle.puzzle.id}
      </Typography>

      <Typography variant='subtitle2' color={'#8B8B8B'}>
        Created by: {ellipseAddress(puzzle.puzzle.creator, 8, 4)}
      </Typography>

      <Box sx={{ display: 'flex', gap: 6, mt: 4 }}>
        <Grid rows={puzzle.puzzle.rows} grid={puzzle.grid} start={puzzle.start} testResult={testResult} isPlaying={playing} stopSequence={stopSequence} />

        <Box>
          <Typography color='primary' variant='h6' mb={1}>
            Solution
          </Typography>

          <Functions functions={functions} setFunctionMove={setFunctionMove} />

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

          <Box sx={{ display: 'flex', mt: 3 }}>
            <Button variant='contained' color='success' sx={{ textTransform: 'none', width: '100px' }} onClick={() => submitSolution()}>
              <Typography>
                Submit
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>

    </Box>
  );
}

export default GamePage

const styles = {
  container: {
    height: '100%',
    width: '100%',
    paddingTop: '75px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};
