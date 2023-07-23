use serde::{Deserialize, Serialize};
use tsify::Tsify;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Tsify, Serialize, Deserialize)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct SomeInput {
    #[tsify(type = "0 | 1 | 2")]
    kind: u8,
    #[serde(rename = "numbersOne")]
    numbers_one: Vec<i32>,
    #[serde(rename = "numbersTwo")]
    numbers_two: Vec<i32>,
}

#[derive(Tsify, Serialize, Deserialize, PartialEq, Debug)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct SomeOutput {
    sum: i32,
    #[serde(rename = "sumOne")]
    sum_one: i32,
    #[serde(rename = "sumTwo")]
    sum_two: i32,
}

#[wasm_bindgen(js_name = "sumNumbers")]
pub fn sum_numbers(input: SomeInput) -> SomeOutput {
    let sum_one = input.numbers_one.iter().sum();
    let sum_two = input.numbers_two.iter().sum();
    SomeOutput {
        sum: sum_one + sum_two,
        sum_one,
        sum_two,
    }
}

#[cfg(test)]
mod tests {
    use std::vec;

    use crate::{sum_numbers, SomeInput, SomeOutput};

    #[test]
    fn dummy_test() {
        let result = sum_numbers(SomeInput {
            kind: 1,
            numbers_one: vec![1, 2, 3],
            numbers_two: vec![4, 5, 6],
        });

        assert_eq!(
            result,
            SomeOutput {
                sum_one: 6,
                sum_two: 15,
                sum: 21
            }
        );
    }
}
