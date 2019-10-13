module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
      "no-console": 2,
      "indent": 1,
      "no-unused-labels": 1,
      "curly": 1,
      "linebreak-style": 1,
      "keyword-spacing": 1
    }
};