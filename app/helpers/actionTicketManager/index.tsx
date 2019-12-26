import axios from 'axios';
import * as uuid from 'uuid/v4';
import * as store from 'store';
import * as expirePlugin from 'store/plugins/expire';
import EnvChecker from '../envChecker';
import ActionTicket, { ActionTicketParams, FinalActionTicket } from './actionTicket';
import {
  DEAD_LETTER_QUEUE_KEY,
  DESTINATION_URL,
  DEVICE_ID_INITIALIZED_KEY,
  DEVICE_ID_KEY,
  LIVE_SESSION_LENGTH,
  MAXIMUM_RETRY_COUNT,
  MAXIMUM_TICKET_COUNT_IN_QUEUE,
  SESSION_COUNT_KEY,
  SESSION_ID_INITIALIZED_KEY,
  SESSION_ID_KEY,
  TIME_INTERVAL_TO_SEND_TICKETS,
} from '../../constants/actionTicket';
import { trackEvent } from '../handleGA';

class ActionTicketManager {
  public queue: ActionTicket[] = [];
  private sentLastTickets = false;

  public constructor() {
    if (!EnvChecker.isOnServer()) {
      window.addEventListener('beforeunload', () => {
        this.sendTicketsBeforeSessionClosed();
      });
      window.addEventListener('unload', () => {
        this.sendTicketsBeforeSessionClosed();
      });

      this.checkAndSetDeviceKey();
      this.tryToSendDeadTickets();
    }
  }

  public trackTicket(params: ActionTicketParams) {
    if (EnvChecker.isOnServer()) return;

    this.setSessionKey();
    const ticket = new ActionTicket(params);
    this.addToQueue([ticket]);

    if (params.actionType === 'fire') {
      trackEvent({
        category: params.actionArea || '',
        action: params.actionTag,
        label: params.actionLabel || '',
      });
    }

    if (this.queue.length > MAXIMUM_TICKET_COUNT_IN_QUEUE) {
      this.sendTickets();
    }
  }

  public async sendTickets() {
    if (this.queue.length > 0) {
      const targetTickets = this.queue;
      this.flushQueue();
      try {
        if (EnvChecker.isProdBrowser()) {
          await this.postTickets(targetTickets);
        } else {
          console.log(targetTickets);
        }
      } catch (err) {
        targetTickets.forEach(ticket => ticket.increaseErrorCount());

        const deadTickets = targetTickets.filter(
          ticket => ticket.errorCount && ticket.errorCount > MAXIMUM_RETRY_COUNT
        );
        this.addToDeadLetterQueue(deadTickets);

        const retryTickets = targetTickets.filter(
          ticket => !ticket.errorCount || (ticket.errorCount && ticket.errorCount <= MAXIMUM_RETRY_COUNT)
        );
        this.addToQueue(retryTickets);
      }
    }
  }

  public flushQueue() {
    this.queue = [];
  }

  private addToDeadLetterQueue(tickets: ActionTicket[]) {
    const deadQueue = store.get(DEAD_LETTER_QUEUE_KEY) || [];
    store.set(DEAD_LETTER_QUEUE_KEY, [...deadQueue, ...tickets.map(ticket => ticket.getTicketWithoutMeta())]);
  }

  private addToQueue(tickets: ActionTicket[]) {
    this.queue = [...this.queue, ...tickets];
  }

  private checkAndSetDeviceKey() {
    const deviceKey = store.get(DEVICE_ID_KEY);
    if (!deviceKey) {
      store.set(DEVICE_ID_KEY, uuid());
      store.set(DEVICE_ID_INITIALIZED_KEY, true);
    }
  }

  private setSessionKey() {
    (store as any).removeExpiredKeys();
    const sessionKey: string | undefined = store.get(SESSION_ID_KEY);
    let sessionCount: number = store.get(SESSION_COUNT_KEY) || 0;
    const currentDate = new Date();
    const currentTime = currentDate.getTime();

    if (!sessionKey) {
      (store as any).set(SESSION_ID_KEY, uuid(), currentTime + LIVE_SESSION_LENGTH);
      (store as any).set(SESSION_ID_INITIALIZED_KEY, true);
      (store as any).set(SESSION_COUNT_KEY, ++sessionCount);
    } else {
      (store as any).set(SESSION_ID_KEY, sessionKey, currentTime + LIVE_SESSION_LENGTH);
    }
  }

  private async postTickets(tickets: ActionTicket[]) {
    await axios.post(
      DESTINATION_URL,
      encodeURIComponent(JSON.stringify(tickets.map(ticket => ticket.getTicketWithoutMeta()))),
      {
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8',
        },
      }
    );
  }

  private async tryToSendDeadTickets() {
    const rawDeadTickets: FinalActionTicket[] | undefined = store.get(DEAD_LETTER_QUEUE_KEY);

    const deadTickets = rawDeadTickets && rawDeadTickets.map(ticket => new ActionTicket(ticket));
    if (deadTickets && deadTickets.length > 0) {
      try {
        await this.postTickets(deadTickets);
        store.set(DEAD_LETTER_QUEUE_KEY, []);
      } catch (err) {
        console.error('FAILED TO SEND DEAD TICKETS', err);
      }
    }
  }

  private sendTicketsBeforeSessionClosed() {
    if (this.sentLastTickets || this.queue.length === 0) {
      return;
    }

    const encodedTickets = encodeURIComponent(JSON.stringify(this.queue.map(ticket => ticket.getTicketWithoutMeta())));

    if (typeof navigator !== undefined && navigator.sendBeacon) {
      const success = navigator.sendBeacon(DESTINATION_URL, encodedTickets);
      this.sentLastTickets = success;
    } else {
      // This is needed for IE
      const xhr = new XMLHttpRequest();
      xhr.open('POST', DESTINATION_URL, false);
      xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
      xhr.send(encodedTickets);
      if (xhr.status === 200) {
        this.sentLastTickets = true;
      }
    }
  }
}

store.addPlugin(expirePlugin);
const actionTicketManager = new ActionTicketManager();

if (!EnvChecker.isOnServer()) {
  setInterval(() => {
    actionTicketManager.sendTickets();
  }, TIME_INTERVAL_TO_SEND_TICKETS);
}

export default actionTicketManager;
