export function camelCaseKeys(rawObject: any): any {
  if (!rawObject) {
    return rawObject;
  }

  const newObject: any = {};
  const calculatedObject = { ...rawObject };

  if (Array.isArray(rawObject)) {
    return rawObject.map(elem => {
      if (typeof elem === 'object') {
        return camelCaseKeys(elem);
      }
      return elem;
    });
  }

  const keys = Object.keys(rawObject);

  for (const key of keys) {
    let newKey: string;

    if (typeof calculatedObject[key] === 'object') {
      const cameledValue = camelCaseKeys(calculatedObject[key]);
      calculatedObject[key] = cameledValue;
    }

    const trimmedKey = key.trim();
    if (trimmedKey.length === 0) {
      throw new Error('Wrong key value');
    }

    newKey = trimmedKey.replace(/[_.\- ]+(\w|$)/g, (_m, p1) => {
      return p1.toUpperCase();
    });

    newKey = newKey.slice(0, 1).toLowerCase() + newKey.slice(1);
    newObject[newKey] = calculatedObject[key];
  }

  return newObject;
}
