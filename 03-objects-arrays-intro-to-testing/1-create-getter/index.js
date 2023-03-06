/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const props = path.split('.');
  return (product) => {
    let answer = product;
    for (const prop of props) {
      if (answer.hasOwnProperty(prop)) {
        answer = answer[prop];
      } else {
        return;
      }
    }
    return answer;
  };
}
