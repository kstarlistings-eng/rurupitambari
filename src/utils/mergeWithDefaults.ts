export const mergeWithDefaults = <T extends Record<string, any>>(
  data: Partial<T> | undefined,
  defaults: T,
): T => {
  if (!data) return defaults;
  return Object.entries(defaults).reduce((acc, [key, defaultValue]) => {
    acc[key as keyof T] = (data[key as keyof T] ?? defaultValue) as any;
    return acc;
  }, {} as T);
};
