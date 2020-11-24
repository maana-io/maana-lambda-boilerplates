const persist = async ({ ckg, svcRef, fn, inputName, inputType, data }) => {
  const query = `mutation ${fn}($input: [${inputType}]) { ${fn}(${inputName}: $input) }`;
  const args = {
    svcRef,
    query,
    variables: { input: data },
  };
  const res = await ckg(args);
  const ids = res[fn];
  return ids && ids.length > 0 ? ids[0] : null;
};

/** Given a collection of objects and an array of field names, return a
 * dictionary, where each element is a mapping from one of the provided
 * field names to an array containing the non-empty values of the
 * underlying type of that field.
 * @param objs - the list of objects from which to collect the
 *   fields
 * @param fieldnames - the names of the fields for which the values
 *   will be collected.
 */
function collect(objs, fieldnames) {
  const entries = fieldnames.map((fieldname) => [
    fieldname,
    objs
      .map((obj) => {
        const x = obj[fieldname];
        if (x == null) return [];
        if (Array.isArray(x)) return x.filter((elem) => elem != null);
        return [x];
      })
      .reduce((z, x) => z.concat(x), []),
  ]);
  return Object.fromEntries(entries);
}

/** Call either the boilerPlate add many function or the persistMany
 * to store a collection of values.
 */
const persistMany = async ({ ckg, svcRef, fn, inputName, inputType, data }) => {
  const query = `mutation ${fn}($input: ${inputType} ) { ${fn}(${inputName}: $input) }`;
  const args = {
    svcRef,
    query,
    variables: { input: data },
  };
  const res = await ckg(args);
  return res[fn];
};

/** Given a value of a field, then take the appropriate action
 * required to flatten it:
 * - if it is a null value, return null
 * - if it is a scalar, return it as is.
 * - if it is a object, return the id field.
 * - if it is an array, flatten each element.
 */
function flattenField(value) {
  if (value == null) return null;
  if (Array.isArray(value)) return value.map(flattenField);
  if (value.id) return value.id;
  throw new Error(
    `Could not flatten field because \${value} is not an instance, or an array of instances.`
  );
}

/** Given a object, and an array of field names which
 * are objects, return a new object where all the object valued
 * fields have been replaced with their ids.
 */
function flatten(obj, fieldnames) {
  const ret = { ...obj };
  for (fieldname of fieldnames) {
    ret[fieldname] = flattenField(obj[fieldname]);
  }
  return ret;
}

/** Given a ckg client, a persist plan and a possibly null or empty
 * collection of objects, persist the object and all of its object
 * valued fields.
 */
const flattenAndPersist = async ({ ckg, persistPlan, objects }) => {
  if (objects) {
    const fieldnames = Object.keys(persistPlan.fields);
    const collections = collect(objects, fieldnames);
    const flatObjects = objects.map((obj) => flatten(obj, fieldnames));
    for (const key of fieldnames) {
      await persistMany({
        ckg,
        data: collections[key],
        ...persistPlan.fields[key],
      }); // ignore result (but throw exception)
    }
    return persistMany({ ckg, data: flatObjects, ...persistPlan.root });
  } else {
    return null;
  }
};

module.exports = {
  flattenAndPersist,
  persist,
  persistMany,
};
