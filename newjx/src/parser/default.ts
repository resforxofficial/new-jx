import { parseVariable } from "./parsevariable";
import { parseComparison } from "./util/parsecomparison";
import { parseExpression } from "./util/parseexpression";
import { parseFactor } from "./util/parsefactor";
import { parsePrimary } from "./util/parseprimary";
import { parseTerm } from "./util/parseterm";
import { parseEquality } from "./util/parserequality";

import { parseAssignment } from "./util2/parse_assignment";
import { parseOutput } from './util2/parse_output';
import { parseBlock } from './util2/parse_block';
import { parseIf } from './util2/parseif';
import { parseWhile } from './util2/parse_while';
import { parseFor } from './util2/parse_for';

export {
    parseVariable,
    parseComparison,
    parseExpression,
    parseFactor,
    parsePrimary,
    parseTerm,
    parseEquality,
    parseAssignment,
    parseOutput,
    parseBlock,
    parseIf,
    parseWhile,
    parseFor,
};
