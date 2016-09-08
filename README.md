# esnext-coverage-format-html

[![NPM version](http://img.shields.io/npm/v/esnext-coverage-format-html.svg)](https://www.npmjs.org/package/esnext-coverage-format-html)

HTML formatter for [esnext-coverage].

Similar to other coverage formatters, esnext-coverage-format-html accepts a coverage results object and produces a report as an utf8-encoded string.

## Installation

```sh
npm install esnext-coverage-format-html --save-dev
```

## Usage

### Usage with test frameworks

Add esnext-coverage-format-html to the list of reporters in [esnext-coverage configuration object](https://github.com/esnext-coverage/karma-esnext-coverage-reporter#usage) or to your karma configuration file.

```js
reporters: [
  {
    formatter: 'html', // require esnext-coverage-format-html
    outFile: 'reports/coverage.html' // write output to file
  }
]
```

### Usage with esnext-coverage cli

```bash
esnext-coverage format coverage.json -f html -o report.html
```

### Usage in Node

```js
import fs from 'fs';
import formatter from 'esnext-coverage-format-html';

fs.readFile('coverage.json', 'utf8', (err, data) => {
  const coverage = JSON.parse(data);
  const report = formatter(coverage);
  fs.writeFile('coverage.html', report);
});
```

## License

[MIT License](http://opensource.org/licenses/MIT)

[esnext-coverage]: https://github.com/esnext-coverage/esnext-coverage
