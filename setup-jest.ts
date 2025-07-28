import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

// Mock problematic libraries
jest.mock('jspdf', () => ({
  jsPDF: jest.fn().mockImplementation(() => ({
    save: jest.fn(),
    addPage: jest.fn(),
    text: jest.fn(),
    setFontSize: jest.fn(),
    setFont: jest.fn(),
  })),
}));

jest.mock('svg2pdf.js', () => ({
  svg2pdf: jest.fn(),
}));

jest.mock('html2canvas', () => ({
  default: jest.fn().mockResolvedValue({
    toDataURL: jest.fn(),
    width: 100,
    height: 100,
  }),
}));

jest.mock('quill', () => ({
  default: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    off: jest.fn(),
    getContents: jest.fn(),
    setContents: jest.fn(),
    getText: jest.fn(),
    setText: jest.fn(),
    getHTML: jest.fn(),
    setHTML: jest.fn(),
    getSelection: jest.fn(),
    setSelection: jest.fn(),
    focus: jest.fn(),
    blur: jest.fn(),
    enable: jest.fn(),
    disable: jest.fn(),
    addContainer: jest.fn(),
    getContainer: jest.fn(),
    getModule: jest.fn(),
    hasFocus: jest.fn(),
    deleteText: jest.fn(),
    formatText: jest.fn(),
    formatLine: jest.fn(),
    insertText: jest.fn(),
    insertEmbed: jest.fn(),
    updateContents: jest.fn(),
    getBounds: jest.fn(),
    getLeaf: jest.fn(),
    getLine: jest.fn(),
    getLines: jest.fn(),
    getIndex: jest.fn(),
    getLength: jest.fn(),
    removeFormat: jest.fn(),
    clipboard: {
      addMatcher: jest.fn(),
      dangerouslyPasteHTML: jest.fn(),
    },
    keyboard: {
      addBinding: jest.fn(),
    },
    history: {
      clear: jest.fn(),
      cutoff: jest.fn(),
    },
  })),
}));

// Mock ng-zorro-antd components and services
jest.mock('ng-zorro-antd/notification', () => ({
  NzNotificationService: jest.fn().mockImplementation(() => ({
    create: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  })),
}));

// Mock global objects
Object.defineProperty(window, 'CSS', { value: null });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return {
      display: 'none',
      appearance: ['-webkit-appearance'],
    };
  },
});

Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>',
});

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: (prop: any) => {
      return '';
    },
  }),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
