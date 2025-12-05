// Shared print styles for all label pages
export const getPrintStyles = () => `
  @media print {
    @page {
      size: 8.5in 11in;
      margin: 0.5in 0.25in 0.25in 0.25in;
    }

    body * {
      visibility: hidden;
    }

    .print-only,
    .print-only * {
      visibility: visible;
    }

    .print-only {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }

    .no-print {
      display: none !important;
    }
  }

  @media screen {
    .print-only {
      display: none;
    }
  }
`;

// Print styles for shelf labels (landscape orientation)
export const getShelfLabelPrintStyles = () => `
  @media print {
    @page {
      size: 11in 8.5in;
      margin: 0.5in 0.25in;
    }

    body * {
      visibility: hidden;
    }

    .print-only,
    .print-only * {
      visibility: visible;
    }

    .print-only {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }

    .no-print {
      display: none !important;
    }
  }

  @media screen {
    .print-only {
      display: none;
    }
  }
`;

// Print styles for full page notices (no margins)
export const getFullPagePrintStyles = () => `
  @media print {
    @page {
      size: 8.5in 11in;
      margin: 0;
    }

    body * {
      visibility: hidden;
    }

    .print-only,
    .print-only * {
      visibility: visible;
    }

    .print-only {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      transform: scale(1) !important;
    }

    .no-print {
      display: none !important;
    }
  }

  @media screen {
    .print-only {
      display: none;
    }
  }
`;
