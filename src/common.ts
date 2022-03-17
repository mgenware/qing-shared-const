export const enumsKey = '__enums';
export const ignoredProps = new Set<string>([enumsKey]);

export function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
