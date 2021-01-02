import { ElementDragOffset, DefaultDragOffset } from './interfaces';


export type DragOffset = ElementDragOffset | DefaultDragOffset;

export type MessageTag = 'info' | 'success' | 'error';

// type guard
export function isDefaultDragOffset(value: DragOffset): value is DefaultDragOffset {
    return value.hasOwnProperty('defaultOffset');
}