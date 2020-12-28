import { DefaultHeaders } from './interfaces';

const csrfToken: string = (document.querySelector('input[name="csrfmiddlewaretoken"]') as HTMLInputElement).value;

export function getDefaultRequestHeaders(): DefaultHeaders {
    return {
        Accept: 'application/json',
        'Content-type': 'application/json; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': csrfToken
    }
}

// extends Record<string, string>