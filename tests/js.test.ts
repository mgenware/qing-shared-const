import * as assert from 'assert';
import { promises as fsPromises } from 'fs';
import * as nodePath from 'path';
import { fileURLToPath } from 'url';
import { js } from '../dist/main.js';

const __dirname = nodePath.dirname(fileURLToPath(import.meta.url));

async function t(obj: Record<string, unknown>, opt: js.Options | undefined, file: string) {
  const expectedFile = nodePath.join(
    __dirname,
    '../tests/data/js',
    `${file}.${opt?.dts ? 'd.ts' : 'js'}`,
  );
  const expected = await fsPromises.readFile(expectedFile, 'utf8');
  assert.strictEqual(js.convert(obj, opt), expected);
}

it('basic', async () => {
  await t(
    { intValue: -12, strValue: 'haha"\'', nullValue: null, arrayValue: [32, 'wow', null] },
    undefined,
    'basic',
  );
});

it('Typescript definition', async () => {
  await t(
    {
      intValue: -12,
      strValue: 'haha"\'',
      nullValue: null,
      intArr: [1, 2],
      strArr: ['a', 'b'],
    },
    { dts: true },
    'dts',
  );
});

it('Custom header', async () => {
  await t(
    { intValue: -12, strValue: 'haha"\'', nullValue: null, arrayValue: [32, 'wow', null] },
    { header: '__HEAD__' },
    'header',
  );
});
