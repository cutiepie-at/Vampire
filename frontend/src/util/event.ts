import type EventBus from 'js-event-bus';
import type {EventCallback} from 'js-event-bus';

export type EventHandlerMap = {
  [eventName: string]: EventCallback | {
    handler: EventCallback,
    options?: EventListenerOptions | boolean
  }
};

export function registerEventBusEvents(eventBus: EventBus, events: EventHandlerMap): void {
  Object.keys(events).forEach(e => {
    if (typeof events[e] === 'function') {
      eventBus.on(e, (events[e] as EventCallback));
    } else {
      eventBus.on(e, (events[e] as any).fn);
    }
  });
}

export function unregisterEventBusEvents(eventBus: EventBus, events: EventHandlerMap): void {
  Object.keys(events).forEach(e => {
    if (typeof events[e] === 'function') {
      eventBus.detach(e, (events[e] as EventCallback));
    } else {
      eventBus.detach(e, (events[e] as any).fn);
    }
  });
}

export function registerElementEvents(target: EventTarget, events: EventHandlerMap): void {
  Object.keys(events).forEach(e => {
    if (typeof events[e] === 'function') {
      target.addEventListener(e, (events[e] as EventCallback));
    } else {
      target.addEventListener(e, (events[e] as any).handler, (events[e] as any).options);
    }
  });
}

export function unregisterElementEvents(target: EventTarget, events: EventHandlerMap): void {
  Object.keys(events).forEach(e => {
    if (typeof events[e] === 'function') {
      target.removeEventListener(e, (events[e] as EventCallback));
    } else {
      target.removeEventListener(e, (events[e] as any).handler, (events[e] as any).options);
    }
  });
}