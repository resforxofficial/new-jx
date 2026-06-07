import fs from "fs";
import { tokenize } from "./lexer/read_idfnum";
import { Parser } from "./parser/Parser";

const inputPath = process.argv[2];

const raw = fs.readFileSync(inputPath, "utf-8");

const tokens = tokenize(raw);

const parser = new Parser(tokens);

console.log(parser.peek());