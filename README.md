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
    hello: '1',
    world: '2',
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

const helloHello = 1
const worldWorld = 2
const intPropIntProp = 123
const doublePropDoubleProp = 12.3

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

js.convert({ intValue: -12, strValue: 'haha"\'', nullValue: null, arrayValue: [32, 'wow', null] });
```

Output:

```js
export const intValue = -12;
export const strValue = 'haha"\'';
export const nullValue = null;
export const arrayValue = [32, 'wow', null];
```

TypeScript definition is also supported:

```ts
import { js } from 'qing-shared-const';

js.convert(
  { intValue: -12, strValue: 'haha"\'', nullValue: null, arrayValue: [32, 'wow', null] },
  { dts: true },
);
```

Output:

```ts
export declare const intValue = -12;
export declare const strValue = 'haha"\'';
export declare const nullValue = null;
export declare const intArr: number[];
export declare const strArr: string[];
```
