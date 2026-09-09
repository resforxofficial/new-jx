import { input, parseInput } from "./src/runtime/input";

let a: any = parseInput(input("text a number: "));
if (a > 10) {
console.log(a);
} else {
if (a == 5) {
console.log(a + 1);
} else {
console.log(a + 2);
}
}