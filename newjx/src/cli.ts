import fs from 'fs';
import { Parser } from './parser/parser';
import { tokenize } from './lexer/main';
import { transform } from './transform/maintr';
import { spawnSync } from 'child_process';
import path from 'path';

const inputPath = process.argv[2];

const data = fs.readFileSync(inputPath, { encoding: "utf-8" });

const token = tokenize(data);
const parser = new Parser(token);
const ast = parser.parse();

const output = transform(ast);
const outputPath = path.resolve('./output.ts');

fs.writeFileSync(
    "./output.ts",
    output,
    { encoding: "utf-8" }
);

spawnSync('npx', ['tsx', outputPath], { stdio: 'inherit' });
