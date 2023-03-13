export default class NotificationMessage {
  #type;
  #message;
  duration;
  element = null;
  static #activeElement = null;

  constructor(message = '', settings = {
    type: 'success',
    duration: 1000,
  }) {
    this.#message = message;
    this.#type = settings.type;
    this.duration = settings.duration;
    this.#render();
  }

  show(targetElement) {
    this.destroy();
    NotificationMessage.#activeElement = this.element;
    const body = document.querySelector('body');
    const target = targetElement ?? body;
    target.append(this.element);
    setTimeout(() => {
      this.destroy();
    }, this.duration);
  }

  #getTemplate() {
    return `<div class="notification ${this.#type}" style="--value:${this.duration / 1000}s">
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">${this.#type}</div>
      <div class="notification-body">
        ${this.#message}
      </div>
    </div>
  </div>`;
  }

  #render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.#getTemplate();
    this.destroy();
    this.element = wrapper.firstElementChild;
  }

  remove() {
    if (NotificationMessage.#activeElement) {
      NotificationMessage.#activeElement.remove();
      NotificationMessage.#activeElement = null;

    }
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
  }
}
