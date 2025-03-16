import TicketView from '../ticket/TicketView';
import TicketForm from '../ticket/TicketForm';

export default class HelpDesk {
  constructor(containerEl, ticketService) {
    if (!(containerEl instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }
    this.containerEl = containerEl;
    this.ticketService = ticketService;

    this.onElementClick = this.onElementClick.bind(this);
  }

  static get selector() { return '.helpdesk'; }
  static get addSelector() { return '.helpdesk-add'; }
  static get listSelector() { return '.helpdesk-list'; }

  static get markup() {
    return `
      <div class="helpdesk">
        <button class="helpdesk-add" type="button">Добавить тикет</button>
        <ul class="helpdesk-list"></ul>
      </div>
    `;
  }

  init() {
    this.containerEl.insertAdjacentHTML('beforeEnd', HelpDesk.markup);
    this.element = this.containerEl.querySelector(HelpDesk.selector);
    this.listEl = this.element.querySelector(HelpDesk.listSelector);

    this.ticketView = new TicketView(this.listEl);
    this.ticketForm = new TicketForm(this.element, this.ticketView, this.ticketService);

    this.ticketService.list(tickets => {
      tickets.forEach(ticket => this.ticketView.insertTicket(ticket));
      this.element.addEventListener('click', this.onElementClick);
    });
  }

  onElementClick(e) {
    if (e.target.classList.contains(HelpDesk.addSelector.slice(1))) {
      this.ticketForm.insertCreationForm();
      return;
    }

    const ticketEl = e.target.closest(TicketView.ticketSelector);

    if (e.target.classList.contains(TicketView.statusSelector.slice(1))) {
      this.toggleStatus(ticketEl.id, e.target);
    } else if (e.target.classList.contains(TicketView.nameSelector.slice(1))) {
      this.toggleDescription(ticketEl);
    } else if (
      e.target.classList.contains(TicketView.updateSelector.slice(1)) &&
      !this.ticketForm.wasInsertUpdationFormCalled
    ) {
      this.ticketForm.insertUpdationForm(ticketEl);
    } else if (e.target.classList.contains(TicketView.deleteSelector.slice(1))) {
      this.ticketForm.insertDeletionForm(ticketEl);
    }
  }

  toggleStatus(id, statusEl) {
    if (!statusEl.classList.contains(TicketView.checkedSelector.slice(1))) {
      this.ticketService.update(id, { status: true });
    } else {
      this.ticketService.update(id, { status: false });
    }

    statusEl.classList.toggle(TicketView.checkedSelector.slice(1));
  }

  toggleDescription(ticketEl) {
    const descriptionEl = ticketEl.querySelector(TicketView.descriptionSelector);
    if (descriptionEl) {
      descriptionEl.remove();
    } else {
      this.ticketService.get(ticketEl.id, this.ticketView.insertDescription);
    }
  }
}