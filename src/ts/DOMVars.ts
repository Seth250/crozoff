export const todoContainer = document.getElementById('todo-list-container') as HTMLDivElement;

export const todoForm = document.getElementById('todo-form') as HTMLFormElement;

export const totalPendingElem = document.getElementById('total-pending') as HTMLSpanElement;

export const messageBox = document.querySelector('.message') as HTMLDivElement;

export const csrfToken: string = (document.querySelector('input[name="csrfmiddlewaretoken"]') as HTMLInputElement).value;