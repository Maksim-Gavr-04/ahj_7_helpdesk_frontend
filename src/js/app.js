import HelpDesk from '../components/helpdesk/HelpDesk';
import TicketService from '../components/ticket/TicketService';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  const ticketService = new TicketService('https://ahj-7-helpdesk-backend-04.netlify.app/.netlify/functions/server');
  const app = new HelpDesk(root, ticketService);
  app.init();
});