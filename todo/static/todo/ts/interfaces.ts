// generic interface for DOM events and their currentTarget element
export interface HTMLEvent<T extends HTMLElement = HTMLElement> extends Event {
    currentTarget: T;
}

export interface DefaultHeaders {
    'Accept': 'application/json';
    'Content-type': 'application/json; charset=UTF-8';
    'X-Requested-With': 'XMLHttpRequest';
    'X-CSRFToken': string;
}