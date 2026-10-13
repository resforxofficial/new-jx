import {expectInt} from "./src/runtime/types";
import { input, parseInput } from "./src/runtime/input";

import {expectInt} from "./src/runtime/types";

function test1(a: dym): number {
return a;
}
function test2(a: number): dym {
return a;
}
let x: any = 10;
console.log(test1(x));
console.log(test2(20));