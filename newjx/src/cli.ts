import fs from 'fs';
import { Parser } from './parser/parser';
import { tokenize } from './lexer/main';

const inputPath = process.argv[2];
const data = fs.readFileSync(inputPath, { encoding: "utf-8" });

const token = tokenize(data);
const parser = new Parser(token);
const ast = parser.parse();

console.dir(ast, { depth: null });