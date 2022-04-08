import * as cm from './common.js';

export interface InputArgs {
  packageName: string;
  typeName: string;
  header?: string;
}

function endsWithTwoNewlines(s: string) {
  const c = s.length;
  return s.charAt(c - 1) === '\n' && s.charAt(c - 2) === '\n';
}

export function convert(obj: Record<string, unknown>, args: InputArgs) {
  let code = args.header ? `${args.header}\n` : '';
  code += `package ${args.packageName}\n\n`;

  for (const [key, val] of Object.entries(obj)) {
    if (cm.ignoredProps.has(key)) {
      continue;
    }
    code += `const ${cm.capitalizeFirstLetter(key)} = ${JSON.stringify(val)}\n`;
  }

  // Enums
  const enums = obj[cm.enumsKey] as Record<string, unknown> | undefined;
  if (enums) {
    for (const [enumName, enumDefRaw] of Object.entries(enums)) {
      const enumDef = enumDefRaw as cm.EnumDef;
      const { values } = enumDef;
      const typeName = cm.capitalizeFirstLetter(enumName);
      if (!endsWithTwoNewlines(code)) {
        code += '\n';
      }

      const isArray = Array.isArray(values);
      let stringType = false;
      if (!isArray && typeof Object.values(values)[0] === 'string') {
        stringType = true;
      }

      code += `type ${typeName} ${stringType ? 'string' : 'int'}\n\n`;
      code += 'const (\n';
      if (isArray) {
        code += `${values
          .map(
            (v, i) =>
              `\t${typeName}${cm.capitalizeFirstLetter(`${v}`)}${
                i === 0 ? ` ${typeName} = iota + 1` : ''
              }`,
          )
          .join('\n')}\n`;
      } else {
        code += `${Object.entries(values)
          .map(
            ([k, v], i) =>
              `\t${typeName}${cm.capitalizeFirstLetter(`${k}`)}${
                i === 0 ? ` ${typeName}` : ''
              } = ${JSON.stringify(v)}`,
          )
          .join('\n')}\n`;
      }
      code += ')\n';
    }
  }
  return code;
}
