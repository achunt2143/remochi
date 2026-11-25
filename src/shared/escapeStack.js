// escapeStack.js
// Layer stack for overlays that close on Escape (Dialog, PopupPanel, Menu).
// Each open overlay registers on open and unregisters on close; a single
// document keydown listener closes only the topmost one, so Escape peels
// layers one at a time (menu/popover first, then the Dialog under it).
import { useEffect, useRef } from 'react';

const layers = [];   // [{ id, close }] bottom -> top
let listening = false;

function onKeyDown(e) {
  if (e.key !== 'Escape') return;
  layers[layers.length - 1]?.close();
}

function sync() {
  if (layers.length && !listening) {
    document.addEventListener('keydown', onKeyDown);
    listening = true;
  } else if (!layers.length && listening) {
    document.removeEventListener('keydown', onKeyDown);
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
