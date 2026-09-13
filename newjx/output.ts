import { input, parseInput } from "./src/runtime/input";

let a: any[] = [];
a[0] = parseInput(input("input a: "));
a[2] = parseInput(input("input b: "));
console.log(a);