import jsPDF from 'jspdf';

const LOGO_SOURCES: Array<() => string | null> = [
  () => {
    if (typeof window === 'undefined') return '/bereit-logo.png';
    return `${window.location.origin}/bereit-logo.png`;
  },
  () => 'https://bereit.works/bereit-logo.png',
];

const loadImage = (src: string, useCrossOrigin: boolean): Promise<HTMLImageElement | null> => {
  return new Promise((resolve) => {
    const img = new Image();

    if (useCrossOrigin) {
      img.crossOrigin = 'anonymous';
    }

    const timeout = setTimeout(() => {
      console.warn(`Logo loading timed out for ${src}`);
      resolve(null);
    }, 5000);

    img.onload = () => {
      clearTimeout(timeout);
      resolve(img);
    };

    img.onerror = (error) => {
      clearTimeout(timeout);
      console.warn(`Failed to load logo from ${src}`, error);
      resolve(null);
    };

    img.src = src;
  });
};

const scaleToFit = (
  image: HTMLImageElement,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  const naturalWidth = image.naturalWidth || image.width || maxWidth;
  const naturalHeight = image.naturalHeight || image.height || maxHeight;

  if (!naturalWidth || !naturalHeight) {
    return { width: maxWidth, height: maxHeight };
  }

  const widthRatio = maxWidth / naturalWidth;
  const heightRatio = maxHeight / naturalHeight;
  const scale = Math.min(widthRatio, heightRatio, 1);

  return {
    width: naturalWidth * scale,
    height: naturalHeight * scale,
  };
};

/**
 * Load the bereit logo image
 * Returns the loaded image or null if loading fails
 */
export const loadBereitLogo = async (): Promise<HTMLImageElement | null> => {
  for (const resolveSrc of LOGO_SOURCES) {
    const src = resolveSrc();
    if (!src) continue;

    const sameOrigin =
      typeof window !== 'undefined' && src.startsWith(`${window.location.origin}/`);
    const image = await loadImage(src, !sameOrigin);

    if (image) {
      if (sameOrigin) {
        console.log('✅ Logo loaded from app assets');
      } else {
        console.log('✅ Logo loaded from remote host');
      }
      return image;
    }
  }

  return null;
};

/**
 * Add bereit logo to PDF header
 * @param pdf - jsPDF instance
 * @param x - X position
 * @param y - Y position
 * @param logo - Optional logo image (if already loaded)
 */
export const addLogoToPDF = async (
  pdf: jsPDF,
  x: number,
  y: number,
  logo?: HTMLImageElement | null
): Promise<void> => {
  const logoImage = logo || await loadBereitLogo();

  if (logoImage) {
    try {
      const { width, height } = scaleToFit(logoImage, 40, 12);
      pdf.addImage(logoImage, 'PNG', x, y, width, height);
    } catch (error) {
      console.warn('Error adding logo to PDF:', error);
      addFallbackLogo(pdf, x, y);
    }
  } else {
    addFallbackLogo(pdf, x, y);
  }
};

/**
 * Add fallback text logo when image fails to load
 */
const addFallbackLogo = (pdf: jsPDF, x: number, y: number): void => {
  pdf.setFillColor(0, 188, 212); // Primary color
  pdf.rect(x, y, 15, 15, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.text('B', x + 5, y + 10);

  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('bereit', x + 18, y + 10);
};

/**
 * Add bereit logo to PDF footer (smaller size)
 * @param pdf - jsPDF instance
 * @param x - X position
 * @param y - Y position
 * @param logo - Optional logo image
 */
export const addFooterLogoToPDF = async (
  pdf: jsPDF,
  x: number,
  y: number,
  logo?: HTMLImageElement | null
): Promise<void> => {
  const logoImage = logo || await loadBereitLogo();

  if (logoImage) {
    try {
      const { width, height } = scaleToFit(logoImage, 20, 6);
      pdf.addImage(logoImage, 'PNG', x, y, width, height);
    } catch (error) {
      console.warn('Error adding footer logo:', error);
      addFallbackFooterLogo(pdf, x, y);
    }
  } else {
    addFallbackFooterLogo(pdf, x, y);
  }
};

/**
 * Add fallback footer logo
 */
const addFallbackFooterLogo = (pdf: jsPDF, x: number, y: number): void => {
  pdf.setFillColor(0, 188, 212);
  pdf.rect(x, y, 8, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(6);
  pdf.text('B', x + 2.5, y + 5.5);
};

/**
 * Format document content by removing markdown and cleaning text
 */
export const formatDocumentContent = (content: string): string[] => {
  return content
    .split('\n\n')
    .map(paragraph =>
      paragraph
        .replace(/\*\*/g, '') // Remove bold
        .replace(/\*/g, '') // Remove italic
        .replace(/#{1,6}\s/g, '') // Remove headers
        .replace(/`/g, '') // Remove code blocks
        .trim()
    )
    .filter(text => text.length > 0);
};

/**
 * Check if text is a header
 */
export const isHeader = (text: string): boolean => {
  return (
    /^[A-Z\s]{3,}$/.test(text) || // All caps
    /^\d+\./.test(text) || // Numbered list
    /^§/.test(text) // German legal section
  );
};
