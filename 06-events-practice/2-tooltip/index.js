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

  onPointerOver = (evt) => {
    const closestTooltip = evt.target.closest('[data-tooltip]');
    if (closestTooltip) {
      const tooltip = closestTooltip.dataset.tooltip;
      this.render(tooltip);
      this.element.style.left = evt.clientX + 'px';
      this.element.style.top = evt.clientY + 'px';
      document.addEventListener('pointermove', this.onPointerMove);
    }
  }

  onPointerOut = () => {
    this.destroy();
    document.removeEventListener('pointermove', this.onPointerMove);
  };

  moveTooltip(evt) {
    const shift = 10;
    const left = evt.clientX + shift;
    const top = evt.clientY + shift;
    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
  }

  onPointerMove = (evt) => {
    this.moveTooltip(evt);
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
    document.addEventListener('pointerover', this.onPointerOver);
    document.addEventListener('pointerout', this.onPointerOut);
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
    document.removeEventListener('pointerover', this.onPointerOver);
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerout', this.onPointerOut);

  }
}

export default Tooltip;
