'use client';

export default function SkipLink() {
  function moveFocus() {
    window.requestAnimationFrame(() => {
      document.getElementById('main-content')?.focus({ preventScroll: true });
    });
  }

  return <a href="#main-content" onClick={moveFocus} className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-md focus:bg-white focus:p-3 focus:text-gray-900 focus:shadow-lg">Skip to content</a>;
}
