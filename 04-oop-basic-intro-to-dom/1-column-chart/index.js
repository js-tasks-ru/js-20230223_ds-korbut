export default class ColumnChart {
  element = null;
  chartHeight = 50;
  isLoading = true;
  #data;
  #label;
  #value;
  #link;
  #formatHeading;

  constructor({
    data = [],
    label = "", value = 0,
    link = "",
    formatHeading = val => val
  } = {}) {
    this.#data = this.#getPrepareData(data);
    this.#label = label;
    this.chartHeight = 50;
    this.#value = value;
    this.#formatHeading = formatHeading;
    this.#link = link;

    this.#render();
  }

  #getTemplate() {
    return `
      <div class="column-chart">
        <div class="column-chart__title">
          Total ${this.#label}
          ${this.#getLinkTemplate()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${this.#formatHeading(this.#value)}
          </div>
          <div data-element="body" class="column-chart__chart">
            ${this.#getChartElements()}
          </div>
        </div>
      </div>
    `;
  }

  #getLinkTemplate() {
    if (this.#link) {
      return `<a class="column-chart__link" href=${this.#link}>View all</a>`;
    }
    return '';
  }

  #getPrepareData(data) {
    if (data.length === 0) {
      return [];
    }

    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;
    this.isLoading = false;
    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });

  }

  #getChartElements() {
    return this.#data.map((el) => {
      return `
        <div style="--value: ${el.value}" data-tooltip=${el.percent}></div>
      `;
    }).join('');
  }

  #render() {
    const element = document.createElement('div');

    element.innerHTML = this.#getTemplate();

    if (this.isLoading) {
      element.querySelector('.column-chart').classList.add('column-chart_loading');
    }
    this.element = element.firstElementChild;
  }

  update(data) {
    this.isLoading = true;
    this.#data = this.#getPrepareData(data);
    this.#render();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
  }
}
