import { input, parseInput } from "./src/runtime/input";

import {expectInt} from "./src/runtime/types";

function contains(nums: number[], target: number): boolean {
let istrue: boolean = false;
for (const n of nums) {
console.log(n, target, n == target);
if (n == target) {
istrue = true;
} else {
istrue = false;
}
}
return istrue;
}
let target: number = Number(input("찾을 숫자: "));
let nums: number[] = [1, 4, 7, 10, 20];
console.log(contains(nums, target));