use array::ArrayTrait;
use block_droid::models::{Puzzle, Tile, Function, Start};

fn position_has_star(stars: @Array<u16>, position: u32) -> bool {
    let mut res: bool = false;

    let mut i: u32 = 0;
    loop {
        if i == stars.len() {
            break;
        }

        if *stars.at(i) == position.try_into().unwrap() {
            res = true;
            break;
        }

        i += 1;
    };

    res
}

fn skip_move(tile: Tile, move: u8, num_functions: u8) -> bool {
    let color = (move - 1) / (3 + num_functions);

    if color == 0 {
        return false;
    }

    return color != tile._type;
}

fn can_move_forward(position: u16, direction: u16, rows: u16, cols: u16) -> bool {
    if direction == 0 {
        return position >= cols;
    }
    
    if direction == 1 {
        return position % cols < cols - 1;
    }

    if direction == 2 {
        return position / cols < rows - 1;
    }

    if direction == 3 {
        return position % cols != 0;
    }

    return false;
}

fn move_forward(position: u16, direction: u16, cols: u16) -> u16 {
    if direction == 0 {
        return position - cols;
    }

    if direction == 1 {
        return position + 1;
    }

    if direction == 2 {
        return position + cols;
    }

    return position - 1;
}

fn change_direction(direction: u8, move_type: u8) -> u8 {
    if direction == 3 && move_type == 1 {
        return 0;
    }

    if direction == 0 && move_type == 2 {
        return 3;
    }

    if move_type == 1 {
        return direction + 1;
    }
    
    return direction - 1; 
}

fn add_to_stack(stack: @Array<u8>, sequence: @Array<u8>, sequence_index: u8) -> Array<u8> {
    let mut new_stack = ArrayTrait::new();

    let mut i: u32 = sequence_index.into();
    loop {
        if sequence.len() <= i {
            break;
        }

        new_stack.append(*sequence.at(i));

        i += 1;
    };

    i = 0;
    loop {
        if stack.len() <= i {
            break;
        }

        new_stack.append(*stack.at(i));

        i += 1;
    };

    return new_stack;
}