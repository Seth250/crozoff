// generic interface for DOM events and their currentTarget element
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

export interface ElementDragOffset<T extends HTMLElement = HTMLElement> {
    offset: number;
    element: T
}

export interface DefaultDragOffset {
    defaultOffset: number;
}

export interface TodoOrder {
    pk: number;
    order: number;
}
