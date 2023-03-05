/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
  if (!arr) {
    return [];
  }
  const answer = [];
  const answerMap = {};

  for (const element of arr) {
    if (!answerMap[element]) {
      answerMap[element] = true;
      answer.push(element);
    }
  }

  return answer;
}
