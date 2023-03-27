class Tooltip {
  #tooltip = ''
  element = null;
  #subElements = {};
  static #instance = null;

  constructor() {
    if (Tooltip.#instance) {
      return Tooltip.#instance;
    }
    Tooltip.#instance = this;
  }

  showTooltip = (evt) => {
    const closestTooltip = evt.target.closest('[data-tooltip]');
    this.#tooltip = closestTooltip.dataset.tooltip;
    if (!this.element) {
      this.render(this.#tooltip);
      this.element.style.left = evt.clientX + 'px';
      this.element.style.top = evt.clientY + 'px';
    }

    document.addEventListener('pointermove', this.moveTooltip);
    document.addEventListener('pointerout', this.removeTooltip);
  }

  removeTooltip = () => {
    this.destroy();
    document.removeEventListener('pointerover', this.removeTooltip);
    document.removeEventListener('pointermove', this.moveTooltip);
    document.removeEventListener('pointerout', this.removeTooltip);
  }

  moveTooltip = (evt) => {
    this.element.style.left = evt.clientX + 'px';
    this.element.style.top = evt.clientY + 'px';
  }

  initialize () {
    this.getSubElements();
    this.initEventListeners();
  }

  getSubElements() {
    this.#subElements.tooltips = document.querySelectorAll('[data-tooltip]');
    this.#subElements.body = document.querySelector('body');
  }

  initEventListeners() {
    this.#subElements.tooltips.forEach(tooltip => {
      tooltip.addEventListener('pointerover', this.showTooltip);
    });
  }


  getTemplate() {
    return `<div class="tooltip">${this.#tooltip}</div>`;
  }

  render(value = '') {
    this.#tooltip = value;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    this.#subElements.body.style.position = 'relative';
    this.element = wrapper.firstElementChild;
    this.#subElements.body.append(this.element);
  }

  remove() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }

  destroy() {
    this.remove();
  }
}

export default Tooltip;
