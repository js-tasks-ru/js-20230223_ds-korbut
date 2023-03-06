/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === 0 || !string) {
    return '';
  }

  if (!size) {
    return string;
  }

  let counter = 0;
  let answer = '';
  let searchingSymbol = '';

  for (const symbol of string) {
    if (symbol === searchingSymbol) {
      if (counter === size) {
        continue;
      }
      counter++;
      answer += symbol;
    } else {
      answer += symbol;
      counter = 1;
      searchingSymbol = symbol;
    }
  }

  return answer;
}
