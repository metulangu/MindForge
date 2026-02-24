// Workaround for "Cannot set property fetch of #<Window> which has only a getter"
try {
  const originalFetch = window.fetch;
  
  // 1. Try to delete it (in case it's an own property)
  try {
    // @ts-ignore
    delete window.fetch;
  } catch (e) {
    // ignore
  }

  // 2. Define it as a writable property
  Object.defineProperty(window, 'fetch', {
    value: originalFetch,
    writable: true,
    configurable: true
  });
  
} catch (e) {
  console.warn('Failed to patch window.fetch', e);
}
