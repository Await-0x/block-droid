import { Box, CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getPuzzles } from '../api/puzzles'
import SelectPuzzle from '../components/play/selectPuzzle'

function SelectPage() {
  const [total, setTotal] = useState()
  const [puzzles, setPuzzles] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchPuzzles() {
    const data = await getPuzzles()

    setLoading(false)

    if (data.total) {
      setTotal(data.total)
      setPuzzles(data.puzzles)
    }
  }

  useEffect(() => {
    fetchPuzzles()
  }, [])

  if (loading) {
    return <Box sx={styles.container} display={'flex'} flexDirection={'column'}>
      <CircularProgress sx={{ alignSelf: 'center', marginTop: '250px' }} />
    </Box>
  }

  return (
    <Box sx={styles.container}>

      <SelectPuzzle puzzles={puzzles} total={total} />

    </Box >
  )
}

export default SelectPage

const styles = {
  container: {
    width: '100%',
    height: '100%',
    paddingTop: '55px'
  },
}