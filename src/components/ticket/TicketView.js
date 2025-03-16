export default class TicketView {
  constructor(containerEl) {
    if (!(containerEl instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }
    this.containerEl = containerEl;

    this.insertTicket = this.insertTicket.bind(this);
    this.insertDescription = this.insertDescription.bind(this);
  }

  static get ticketSelector() { return '.ticket'; }
  static get statusSelector() { return '.ticket__status'; }
  static get checkedSelector() { return '.checked'; }
  static get nameSelector() { return '.ticket__name'; }
  static get updateSelector() { return '.ticket__update'; }
  static get deleteSelector() { return '.ticket__delete'; }
  static get descriptionSelector() { return '.ticket-description'; }

  static markup(ticket) {
    const statusClass = ticket.status ? ' checked' : '';
    return `
      <li class="ticket" id="${ticket.id}">
        <div class="ticket-basic">
          <div class="ticket__status${statusClass}"></div>
          <p class="ticket__name">${ticket.name}</p>
          <p class="ticket__time">${ticket.created}</p>
          <div class="ticket__buttons">
            <button class="ticket__update" type="button"></button>
            <button class="ticket__delete" type="button"></button>
          </div>
        </div>
      </li>
    `;
  }

  insertTicket(ticket) {
    const copyTicket = { ...ticket };
    const date = new Date(copyTicket.created);
    const dayMonthYear = date.toLocaleString('ru', {
      day: '2-digit', month: '2-digit', year: '2-digit'
    });
    const hourMinute = date.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });

    copyTicket.created = dayMonthYear + ' ' + hourMinute;
    this.containerEl.insertAdjacentHTML('beforeEnd', TicketView.markup(copyTicket));
  }

  insertDescription(ticket) {
    if (ticket.description) {
      const element = document.getElementById(ticket.id);
      element.insertAdjacentHTML('beforeEnd', `<p class="ticket-description">${ticket.description}</p>`);
    }
  }
}