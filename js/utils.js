
export function autoResize(textarea) {
  textarea.style.height = 'auto';
  requestAnimationFrame(() => {
    textarea.style.height = (textarea.scrollHeight || 60) + 'px';
  });
}
