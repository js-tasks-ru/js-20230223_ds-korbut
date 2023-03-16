export default class NotificationMessage {
  #type;
  #message;
  #timer;
  duration;
  element;
  static #activeNotification;

  constructor(message = '', settings = {
    type: 'success',
    duration: 1000,
  }) {
    this.#message = message;
    this.#type = settings.type;
    this.duration = settings.duration;
    this.#render();
  }

  show(targetElement = document.body) {
    if (NotificationMessage.#activeNotification) {
      NotificationMessage.#activeNotification.remove();
      NotificationMessage.#activeNotification = null;
    }
    NotificationMessage.#activeNotification = this;
    targetElement.append(this.element);
    this.#timer = setTimeout(() => {
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
    if (this.element) {
      this.element.remove();
    }
    clearTimeout(this.#timer);
  }

  destroy() {
    this.remove();
  }
}
