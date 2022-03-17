export interface Options {
  // TypeScript definition mode.
  dts?: boolean;
  // Allows an extra string inserted at the top of output file.
  header?: string;
}

function getTail(val: unknown, dts: boolean | undefined) {
  if (dts && Array.isArray(val)) {
    return `: ${typeof val[0]}[]`;
  }
  return ` = ${JSON.stringify(val)}`;
}

export function convert(obj: Record<string, unknown>, opt?: Options): string {
  let result = opt?.header ? `${opt.header}\n` : '';
  for (const [key, val] of Object.entries(obj)) {
    result += `export${opt?.dts ? ' declare' : ''} const ${key}${getTail(val, opt?.dts)};\n`;
  }
  return result;
}
