/* eslint-disable no-lonely-if */
/* eslint-disable @typescript-eslint/no-loop-func */
import * as cm from './common.js';

export interface Options {
  // TypeScript definition mode.
  dts?: boolean;
  // Allows an extra string inserted at the top of output file.
  header?: string;
  // Use this generate flat constants instead of TS enums.
  // Mainly used for tree-shaking.
  flattenEnums?: boolean;
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
    for (const [enumName, enumDefRaw] of Object.entries(enums)) {
      const enumDef = enumDefRaw as cm.EnumDef;
      const { values } = enumDef;
      if (code.length) {
        code += '\n';
      }
      const typeName = cm.capitalizeFirstLetter(enumName);

      const flat = !!opt?.flattenEnums;
      if (flat) {
        code += `/* ${typeName} */\n`;
      }
      if (opt?.dts) {
        // DTS + Array.
        if (!flat) {
          code += `export declare enum ${typeName} {\n`;
        }
        if (Array.isArray(values)) {
          if (flat) {
            code += values
              .map(
                (v, i) =>
                  `export declare const ${enumName}${cm.capitalizeFirstLetter(`${v}`)} = ${
                    i + 1
                  };\n`,
              )
              .join('');
          } else {
            code += `  ${values.map((v, i) => `${v} = ${i + 1}`).join(', ')}\n`;
          }
        } else {
          // DTS + Object.
          if (flat) {
            code += Object.entries(values as Record<string, undefined>)
              .map(
                ([k, v]) =>
                  `export declare const ${enumName}${cm.capitalizeFirstLetter(
                    k,
                  )} = ${JSON.stringify(v)};\n`,
              )
              .join('');
          } else {
            code += `  ${Object.entries(values as Record<string, undefined>)
              .map(([k, v]) => `${k} = ${JSON.stringify(v)}`)
              .join(', ')}\n`;
          }
        }
        if (!flat) {
          code += '}\n';
        }
      } else {
        if (!flat) {
          code += `export var ${typeName};\n`;
          code += `(function (${typeName}) {\n`;
        }
        if (Array.isArray(values)) {
          // JS + Array.
          if (flat) {
            values.forEach((v, i) => {
              code += `export const ${enumName}${cm.capitalizeFirstLetter(`${v}`)} = ${i + 1};\n`;
            });
          } else {
            values.forEach((v, i) => {
              code += `  ${typeName}[${typeName}["${v}"] = ${i + 1}] = "${v}";\n`;
            });
          }
        } else {
          // JS + Object.
          if (flat) {
            Object.entries(values as Record<string, undefined>).forEach(([k, v]) => {
              code += `export const ${enumName}${cm.capitalizeFirstLetter(k)} = ${JSON.stringify(
                v,
              )};\n`;
            });
          } else {
            Object.entries(values as Record<string, undefined>).forEach(([k, v]) => {
              code += `  ${typeName}["${k}"] = ${JSON.stringify(v)};\n`;
            });
          }
        }
        if (!flat) {
          code += `})(${typeName} || (${typeName} = {}));\n`;
        }
      }
    }
  }
  return code;
}
