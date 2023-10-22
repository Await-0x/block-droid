use starknet::ContractAddress;

#[derive(Model, Copy, Drop, Serde)]
struct Puzzle {
    #[key]
    id: usize,
    creator: ContractAddress,
    rows: u8,
    grid_length: u16,
    num_functions: u8,
    num_stars: u16
}

#[derive(Model, Copy, Drop, Serde)]
struct Tile {
    #[key]
    puzzle_id: usize,
    #[key]
    position: u16,
    _type: u8,
    star: bool
}

#[derive(Model, Copy, Drop, Serde)]
struct Function {
    #[key]
    puzzle_id: usize,
    #[key]
    number: u8,
    moves: u8
}

#[derive(Model, Copy, Drop, Serde)]
struct Start {
    #[key]
    puzzle_id: usize,
    position: u16,
    direction: u8
}

#[derive(Model, Copy, Drop, Serde)]
struct PlayerResult {
    #[key]
    id: usize,
    player: ContractAddress,
    puzzle_id: usize,
    success: bool
}

