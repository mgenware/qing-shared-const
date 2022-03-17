import * as assert from 'assert';
import { promises as fsPromises } from 'fs';
import * as nodePath from 'path';
import { fileURLToPath } from 'url';
import { go } from '../dist/main.js';

const __dirname = nodePath.dirname(fileURLToPath(import.meta.url));

async function t(obj: Record<string, unknown>, args: go.InputArgs, file: string) {
  const expectedFile = nodePath.join(__dirname, '../tests/data/go', `${file}.go`);
  const expected = await fsPromises.readFile(expectedFile, 'utf8');
  assert.strictEqual(go.convert(obj, args), expected);
}

it('Basic', async () => {
  await t(
    {
      hello: '1',
      world: '2',
      intProp: 123,
      doubleProp: 12.3,
    },
    { packageName: 'test', typeName: 'Test' },
    'basic',
  );
});

it('parseFunc', async () => {
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
      parseFunc: true,
    },
    'parseFunc',
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
      parseFunc: true,
      header: '/** This is a header. */\n',
    },
    'header',
  );
});

it('injectValues', async () => {
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
      parseFunc: true,
      variableName: 'Var',
    },
    'injectValues',
  );
});

it('No JSON tag', async () => {
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
      hideJSONTags: true,
    },
    'noJSONTag',
  );
});

it('Basic without formatting', async () => {
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
      disablePropertyFormatting: true,
    },
    'basicWithoutFormatting',
  );
});
