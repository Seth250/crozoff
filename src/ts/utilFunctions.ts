import { ResponseMessage, DefaultHeaders } from './interfaces';
import { messageBox, todoContainer, csrfToken } from './DOMVars';
import { MessageTag } from './types';


export function displayMessage(message: string, tag: MessageTag): void {
    messageBox.classList.remove('hide');
    messageBox.classList.add(`message-${tag}`, 'fade');
    messageBox.textContent = message;
    // we're waiting 3.55s in the setTimeout because the css fade animation takes 3.5s(with the initial delay)
    setTimeout(() => {
        messageBox.classList.add('hide');
        messageBox.classList.remove(`message-${tag}`, 'fade');
    }, 3550);
}

export async function errorHandler(error: Response) {
    if (error.status) {
        const { message, message_tag } = await (error.json() as Promise<ResponseMessage>);
        displayMessage(message, message_tag);
    } else {
        console.error(error);
        displayMessage('An Unexpected Error Occurred', 'error');
    }
}

export function smoothScrollIntoView<T extends HTMLElement>(elem: T, yOffset=-200): void {
	const yPosition = elem.getBoundingClientRect().top;
	todoContainer.scrollTo({
		top: yPosition + todoContainer.scrollTop + yOffset,
		behavior: 'smooth'
	});
	window.scrollTo({
		top: yPosition + window.pageYOffset + (yOffset / 2),
		behavior: 'smooth'
	});
}

export function getDefaultRequestHeaders(): DefaultHeaders {
    return {
        Accept: 'application/json',
        'Content-type': 'application/json; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': csrfToken
    }
}