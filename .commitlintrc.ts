import { setCommitLintConfig } from "./packages/devblocks-commitlint/src/index";
let commitLintConfig = setCommitLintConfig();
module.exports = {
    ...commitLintConfig
};
