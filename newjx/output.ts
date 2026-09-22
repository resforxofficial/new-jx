import { input, parseInput, expectInt } from "./src/runtime/input";

let a: any = parseInput(input("input number: "));
let b: number[] = [1, 2, 3];
if (a == 1) {
    let c: any = parseInput(input("number: "));
    console.log(b[expectInt(c)]);
} else {
    let d: any = parseInput(input("number: "));
    let e: any = parseInput(input("what u want to put in this array: "));
    b[expectInt(d)] = e;
    console.log(b);
}