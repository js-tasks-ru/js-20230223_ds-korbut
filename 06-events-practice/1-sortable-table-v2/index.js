export default class SortableTable {
  headerConfig;
  isSortLocally;
  field = '';
  order = '';
  element = null;
  subElements = {};

  constructor(headerConfig, {
    data = [],
    sorted = {}
  } = {}) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.isSortLocally = sorted.isSortLocally ?? true;
    this.field = sorted.id ?? headerConfig.find(item => item.sortable).id;
    this.order = sorted.order ?? "desc";
    this.render();
    this.initEventListeners();
  }

  getTableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.getTableHeaderRow()}
    </div>`;
  }

  getTableHeaderRow() {
    return this.headerConfig.map(header => {
      const isSorted = header.id === this.field;
      const dataOrder = isSorted ? this.order : '';
      return `<div class="sortable-table__cell" data-id=${header.id} data-sortable=${header.sortable} data-order=${dataOrder}>
        <span>${header.title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>`;
    }).join('');
  }

  getTableRow(data) {
    return this.headerConfig.map(header => {
      if (header.template) {
        return header.template(data);
      }
      return `<div class="sortable-table__cell">${data[header.id]}</div>`;
    }).join('');
  }

  getTableBodyRows(data) {
    return data.map(el => {
      return `<a href=${el.id} class="sortable-table__row">
        ${this.getTableRow(el)}
      </a>`;
    }).join('');
  }

  getTableBody(data) {
    return `<div data-element="body" class="sortable-table__body">
        ${this.getTableBodyRows(data)}
    </div>
`;
  }

  getTable(data) {
    return `<div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
            ${this.getTableHeader()}
            ${this.getTableBody(data)}
        </div>
    </div>`;
  }


  getSortedData(field, order) {
    const data = [...this.data];
    const { sortType } = this.headerConfig.find(el => el.id === field);
    const sortIndex = order === 'asc' ? 1 : -1;

    return data.sort((a, b) => {
      switch (sortType) {
      case 'string':
        return a[field].localeCompare(b[field], ['ru', 'en'], {caseFirst: 'upper'}) * sortIndex;
      case 'number':
        return (a[field] - b[field]) * sortIndex;
      }
    });
  }

  sort(field, order) {
    let sortedData;
    if (this.isSortLocally) {
      sortedData = this.getSortedData(field, order);
      this.subElements.body.innerHTML = this.getTableBodyRows(sortedData);
    }
  }

  getSubElements() {
    const subElements = {};
    const elements = this.element.querySelectorAll('[data-element]');

    for (const element of elements) {
      const name = element.dataset.element;
      subElements[name] = element;
    }

    return subElements;
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', (evt) => {
      const headerElement = evt.target.closest('.sortable-table__cell');
      const elementId = headerElement.dataset.id;
      const isSortable = headerElement.dataset.sortable === 'true';
      const headers = this.subElements.header.querySelectorAll('.sortable-table__cell');

      for (const header of headers) {
        header.dataset.order = '';
      }

      if (!isSortable) {
        return;
      }

      if (elementId === this.field) {
        this.order = this.order === 'desc' ? 'asc' : 'desc';
      } else {
        this.field = elementId;
        this.order = 'desc';
      }
      headerElement.dataset.order = this.order;
      this.sort(this.field, this.order);
    });
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTable(this.getSortedData(this.field, this.order));
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
    this.element = null;
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
