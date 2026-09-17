function fact(n: number): number {
if (n <= 1) {
return 1;
}
return n * fact(n - 1);
}
let i = 1;
while (i < 6) {
console.log(fact(i));
i += 1;
}