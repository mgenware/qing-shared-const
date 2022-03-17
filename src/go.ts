export interface InputArgs {
  packageName: string;
  typeName: string;
  parseFunc?: boolean;
  header?: string;
  variableName?: string;
  disablePropertyFormatting?: boolean;
  hideJSONTags?: boolean;
}

export interface PropData {
  name: string;
  namePascalCase: string;
  type: string;
  value: unknown;
}

function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function goType(value: unknown): string {
  if (typeof value === 'string') {
    return 'string';
  }
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'int' : 'float64';
  }
  throw new Error(`Unsupported type of value ${value}`);
}

export function goConstGenCore(
  obj: Record<string, unknown>,
  args: InputArgs,
): [string, PropData[]] {
  let code = args.header ? `${args.header}\n` : '';
  code += `package ${args.packageName}\n\n`;

  if (args.parseFunc === true) {
    code += `import (
\t"encoding/json"
\t"io/ioutil"
)\n\n`;
  }

  code += `// ${args.typeName} ...\n`;
  code += `type ${args.typeName} struct {\n`;

  let maxPropLen = 0;
  let maxTypeLen = 0;
  const sortedProps: PropData[] = [];
  for (const prop of Object.keys(obj).sort()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (obj as any)[prop];
    const propData: PropData = {
      name: prop,
      namePascalCase: capitalizeFirstLetter(prop),
      type: goType(value),
      value,
    };
    if (!args.disablePropertyFormatting) {
      maxPropLen = Math.max(maxPropLen, prop.length);
      maxTypeLen = Math.max(maxTypeLen, propData.type.length);
    }
    sortedProps.push(propData);
  }

  for (const propData of sortedProps) {
    code += `\t${propData.namePascalCase.padEnd(maxPropLen, ' ')}`;
    if (args.hideJSONTags) {
      code += ` ${propData.type}\n`;
    } else {
      code += ` ${propData.type.padEnd(maxTypeLen, ' ')} \`json:"${propData.name}"\`\n`;
    }
  }

  code += '}\n';

  if (args.parseFunc === true) {
    code += '\n';
    const parseFuncName = `Parse${args.typeName}`;
    code += `// ${parseFuncName} loads a ${args.typeName} from a JSON file.
func ${parseFuncName}(file string) (*${args.typeName}, error) {
\tbytes, err := ioutil.ReadFile(file)
\tif err != nil {
\t\treturn nil, err
\t}

\tvar data ${args.typeName}
\terr = json.Unmarshal(bytes, &data)
\tif err != nil {
\t\treturn nil, err
\t}
\treturn &data, nil
}
`;
  }

  if (args.variableName) {
    code += '\n';
    code += `// ${args.variableName} ...\n`;
    code += `var ${args.variableName} *${args.typeName}\n\n`;
    code += 'func init() {\n';
    code += `\t${args.variableName} = &${args.typeName}{\n`;

    for (const propData of sortedProps) {
      code += `\t\t${(propData.namePascalCase + ':').padEnd(maxPropLen + 1, ' ')} ${JSON.stringify(
        propData.value,
      )},\n`;
    }

    code += '\t}\n';
    code += '}\n';
  }

  return [code, sortedProps];
}

export function convert(obj: Record<string, unknown>, args: InputArgs): string {
  const [code] = goConstGenCore(obj, args);
  return code;
}
