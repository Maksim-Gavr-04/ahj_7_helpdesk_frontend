import TicketView from './TicketView';

export default class TicketForm {
  constructor(containerEl, ticketView, ticketService) {
    if (!(containerEl instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }
    this.containerEl = containerEl;
    this.ticketView = ticketView;
    this.ticketService = ticketService;

    this.onOkCreationClick = this.onOkCreationClick.bind(this);
    this.onOkUpdationClick = this.onOkUpdationClick.bind(this);
    this.onOkDeletionClick = this.onOkDeletionClick.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static get popupSelector() { return '.popup'; }
  static get nameSelector() { return '.helpdesk-form__name-textarea'; }
  static get descriptionSelector() { return '.helpdesk-form__description-textarea'; }
  static get okSelector() { return '.helpdesk-form__ok'; }
  static get cancelSelector() { return '.helpdesk-form__cancel'; }

  static get markupOfDeletionForm() {
    return `
      <div class="popup">
        <form class="helpdesk-form">
          <p class="helpdesk-form__title">Удалить тикет</p>
          <p class="helpdesk-form__warning">Вы уверены, что хотите удалить тикет? Это действие необратимо.</p>
          <div class="helpdesk-form__buttons">
            <button class="helpdesk-form__cancel" type="button">Отмена</button>
            <button class="helpdesk-form__ok" type="button">Ок</button>
          </div>
        </form>
      </div>
    `;
  }

  static markup(title, name, description) {
    return `
      <div class="popup">
        <form class="helpdesk-form">
          <p class="helpdesk-form__title">${title}</p>
          <div class="helpdesk-form__group">
            <label for="name" class="helpdesk-form__name-label">Краткое описание</label>
            <textarea id="name" class="helpdesk-form__name-textarea" type="text" required>${name || ''}</textarea>
          </div>
          <div class="helpdesk-form__group">
            <label for="description" class="helpdesk-form__description-label">Подробное описание</label>
            <textarea id="description" class="helpdesk-form__description-textarea" type="text">${description || ''}</textarea>
          </div>
          <div class="helpdesk-form__buttons">
            <button class="helpdesk-form__cancel" type="button">Отмена</button>
            <button class="helpdesk-form__ok" type="button">Ок</button>
          </div>
        </form>
      </div>
    `;
  }

  insertCreationForm() {
    this.containerEl.insertAdjacentHTML('beforeEnd', TicketForm.markup('Добавить тикет'));
    this.actionsAfterInsertForm();
    this.okEl.addEventListener('click', this.onOkCreationClick);
  }

  onOkCreationClick() {
    const name = this.nameEl.value.trim();
    if (name && !/^\s*$/.test(name)) {
      const description = this.descriptionEl.value.trim();

      this.ticketService.create({ name, description }, ticket => {
        this.ticketView.insertTicket(ticket);
        this.okEl.removeEventListener('click', this.onOkCreationClick);
        this.cancel();
      });
    } else { this.emptyNameElValueWarning(); }
  }

  insertUpdationForm(ticketEl) {
    this.wasInsertUpdationFormCalled = true;
    this.ticketEl = ticketEl;
    this.ticketService.get(ticketEl.id, ticket => {
      this.containerEl.insertAdjacentHTML('beforeEnd',
        TicketForm.markup('Изменить тикет', ticket.name, ticket.description)
      );
      this.actionsAfterInsertForm();
      this.okEl.addEventListener('click', this.onOkUpdationClick);
    });
  }

  onOkUpdationClick() {
    const name = this.nameEl.value.trim();
    if (name && !/^\s*$/.test(name)) {
      const description = this.descriptionEl.value.trim();
      const ticketNameEl = this.ticketEl.querySelector(TicketView.nameSelector);
      const ticketDescriptionEl = this.ticketEl.querySelector(TicketView.descriptionSelector);

      this.ticketService.update(this.ticketEl.id, { name, description }, () => {
        ticketNameEl.innerText = name;
        if (ticketDescriptionEl) ticketDescriptionEl.innerText = description;
        this.okEl.removeEventListener('click', this.onOkUpdationClick);
        this.cancel();
      });
    } else { this.emptyNameElValueWarning(); }
  }

  insertDeletionForm(ticketEl) {
    this.ticketEl = ticketEl;
    this.containerEl.insertAdjacentHTML('beforeEnd', TicketForm.markupOfDeletionForm);
    this.actionsAfterInsertForm();
    this.okEl.addEventListener('click', this.onOkDeletionClick);
  }

  onOkDeletionClick() {
    this.ticketService.delete(this.ticketEl.id, () => {
      this.ticketEl.remove();
      this.okEl.removeEventListener('click', this.onOkDeletionClick);
      this.cancel();
    });
  }

  actionsAfterInsertForm() {
    this.popupEl = this.containerEl.querySelector(TicketForm.popupSelector);
    this.nameEl = this.popupEl.querySelector(TicketForm.nameSelector);
    this.descriptionEl = this.popupEl.querySelector(TicketForm.descriptionSelector);
    this.okEl = this.popupEl.querySelector(TicketForm.okSelector);
    this.cancelEl = this.popupEl.querySelector(TicketForm.cancelSelector);
    this.cancelEl.addEventListener('click', this.cancel);
  }

  cancel() {
    this.cancelEl.removeEventListener('click', this.cancel);
    this.popupEl.remove();
    this.cancelEl = null;
    this.okEl = null;
    this.descriptionEl = null;
    this.nameEl = null;
    this.popupEl = null;
    this.ticketEl = null;
    this.wasInsertUpdationFormCalled = false;
  }

  emptyNameElValueWarning() {
    this.nameEl.value = '';
    this.nameEl.placeholder = 'Поле необходимо заполнить...';
    this.nameEl.focus();
  }
}