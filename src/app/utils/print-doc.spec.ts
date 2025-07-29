import { printResume } from './print-doc';

describe('printResume', () => {
  let mockWindow: any;
  let mockPrintWindow: any;

  beforeEach(() => {
    // Mock window.open
    mockPrintWindow = {
      document: {
        write: jest.fn(),
        close: jest.fn(),
      },
      print: jest.fn(),
    };

    mockWindow = {
      open: jest.fn().mockReturnValue(mockPrintWindow),
    };

    // Mock XMLSerializer
    global.XMLSerializer = jest.fn().mockImplementation(() => ({
      serializeToString: jest.fn().mockReturnValue('<svg>test</svg>'),
    }));

    // Replace global window
    Object.defineProperty(global, 'window', {
      value: mockWindow,
      writable: true,
    });
  });

  it('should handle null svgElement', () => {
    printResume(null);
    expect(mockWindow.open).not.toHaveBeenCalled();
  });

  it('should handle undefined svgElement', () => {
    printResume(undefined);
    expect(mockWindow.open).not.toHaveBeenCalled();
  });

  it('should open print window with svg data', () => {
    const mockSvgElement = { tagName: 'svg' };

    printResume(mockSvgElement);

    expect(mockWindow.open).toHaveBeenCalledWith('', '_blank');
    expect(mockPrintWindow.document.write).toHaveBeenCalled();
    expect(mockPrintWindow.document.close).toHaveBeenCalled();
    expect(mockPrintWindow.print).toHaveBeenCalled();
  });
});
