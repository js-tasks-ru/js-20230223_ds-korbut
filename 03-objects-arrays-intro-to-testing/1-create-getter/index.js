/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const props = path.split('.');
  return (product) => {
    let answer = product;
    for (let i = 0; i < props.length; i++) {
      if (answer.hasOwnProperty(props[i])) {
        answer = answer[props[i]];
      } else {
        return;
      }
    }
    return answer;
  };
}
