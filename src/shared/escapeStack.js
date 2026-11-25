// escapeStack.js
// Layer stack for overlays that close on Escape (Dialog, PopupPanel, Menu).
// Each open overlay registers on open and unregisters on close; a single
// window keydown listener closes only the topmost one, so Escape peels
// layers one at a time (menu/popover first, then the Dialog under it).
//
// The listener runs in the CAPTURE phase, ahead of React's own handlers, and
// calls preventDefault() on the press it consumed. React flushes a discrete
// event's state update (and the effect cleanups that unregister a layer)
// before a bubbling document listener runs, so a bubble listener would see
// the layer that a component's own onKeyDown just closed already gone and
// close the one below it too. A component handler that also reacts to Escape
// must ignore an event with defaultPrevented set.
import { useEffect, useRef } from 'react';

const layers = [];   // [{ id, close }] bottom -> top
let listening = false;

function onKeyDown(e) {
  if (e.key !== 'Escape' || e.defaultPrevented || e.isComposing) return;
  const top = layers[layers.length - 1];
  if (!top) return;
  e.preventDefault();
  top.close();
}

function sync() {
  if (layers.length && !listening) {
    window.addEventListener('keydown', onKeyDown, true);
    listening = true;
  } else if (!layers.length && listening) {
    window.removeEventListener('keydown', onKeyDown, true);
    listening = false;
  }
}

export function pushEscapeLayer(layer) {
  layers.push(layer);
  sync();
  return () => {
    const i = layers.indexOf(layer);
    if (i !== -1) layers.splice(i, 1);
    sync();
  };
}

// True when another layer was opened above this one.
export function hasLayerAbove(layer) {
  const i = layers.indexOf(layer);
  return i !== -1 && i < layers.length - 1;
}

// Registers an overlay while `isOpen`. `onClose` is read through a ref so a
// new callback identity never moves the layer in the stack. Returns a ref to
// the layer; pass it to hasLayerAbove().
export function useEscapeLayer(isOpen, onClose) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const layerRef = useRef(null);
  useEffect(() => {
    if (!isOpen) return undefined;
    const layer = { close: () => closeRef.current?.() };
    layerRef.current = layer;
    const remove = pushEscapeLayer(layer);
    return () => { remove(); layerRef.current = null; };
  }, [isOpen]);
  return layerRef;
}
