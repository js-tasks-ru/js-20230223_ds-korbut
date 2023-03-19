export default class SortableTable {
  element = null;
  #order = '';
  #field = '';
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.data = data;
    this.headerConfig = headerConfig;
    this.#render();
  }

  #getSortData() {
    const dataCopy = [...this.data];
    const {sortType} = this.headerConfig.find(el => el.id === this.#field);
    return dataCopy.sort(({[this.#field]: a}, {[this.#field]: b}) => {
      const sortDirection = this.#order === 'asc' ? 1 : -1;

      switch (sortType) {
      case 'string':
        return a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'}) * sortDirection;
      case 'number':
        return (a - b) * sortDirection;
      }
    });
  }

  sort(field = '', order = 'asc') {
    if (!field) {
      return;
    }
    this.#field = field;
    this.#order = order;

    const headers = this.subElements.header.querySelectorAll('[data-order]');

    headers.forEach(el => {
      if (el.dataset.id === this.#field) {
        el.dataset.order = this.#order;
      } else {
        el.dataset.order = '';
      }
    });

    this.subElements.body.innerHTML = this.#getTableBodyRows(this.#getSortData());
  }

  #getTableHeaderRow({id, sortable, title}) {
    return `<div class="sortable-table__cell" data-id=${id} data-sortable="${sortable}" data-order=''>
          <span>${title}</span>
          <span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
          </span>
        </div>`;
  }

  #getTableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headerConfig.map(this.#getTableHeaderRow).join('')}
    </div>`;
  }

  #getTableBodyRows(data) {
    return data.map(el => {
      return `<a href="/products/${el.id}" class="sortable-table__row">
        ${this.#getTableBodyRow(el)}
       </a>`;
    }).join('');
  }

  #getTableBodyRow(product) {
    return this.headerConfig.map(header => {
      if (header.template) {
        return header.template(product[header.id]);
      }
      return `<div class="sortable-table__cell">${product[header.id]}</div>`;
    }).join('');
  }

  #getTableBody() {
    return `<div data-element="body" class="sortable-table__body">
      ${this.#getTableBodyRows(this.data)}
    </div>`;
  }

  #getTable() {
    return `<div class="sortable-table">
          ${this.#getTableHeader()}
          ${this.#getTableBody()}
        </div>`;
  }

  #getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }

    return result;
  }

  #render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.#getTable();
    this.element = wrapper.firstElementChild;
    this.subElements = this.#getSubElements();
  }

  #remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.#remove();
  }
}

