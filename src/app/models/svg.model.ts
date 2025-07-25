export interface SvgConfig {
  page: {
    width: number;
    height: number;
    margins: { top: number; right: number; bottom: number; left: number };
    enablePageSplitting?: boolean;
    maxContentHeight?: number; // Calculated automatically based on height and margins
  };
  fonts: {
    family: string;
    sizes: {
      small: number;
      default: number;
      large: number;
    };
    lineHeights: {
      small: number;
      default: number;
      large: number;
    };
  };
  colors: {
    primary: string;
    text: string;
    divider: string;
  };
  spacing: {
    sectionGap: number;
    elementGap: number;
    lineGap: number;
  };
}

export interface PageContent {
  content: string;
  pageNumber: number;
}
