# qing-shared-const

[![Build Status](https://github.com/mgenware/qing-shared-const/workflows/Build/badge.svg)](https://github.com/mgenware/qing-shared-const/actions)
[![npm version](https://img.shields.io/npm/v/qing-shared-const.svg?style=flat-square)](https://npmjs.com/package/qing-shared-const)
[![Node.js Version](http://img.shields.io/node/v/qing-shared-const.svg?style=flat-square)](https://nodejs.org/en/)

Generate JavaScript/Go constants from JSON.

## Installation

```sh
npm i qing-shared-const
```

## Usage

### Go

```ts
import { go } from 'qing-shared-const';

go.convert(
  {
    str: 'hello world',
    intProp: 123,
    doubleProp: 12.3,
    __enums: {
      color: ['red', 'blue'],
      color2: ['red', 'blue'],
    },
  },
  { packageName: 'test', typeName: 'Test' },
);
```

Output:

```go
package test

const Str = "hello world"
const IntProp = 123
const DoubleProp = 12.3

type Color int

const (
	ColorRed Color = iota
	ColorBlue
)

type Color2 int

const (
	Color2Red Color2 = iota
	Color2Blue
)
```

## JavaScript

```ts
import { js } from 'qing-shared-const';

js.convert({
  intValue: -12,
  strValue: 'haha"\'',
  nullValue: null,
  arrayValue: [32, 'wow', null],
  __enums: {
    color: ['red', 'blue'],
    color2: ['red', 'blue'],
  },
});
```

Output:

```js
export const intValue = -12;
export const strValue = 'haha"\'';
export const nullValue = null;
export const arrayValue = [32, 'wow', null];

export var Color;
(function (Color) {
  Color[(Color['red'] = 0)] = 'red';
  Color[(Color['blue'] = 0)] = 'blue';
})(Color || (Color = {}));

export var Color2;
(function (Color2) {
  Color2[(Color2['red'] = 0)] = 'red';
  Color2[(Color2['blue'] = 0)] = 'blue';
})(Color2 || (Color2 = {}));
```

TypeScript definition is also supported:

```ts
import { js } from 'qing-shared-const';

js.convert(
  {
    intValue: -12,
    strValue: 'haha"\'',
    nullValue: null,
    arrayValue: [32, 'wow', null],
    __enums: {
      color: ['red', 'blue'],
      color2: ['red', 'blue'],
    },
  },
  { dts: true },
);
```

Output:

```ts
export declare const intValue = -12;
export declare const strValue = 'haha"\'';
export declare const nullValue = null;
export declare const arrayValue: number[];

export declare enum Color {
  red = 0,
  blue = 1,
}

export declare enum Color2 {
  red = 0,
  blue = 1,
}
```
