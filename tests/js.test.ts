import * as assert from 'assert';
import { promises as fsPromises } from 'fs';
import * as nodePath from 'path';
import { fileURLToPath } from 'url';
import { js } from '../dist/main.js';

const dirname = nodePath.dirname(fileURLToPath(import.meta.url));

async function t(obj: Record<string, unknown>, opt: js.Options | undefined, file: string) {
  const expectedFile = nodePath.join(
    dirname,
    '../tests/data/js',
    `${file}.${opt?.dts ? 'd.ts' : 'js'}`,
  );
  const expected = await fsPromises.readFile(expectedFile, 'utf8');
  assert.strictEqual(js.convert(obj, opt), expected);
}

it('Types', async () => {
  await t({ intValue: -12, strValue: 'haha"\'', nullValue: null }, undefined, 'types');
});

it('Types (dts)', async () => {
  await t(
    {
      intValue: -12,
      strValue: 'haha"\'',
      nullValue: null,
    },
    { dts: true },
    'types',
  );
});

it('Custom header', async () => {
  await t(
    { intValue: -12, strValue: 'haha"\'', nullValue: null, arrayValue: [32, 'wow', null] },
    { header: '__HEAD__' },
    'header',
  );
});

it('Enums', async () => {
  await t(
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
    undefined,
    'enums',
  );
});

it('Enums (dts)', async () => {
  await t(
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
    'enums-dts',
  );
});

it('Enums (string)', async () => {
  await t(
    {
      __enums: {
        color: ['red', 'blue'],
        color2: {
          r: 'red',
          b: 'blue',
        },
      },
    },
    undefined,
    'enumsStr',
  );
});

it('Enums (dts) (string)', async () => {
  await t(
    {
      __enums: {
        color: ['red', 'blue'],
        color2: {
          r: 'red',
          b: 'blue',
        },
      },
    },
    { dts: true },
    'enumsStr-dts',
  );
});
