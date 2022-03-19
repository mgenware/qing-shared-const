import * as cm from './common.js';

export interface InputArgs {
  packageName: string;
  typeName: string;
  header?: string;
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
    for (const [enumName, values] of Object.entries(enums)) {
      if (!Array.isArray(values)) {
        throw new Error(`Enum values must be arrays, got ${JSON.stringify(values)}`);
      }

      const typeName = cm.capitalizeFirstLetter(enumName);
      code += '\n';
      code += `type ${typeName} int\n\n`;
      code += 'const (\n';
      code += `${values
        .map(
          (v, i) =>
            `\t${typeName}${cm.capitalizeFirstLetter(`${v}`)}${
              i === 0 ? ` ${typeName} = iota + 1` : ''
            }`,
        )
        .join('\n')}\n`;
      code += ')\n';
    }
  }
  return code;
}
