import * as assert from 'assert';
import { promises as fsPromises } from 'fs';
import * as nodePath from 'path';
import { fileURLToPath } from 'url';
import { go } from '../dist/main.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
const dirname = nodePath.dirname(fileURLToPath(import.meta.url));

async function t(obj: Record<string, unknown>, args: go.InputArgs, file: string) {
  const expectedFile = nodePath.join(dirname, '../tests/data/go', `${file}.go`);
  const expected = await fsPromises.readFile(expectedFile, 'utf8');
  assert.strictEqual(go.convert(obj, args), expected);
}

it('Types', async () => {
  await t(
    { intValue: -12, strValue: 'haha"\'' },
    { packageName: 'test', typeName: 'Test' },
    'types',
  );
});

it('header', async () => {
  await t(
    {
      hello: '1',
      world: '2',
      intProp: 123,
      doubleProp: 12.3,
    },
    {
      packageName: 'test',
      typeName: 'Test',
      header: '/** This is a header. */\n',
    },
    'header',
  );
});

it('Enums', async () => {
  await t(
    {
      str: 'hello world',
      intProp: 123,
      doubleProp: 12.3,
      __enums: {
        color: { values: ['red', 'blue'] },
        color2: { values: ['red', 'blue'] },
      },
    },
    { packageName: 'test', typeName: 'Test' },
    'enums',
  );
});

it('Enums (weak)', async () => {
  await t(
    {
      str: 'hello world',
      intProp: 123,
      doubleProp: 12.3,
      __enums: {
        color: { values: ['red', 'blue'] },
        color2: { values: ['red', 'blue'], weakGoBaseType: true },
      },
    },
    { packageName: 'test', typeName: 'Test' },
    'enumsWeak',
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
    { packageName: 'test', typeName: 'Test' },
    'enumsStr',
  );
});

it('Enums (string) (weak)', async () => {
  await t(
    {
      __enums: {
        color: { values: ['red', 'blue'] },
        color2: {
          weakGoBaseType: true,
          stringType: true,
          values: ['red', 'blue'],
        },
      },
    },
    { packageName: 'test', typeName: 'Test' },
    'enumsStrWeak',
  );
});
