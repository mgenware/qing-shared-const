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
        color: { values: ['red', 'blue'] },
        color2: { values: ['red', 'blue'] },
      },
    },
    undefined,
    'enums',
  );
});

it('Enums (flat)', async () => {
  await t(
    {
      intValue: -12,
      strValue: 'haha"\'',
      nullValue: null,
      arrayValue: [32, 'wow', null],
      __enums: {
        color: { values: ['red', 'blue'] },
        color2: { values: ['red', 'blue'] },
      },
    },
    { flattenEnums: true },
    'enumsFlat',
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
        color: { values: ['red', 'blue'] },
        color2: { values: ['red', 'blue'] },
      },
    },
    { dts: true },
    'enums-dts',
  );
});

it('Enums (dts) (flat)', async () => {
  await t(
    {
      intValue: -12,
      strValue: 'haha"\'',
      nullValue: null,
      arrayValue: [32, 'wow', null],
      __enums: {
        color: { values: ['red', 'blue'] },
        color2: { values: ['red', 'blue'] },
      },
    },
    { dts: true, flattenEnums: true },
    'enums-dtsFlat',
  );
});

it('Enums (string)', async () => {
  await t(
    {
      __enums: {
        color: { values: ['red', 'blue'] },
        color2: {
          values: ['red', 'blue'],
          stringType: true,
        },
      },
    },
    undefined,
    'enumsStr',
  );
});

it('Enums (string) (flat)', async () => {
  await t(
    {
      __enums: {
        color: { values: ['red', 'blue'] },
        color2: {
          values: ['red', 'blue'],
          stringType: true,
        },
      },
    },
    { flattenEnums: true },
    'enumsStrFlat',
  );
});

it('Enums (dts) (string)', async () => {
  await t(
    {
      __enums: {
        color: { values: ['red', 'blue'] },
        color2: {
          values: ['red', 'blue'],
          stringType: true,
        },
      },
    },
    { dts: true },
    'enumsStr-dts',
  );
});

it('Enums (dts) (string) (flat)', async () => {
  await t(
    {
      __enums: {
        color: { values: ['red', 'blue'] },
        color2: {
          values: ['red', 'blue'],
          stringType: true,
        },
      },
    },
    { dts: true, flattenEnums: true },
    'enumsStrFlat-dts',
  );
});
