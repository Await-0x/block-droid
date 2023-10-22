import { Box, Button, Modal, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import Grid from '../components/create/grid'
import Solution from '../components/create/solution'
import Test from '../components/create/test'
import Toolbar from '../components/create/toolbar'
import { DojoContext } from '../contexts/dojoContext'

function CreatePage() {
  const dojo = useContext(DojoContext)

  const [values, setValues] = useState({
    rows: 8,
    cols: 8,
    selectedColor: 1,
    startPos: null,
    startDir: 0,
  })

  const [stars, setStars] = useState([])
  const [grid, setGrid] = useState([])
  const [solution, setSolution] = useState([[0, 0, 0, 0, 0]])

  const [test, showTest] = useState(false)

  useEffect(() => {
    setGrid(Array.from({ length: values.rows * values.cols }, () => 0))
  }, [values.rows, values.cols])

  const handleChange = (name, value) => {
    setValues((values) => ({
      ...values,
      [name]: value,
    }));
  };

  const submitPuzzle = async () => {
    await dojo.executeTx('actions', 'create', [grid, values.rows, stars, solution.map(x => x.length), values.startPos, values.startDir], 'Puzzle submitted')
  }

  const updateFunctionSize = (index, add) => {
    const updated = [...solution]

    if (add) {
      updated[index] = [...solution[index], 0]
    }
    else if (solution[index].length > 2) {
      updated[index] = solution[index].slice(0, -1)
    }
    else {
      return
    }

    setSolution(updated)
  }

  const setSolutionMove = (move, color, func, index) => {
    const updated = [...solution]

    updated[func][index] = move + (color * (3 + solution.length))
    setSolution(updated)
  }

  const updateGrid = (row, col) => {
    const position = row * values.cols + col

    if (values.selectedColor < 5) {
      let updatedGrid = [...grid]
      updatedGrid[position] = values.selectedColor
      setGrid(updatedGrid)
    }

    else if (values.selectedColor === 5) {
      let updatedStars = [...stars]
      if (updatedStars.includes(position)) {
        updatedStars = updatedStars.filter(s => s !== position)
      }
      else {
        updatedStars.push(position)
      }
      setStars(updatedStars)
    }

    else if (values.selectedColor === 6) {
      setStars(stars.filter(s => s !== position))
      handleChange('startPos', position)
    }
  }

  return (
    <Box sx={styles.container}>

      <Box>
        <Toolbar values={values} handleChange={handleChange} />

        <Grid grid={grid} values={values} handleChange={handleChange} updateGrid={updateGrid} stars={stars} />

        <Box sx={styles.actionContainer}>
          <Button variant='contained' sx={{ textTransform: 'none' }} onClick={() => showTest(true)}>
            <Typography color='secondary'>
              Test
            </Typography>
          </Button>

          <Button variant='contained' color='success' sx={{ textTransform: 'none', width: '100px' }} onClick={() => submitPuzzle()}>
            <Typography>
              Submit
            </Typography>
          </Button>
        </Box>
      </Box>

      <Box>
        <Solution solution={solution} setSolution={setSolution} updateFunctionSize={updateFunctionSize} setSolutionMove={setSolutionMove} />
      </Box>

      <Modal open={test} onClose={() => showTest(false)}>
        <Test
          close={() => showTest(false)}
          puzzle={{
            puzzle: {
              grid_length: grid.length,
              rows: values.rows
            },
            grid: grid.map((tile, i) => ({
              position: i, _type: tile, star: stars.includes(i)
            })),
            start: {
              position: values.startPos,
              direction: values.startDir
            }
          }}
          functions={solution}
        />
      </Modal>

    </Box >
  )
}

export default CreatePage

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    boxSizing: 'border-box',
    paddingTop: '95px',
    display: 'flex',
    marginLeft: '30vw',
    gap: 8
  },
  actionContainer: {
    mt: 5,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    gap: 2
  }
}