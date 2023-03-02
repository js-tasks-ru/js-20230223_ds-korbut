/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const answer = arr.slice();
  answer.sort((a, b) => {
    const i = param === 'asc' ? 1 : -1;
    return a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'}) * i;
  });

  return answer;
}
