/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  const answer = {};

  if (!fields) {
    return answer;
  }

  const entries = Object.entries(obj).filter((val) => fields.includes(val[0]));

  return Object.fromEntries(entries);
};
