
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Eye, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up PDF.js worker with a more reliable configuration
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfUrl: string;
  title: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, title }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [useIframe, setUseIframe] = useState<boolean>(false);

  useEffect(() => {
    // Reset state when PDF URL changes
    setLoading(true);
    setError('');
    setPageNumber(1);
    setNumPages(0);
    setUseIframe(false);
  }, [pdfUrl]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('PDF loaded successfully, pages:', numPages);
    setNumPages(numPages);
    setLoading(false);
    setError('');
  };

  const onDocumentLoadError = (error: any) => {
    console.error('PDF load error:', error);
    setLoading(false);
    
    // Try iframe fallback for certain URLs
    if (pdfUrl.includes('drive.google.com') || pdfUrl.includes('docs.google.com')) {
      setUseIframe(true);
      setError('');
    } else {
      setError('Unable to load PDF. Please try the external link below.');
    }
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const openInNewTab = () => {
    let urlToOpen = pdfUrl;
    
    // Convert Google Drive URLs to viewer format
    if (pdfUrl.includes('drive.google.com/file/d/')) {
      const fileId = pdfUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (fileId) {
        urlToOpen = `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
    
    window.open(urlToOpen, '_blank');
  };

  // Loading state
  if (loading && !useIframe) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PDF...</p>
        </div>
      </div>
    );
  }

  // Error state with external link option
  if (error && !useIframe) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <div className="text-center">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={openInNewTab} className="bg-orange-600 hover:bg-orange-700">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open PDF in New Tab
          </Button>
        </div>
      </div>
    );
  }

  // Iframe fallback for Google Drive or when react-pdf fails
  if (useIframe) {
    let embedUrl = pdfUrl;
    
    // Convert Google Drive share URLs to embed URLs
    if (pdfUrl.includes('drive.google.com/file/d/')) {
      const fileId = pdfUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (fileId) {
        embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }

    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <Button onClick={openInNewTab} variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open External
          </Button>
        </div>
        
        <div className="relative">
          <iframe
            src={embedUrl}
            className="w-full h-[80vh] border-0"
            title={title}
            loading="lazy"
          />
        </div>
        
        <div className="p-2 bg-orange-50 border-t border-orange-200">
          <p className="text-xs text-orange-800 text-center">
            PDF content is displayed securely. Use the external link to open in a new tab if needed.
          </p>
        </div>
      </div>
    );
  }

  // React-PDF viewer (primary method)
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* PDF Controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <Button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Page {pageNumber} of {numPages}
          </span>
          <Button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            variant="outline"
            size="sm"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button onClick={zoomOut} variant="outline" size="sm">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{Math.round(scale * 100)}%</span>
          <Button onClick={zoomIn} variant="outline" size="sm">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button onClick={openInNewTab} variant="outline" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Document */}
      <div className="p-4 bg-gray-100 overflow-auto max-h-[80vh]">
        <div className="flex justify-center">
          <div className="bg-white shadow-lg">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                </div>
              }
              options={{
                cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
                cMapPacked: true,
                standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/',
                httpHeaders: {
                  'Access-Control-Allow-Origin': '*',
                }
              }}
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={false}
              />
            </Document>
          </div>
        </div>
      </div>

      {/* Info Message */}
      <div className="p-2 bg-orange-50 border-t border-orange-200">
        <p className="text-xs text-orange-800 text-center">
          Secure PDF viewer with fallback options for better compatibility.
        </p>
      </div>
    </div>
  );
};

export default PDFViewer;
