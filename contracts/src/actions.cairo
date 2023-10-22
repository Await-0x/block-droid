use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use starknet::{ContractAddress, ClassHash};
use array::ArrayTrait;

#[starknet::interface]
trait IActions<TContractState> {
    fn create(self: @TContractState, grid: Array<u8>, rows: u8, stars: Array<u16>, functions: Array<u8>, start_pos: u16, start_dir: u8);
    fn solve(self: @TContractState, puzzle_id: usize, solution: Span<Span<u8>>);
}

#[dojo::contract]
mod actions {
    use starknet::{ContractAddress, get_caller_address};
    use block_droid::models::{Puzzle, Tile, Function, Start, PlayerResult};
    use block_droid::utils::{position_has_star, skip_move, can_move_forward, move_forward, change_direction};
    use super::IActions;
    use array::ArrayTrait;
    use debug::PrintTrait;

    #[external(v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn create(self: @ContractState, grid: Array<u8>, rows: u8, stars: Array<u16>, functions: Array<u8>, start_pos: u16, start_dir: u8) {
            let world = self.world_dispatcher.read();

            let puzzle_id = world.uuid();
            let creator = get_caller_address();

            let grid_length: u16 = grid.len().try_into().unwrap();
            let num_functions: u8 = functions.len().try_into().unwrap();
            let num_stars: u16 = stars.len().try_into().unwrap();

            set!(world, ( 
                Puzzle { id: puzzle_id, creator, rows, grid_length, num_functions, num_stars },
                Start { puzzle_id, position: start_pos, direction: start_dir },
             ));
            
            let mut i: u16 = 0;
            loop {
                if i >= grid_length {
                    break;
                }

                set!(world, (
                    Tile { puzzle_id, position: i, _type: *grid.at(i.into()), star: position_has_star(@stars, i.into()) },
                ));

                i += 1;
            };

            let mut i: u8 = 0;
            loop {
                if i >= num_functions {
                    break;
                }

                set!(world, (
                    Function { puzzle_id, number: i, moves: *functions.at(i.into()) },
                ));

                i += 1;
            };
        }

        fn solve(self: @ContractState, puzzle_id: usize, solution: Span<Span<u8>>) {
            let world = self.world_dispatcher.read();
        
            let puzzle = get!(world, (puzzle_id), Puzzle);

            // Test valid solution provided
            if puzzle.num_functions.into() < solution.len() {
                assert(false, 'Invalid solution');
            }

            let mut solution_index: u32 = 0;

            loop {
                if solution_index >= solution.len() {
                    break;
                }

                let _function = get!(world, (puzzle_id, solution_index), Function);
                if (*solution.at(solution_index)).len() > _function.moves.into() {
                    assert(false, 'Invalid solution');
                }

                solution_index += 1;
            };

            // Load puzzle data
            let start = get!(world, (puzzle_id), Start);

            let mut tiles: Array<Tile> = ArrayTrait::new();

            let mut i: u16 = 0;
            loop {
                if i >= puzzle.grid_length {
                    break;
                }

                tiles.append(get!(world, (puzzle_id, i), Tile));

                i += 1;
            };

            let rows = puzzle.rows;
            let cols = puzzle.grid_length / puzzle.rows.into();

            // Run solution
            let max_iterations = 1000;
            let mut memory_stack: Array<u8> = ArrayTrait::new();
            let mut collected_stars: Array<u16> = ArrayTrait::new();
            let mut success: bool = false;

            let mut position = start.position;
            let mut direction = start.direction;

            let mut function_index: u8 = 0;
            let mut sequence_index: u8 = 0;
            let mut i: u16 = 0;
            loop {
                i += 1;

                if i > max_iterations {
                    break;
                }

                if collected_stars.len() == puzzle.num_stars.into() {
                    success = true;
                    break;
                }

                // Robot left the grid
                if *tiles.at(position.into())._type == 0 {
                    break;
                }
                
                let mut sequence: Span<u8> = *solution.at(function_index.into());

                // No sequence to execute
                // TODO: Implement memory stack
                if sequence_index.into() >= sequence.len() {
                    break;
                }

                // Other color
                if skip_move(*tiles.at(position.into()), *sequence.at(sequence_index.into()), puzzle.num_functions) {
                    sequence_index += 1;
                    continue;
                }
                
                // 0: FORWARD, 1: RIGHT, 2: LEFT, 3-n: REPEAT FUNCTION
                let move_type = (*sequence.at(sequence_index.into()) - 1) % (3 + puzzle.num_functions);
                
                if move_type == 0 {
                    if can_move_forward(position, direction.into(), rows.into(), cols.into()) {
                        position = move_forward(position, direction.into(), cols.into());

                        if *tiles.at(position.into()).star {
                            if !position_has_star(@collected_stars, position.into()) {
                                collected_stars.append(position);
                            }
                        }

                        sequence_index += 1;
                        continue;
                    } else {
                        break;
                    }
                }

                if move_type > 2 {
                    function_index = move_type - 3;
                    sequence_index = 0;
                    continue;
                }

                if move_type < 3 {
                    direction = change_direction(direction, move_type);
                    sequence_index += 1;
                    continue;
                };
            };

            set!(world, PlayerResult { id: world.uuid(), player: get_caller_address(), puzzle_id, success });
        }
    }
}