export const TileColors = ['transparent', 'red', 'green', 'blue']
export const moveColors = ['#6f6666', 'red', 'green', 'blue']

export function canMoveForward(position, direction, rows, cols) {
  if (direction === 0) {
    return position >= cols;
  }

  if (direction === 1) {
    return position % cols < cols - 1;
  }

  if (direction === 2) {
    return position / cols < rows - 1;
  }

  if (direction === 3) {
    return position % cols !== 0;
  }
}

export function calculateForwardPosition(direction, position, cols) {
  if (direction === 0) {
    return position - cols;
  }

  if (direction === 1) {
    return position + 1;
  }

  if (direction === 2) {
    return position + cols;
  }

  if (direction === 3) {
    return position - 1;
  }
}

export function changeDirection(direction, action) {
  if (direction === 3 && action === 1) { return 0; }
  if (direction === 0 && action === 2) { return 3; }
  if (action === 1) { return direction + 1; }
  if (action === 2) { return direction - 1; }
}

export function testSolution(functions, grid, rows, startPos, startDir) {
  const cols = grid.length / rows
  const returnArr = []

  function executeMove(iterations, fIndex, index, position, direction, stars) {
    if (iterations > 1000) {
      return returnArr.push({ type: 'error', msg: 'Sequence limit reached' })
    }

    if (stars.length === grid.filter(tile => tile.star).length) {
      return returnArr.push({ type: 'success' })
    }

    console.log(position, grid[position]._type)
    if (grid[position]._type === 0) {
      return returnArr.push({ type: 'error', msg: 'Robot left the grid' })
    }

    const move = functions[fIndex][index]

    if (move === 0) {
      return returnArr.push({ type: 'error', msg: 'No more sequences' })
    }

    const moveColor = Math.floor((move - 1) / (3 + functions.length))
    if (moveColor > 0 && moveColor !== grid[position]._type) {
      returnArr.push({ type: 'skip' })
      return executeMove(iterations + 1, fIndex, index + 1, position, direction, stars)
    }

    const moveType = (move - 1) % (3 + functions.length)
    if (moveType === 0) {
      if (
        canMoveForward(position, direction, rows, cols)
      ) {

        let newPos = calculateForwardPosition(direction, position, cols)

        if (grid[newPos].star && !stars.includes(newPos)) {
          stars.push(newPos)
        }

        returnArr.push({ type: 'forward', direction })
        return executeMove(iterations + 1, fIndex, index + 1, newPos, direction, stars)

      } else {
        return returnArr.push({ type: 'error', msg: 'Robot left the grid' })
      }
    }

    if (moveType < 3) {
      let newDir = changeDirection(direction, moveType)
      returnArr.push({ type: 'turn', moveType })
      return executeMove(iterations + 1, fIndex, index + 1, position, newDir, stars)
    }

    if (moveType > 2) {
      returnArr.push({ type: 'recursive', func: moveType - 3 })
      return executeMove(iterations + 1, moveType - 3, 0, position, direction, stars)
    }
  }

  executeMove(0, 0, 0, startPos, startDir, [])
  return returnArr
}

export function forwardCoords(direction, position) {
  if (direction === 0) {
    return {
      x: position.x,
      y: position.y - 40
    }
  }

  if (direction === 1) {
    return {
      x: position.x + 40,
      y: position.y
    }
  }

  if (direction === 2) {
    return {
      x: position.x,
      y: position.y + 40
    }
  }

  if (direction === 3) {
    return {
      x: position.x - 40,
      y: position.y
    }
  }
}

export function ellipseAddress(address, start, end) {
  return `${address.slice(0, start)}...${address.slice(-end)}`.toUpperCase();
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}