import createRequest from '../../js/api/createRequest';

export default class TicketService {
  constructor(url) {
    this.url = url;
  }

  list(callback) {
    const url = `${this.url}?method=allTickets`;
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    createRequest(url, options).then(tickets => callback(tickets));
  }

  get(id, callback) {
    const url = `${this.url}?method=ticketById&id=${id}`;
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    createRequest(url, options).then(ticket => callback(ticket));
  }

  create(data, callback) {
    const url = `${this.url}?method=createTicket`;
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };

    createRequest(url, options).then(ticket => callback(ticket));
  }

  update(id, data, callback = null) {
    const url = `${this.url}?method=updateById&id=${id}`;
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };

    if (callback) {
      createRequest(url, options).then(ticket => callback(ticket));
    } else {
      createRequest(url, options);
    }
  }

  delete(id, callback) {
    const url = `${this.url}?method=deleteById&id=${id}`;
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    createRequest(url, options).then(() => callback());
  }
}