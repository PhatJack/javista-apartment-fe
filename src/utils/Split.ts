interface SplitResult<T> {
  [key: string]: any;
  items: T[];
}

export function splitByKey<T>(key: keyof T, array?: T[]): SplitResult<T>[] {
  const result: SplitResult<T>[] = [];

  array?.forEach(item => {
    const keyValue = item[key];

    // Find existing key object
    let keyObj = result.find(obj => obj[key as string] === keyValue);

    // If the key object doesn't exist, create it
    if (!keyObj) {
      keyObj = { [key]: keyValue, items: [] };
      result.push(keyObj);
    }

    // Add the item to the corresponding key object
    keyObj.items.push(item);
  });

  return result;
}