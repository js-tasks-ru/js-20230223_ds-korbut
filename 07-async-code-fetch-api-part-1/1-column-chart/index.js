import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  chartHeight = 50;
  subElements = {};
  #url;
  #range;
  #label;
  #formatHeading;
  #link;
  #data = {};
  #maxValue;

  constructor({
    url = '',
    range = {
      from: '',
      to: '',
    },
    label = '',
    link = '',
    formatHeading = val => val,
  } = {}) {
    this.#url = url;
    this.#range = range;
    this.#label = label;
    this.#link = link;
    this.#formatHeading = formatHeading;
    this.render();
    this.update(range.from, range.to)
      .catch(e => console.log(e));
  }

  #getLinkString() {
    if (this.#link) {
      return `<a href=${this.#link} class="column-chart__link">View all</a>`;
    }
    return '';
  }

  #getChartCount() {
    const values = Object.values(this.#data) || 0;
    this.#maxValue = Math.max(...values);
    const sum = values.reduce((acc, val) => acc + val, 0);

    return this.#formatHeading(sum);
  }

  #getDataTemplate() {
    return Object.values(this.#data).map(el => {
      const percent = (el / this.#maxValue * 100).toFixed();
      const value = percent / 100 * this.chartHeight;
      return `<div style="--value: ${value}" data-tooltip="${percent}%"></div>`;
    }).join('');
  }

  #getTemplate() {
    return `<div class="column-chart" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        Total ${this.#label}
        ${this.#getLinkString()}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.#getChartCount()}</div>
        <div data-element="body" class="column-chart__chart">
            ${this.#getDataTemplate()}
        </div>
      </div>
    </div>
`;
  }

  #getSubElements() {
    const subElements = {};
    const elements = this.element.querySelectorAll('[data-element]');

    for (const el of elements) {
      const elType = el.dataset.element;
      subElements[elType] = el;
    }

    return subElements;
  }

  async update(from, to) {
    await this.loadData({ from, to });
    this.subElements.header.innerHTML = this.#getChartCount();
    this.subElements.body.innerHTML = this.#getDataTemplate();

    return this.#data;
  }

  async loadData(params) {
    this.element.classList.add('column-chart_loading');
    const urlParams = new URLSearchParams(params);
    const path = `api/dashboard/${this.#label}`;
    const url = new URL(path, BACKEND_URL);

    for (const [key, value] of urlParams) {
      url.searchParams.set(key, value);
    }

    try {
      this.#data = await fetchJson(url);
    } catch (e) {
      console.error(e);
    } finally {
      if (Object.values(this.#data).length) {
        this.element.classList.remove('column-chart_loading');
      }
    }
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.#getTemplate();

    this.element = wrapper.firstElementChild;
    this.subElements = this.#getSubElements();

    this.element.classList.add('column-chart_loading');
  }

  #remove() {
    if (this.element) {
      this.element.remove();
    }

    this.element = null;
  }

  destroy() {
    this.#remove();
  }
}
