import { MessageTag } from './types';


// generic interface for DOM events and the corresponding target and currentTarget elements
export interface HTMLEvent<T extends HTMLElement = HTMLElement> extends Event {
    target: T;
    currentTarget: T;
}

interface Obj {
    [k: string]: string;
}

export interface DefaultHeaders extends Obj {
    Accept: 'application/json';
    'Content-type': 'application/json; charset=UTF-8';
    'X-Requested-With': 'XMLHttpRequest';
    'X-CSRFToken': string;
}

export interface ElementDragOffset {
    offset: number;
    element: HTMLDivElement;
}

export interface DefaultDragOffset {
    defaultOffset: number;
}

export interface TodoOrder {
    pk: number;
    order: number;
}

export interface ResponseMessage {
    message: string;
    message_tag: MessageTag;
}

export interface TodoStatus extends ResponseMessage {
    status: string;
    class_tag: 'complete' | 'pending' | 'overdue';
}

export interface TodoCreateUpdate extends TodoStatus {
    id: number;
    item: string;
    order: number;
    action: 'create' | 'update';
}

export interface TodoFormData {
    item: string;
    due_date: string;
}
