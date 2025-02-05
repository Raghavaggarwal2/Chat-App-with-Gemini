import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/nord.css';

hljs.registerLanguage('javascript', javascript);

export const highlightCode = (element) => {
  if (element) {
    hljs.highlightElement(element);
  }
};