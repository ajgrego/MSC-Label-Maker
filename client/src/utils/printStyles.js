/**
 * Shared print styles for all label types.
 *
 * Each exported function returns a CSS string that:
 *  - Hides the Navbar (.MuiAppBar-root) and all .no-print elements
 *  - Strips MUI Container padding so labels align from the page edge
 *  - Reveals .print-only content and lets it flow naturally (no absolute
 *    positioning), which fixes the first-vs-subsequent-page alignment bug
 *  - Configures @page size and margins for the specific label type
 */

/** CSS reset shared by every print stylesheet */
const basePrintReset = `
  /* Hide all UI chrome — navbar, forms, sidebar */
  .no-print,
  .MuiAppBar-root {
    display: none !important;
  }

  /* Remove MUI Container constraints so labels fill the printable area */
  .MuiContainer-root {
    max-width: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* Show print content in normal document flow (not absolute-positioned)
     so every page renders with identical top alignment */
  .print-only {
    display: block !important;
    width: 100%;
    margin: 0;
    padding: 0;
  }
`;

/**
 * Bin & shoe labels — portrait, 4 per page in a 2×2 grid.
 * Labels are 4in × 4.5in. Page margin of 0.25in (printable area 8in × 10.5in)
 * keeps borders inside the printer's printable zone (no clipped outer border).
 * 2×2 grid = 8in × 9in, fitting within the printable area.
 */
export const getPrintStyles = () => `
  @media print {
    @page {
      size: 8.5in 11in;
      margin: 0.25in;
    }
    ${basePrintReset}
    /* 2×2 flex grid — each .label-page holds exactly 4 labels */
    .print-only {
      display: flex !important;
      flex-wrap: wrap;
      width: 8in;
    }
    .label-page {
      display: flex !important;
      flex-wrap: wrap;
      align-content: flex-start;
      width: 8in;
      height: 10.5in;
      page-break-after: always;
      page-break-inside: avoid;
    }
    .label-page:last-child {
      page-break-after: auto;
    }
  }

  @media screen {
    .print-only {
      display: none;
    }
  }
`;

/**
 * Shelf labels — landscape orientation, multiple strips per page.
 */
export const getShelfLabelPrintStyles = () => `
  @media print {
    @page {
      size: 11in 8.5in;
      margin: 0.25in;
    }
    ${basePrintReset}
  }

  @media screen {
    .print-only {
      display: none;
    }
  }
`;

/**
 * Mixed queue — shelf labels on landscape pages, bin/shoe on portrait pages.
 * Uses CSS named pages so both orientations coexist in one print job.
 */
export const getMixedPrintStyles = () => `
  @media print {
    @page portrait-page {
      size: 8.5in 11in;
      margin: 0.25in;
    }
    @page landscape-page {
      size: 11in 8.5in;
      margin: 0.25in;
    }
    ${basePrintReset}
    .shelf-section {
      page: landscape-page;
    }
    .label-page {
      page: portrait-page;
      display: flex !important;
      flex-wrap: wrap;
      align-content: space-between;
      width: 8in;
      height: 10.5in;
      page-break-after: always;
      page-break-inside: avoid;
    }
    .label-page:last-child {
      page-break-after: auto;
    }
  }

  @media screen {
    .print-only {
      display: none;
    }
  }
`;

/**
 * Full-page notices — portrait, zero margin so the thick border
 * runs to the very edge of the paper.
 */
export const getFullPagePrintStyles = () => `
  @media print {
    @page {
      size: 8.5in 11in;
      margin: 0;
    }
    ${basePrintReset}
  }

  @media screen {
    .print-only {
      display: none;
    }
  }
`;
