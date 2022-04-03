import * as cm from './common.js';

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
  let code = opt?.header ? `${opt.header}\n` : '';
  for (const [key, val] of Object.entries(obj)) {
    if (cm.ignoredProps.has(key)) {
      continue;
    }
    code += `export${opt?.dts ? ' declare' : ''} const ${key}${getTail(val, opt?.dts)};\n`;
  }

  // Enums
  const enums = obj[cm.enumsKey] as Record<string, unknown> | undefined;
  if (enums) {
    for (const [enumName, values] of Object.entries(enums)) {
      if (code.length) {
        code += '\n';
      }
      const typeName = cm.capitalizeFirstLetter(enumName);

      if (opt?.dts) {
        code += `export declare enum ${typeName} {\n`;
        if (Array.isArray(values)) {
          code += `  ${values.map((v, i) => `${v} = ${i}`).join(', ')}\n`;
        } else {
          code += `  ${Object.entries(values as Record<string, undefined>)
            .map(([k, v]) => `${k} = ${JSON.stringify(v)}`)
            .join(', ')}\n`;
        }
        code += '}\n';
      } else {
        code += `export var ${typeName};\n`;
        code += `(function (${typeName}) {\n`;
        if (Array.isArray(values)) {
          // eslint-disable-next-line @typescript-eslint/no-loop-func
          values.forEach((v, i) => {
            code += `  ${typeName}[${typeName}["${v}"] = ${i + 1}] = "${v}";\n`;
          });
        } else {
          // eslint-disable-next-line @typescript-eslint/no-loop-func
          Object.entries(values as Record<string, undefined>).forEach(([k, v]) => {
            code += `  ${typeName}["${k}"] = ${JSON.stringify(v)};\n`;
          });
        }
        code += `})(${typeName} || (${typeName} = {}));\n`;
      }
    }
  }
  return code;
}
