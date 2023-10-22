import { request, gql } from 'graphql-request'
import { API_ENDPOINT } from '.';

export async function getPuzzles() {
  const document = gql`
  {
    puzzleModels(limit:10) {
      total_count
      edges {
        node {
          id
          creator
          rows
          grid_length
          num_functions
        }
      }
    }
  }
  `
  const res = await request(API_ENDPOINT, document)

  return {
    total: res?.puzzleModels?.total_count,
    puzzles: res?.puzzleModels?.edges?.map(edge => edge.node)
  }
}

export async function getPuzzle(id) {
  const document = gql`
  {
    puzzleModels(where:{id:${id}}) {
      total_count
      edges {
        node {
          id
          creator
          grid_length
          num_functions
          rows
        }
      }
    }
    tileModels(where:{puzzle_id:${id}},limit:65000,order:{field:POSITION, direction:ASC}) {
      edges {
        node {position, _type, star}
      }
    }
    functionModels(where:{puzzle_id:${id}},order:{field:NUMBER, direction:ASC}) {
      edges {
        node {number, moves}
      }
    }
    startModels(where:{puzzle_id:${id}}) {
      edges {
        node {position, direction}
      }
    }
  }
  `
  const res = await request(API_ENDPOINT, document)

  return {
    puzzle: res?.puzzleModels?.edges[0]?.node,
    grid: res?.tileModels?.edges?.map(edge => edge.node),
    functions: res?.functionModels?.edges?.map(edge => edge.node),
    start: res?.startModels?.edges[0]?.node
  }
}