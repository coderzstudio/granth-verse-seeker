import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Eye, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up PDF.js worker with multiple fallback options
pdfjs.GlobalWorkerOptions.workerSrc = getPdfWorkerSrc();

function getPdfWorkerSrc() {
  // Try multiple CDNs in case one fails
  const cdnUrls = [
    `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`,
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`,
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
  ];
  
  return cdnUrls[0]; // You can implement more sophisticated fallback logic if needed
}

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
  const [processedUrl, setProcessedUrl] = useState<string>('');
  const [loadTimeout, setLoadTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Reset state when PDF URL changes
    setLoading(true);
    setError('');
    setPageNumber(1);
    setNumPages(0);
    setUseIframe(false);

    // Process the URL for better compatibility
    processPdfUrl(pdfUrl);

    // Set a max loading timeout (e.g., 15 seconds)
    if (loadTimeout) clearTimeout(loadTimeout);
    const timeout = setTimeout(() => {
      if (loading && !useIframe) {
        console.error('PDF load timeout reached, falling back to iframe or showing error.');
        if (pdfUrl.includes('drive.google.com') || pdfUrl.includes('docs.google.com')) {
          setUseIframe(true);
          setError('');
        } else {
          setError('Unable to load PDF (timeout). Please try the external link below.');
        }
        setLoading(false);
      }
    }, 15000);
    setLoadTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
    // eslint-disable-next-line
  }, [pdfUrl]);

  const processPdfUrl = (url: string) => {
    try {
      // Handle Google Drive URLs
      if (url.includes('drive.google.com')) {
        const fileId = extractGoogleDriveFileId(url);
        if (fileId) {
          // Use direct download URL for react-pdf
          const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
          setProcessedUrl(directUrl);
          console.log('Converted Google Drive URL to direct download:', directUrl);
          return;
        }
      }

      // Handle other URLs (including Supabase)
      if (url.startsWith('http')) {
        setProcessedUrl(url);
        return;
      }

      // If we can't process it, fallback to iframe
      console.log('Falling back to iframe for URL:', url);
      setUseIframe(true);
      setProcessedUrl(url);
    } catch (err) {
      console.error('Error processing PDF URL:', err);
      setUseIframe(true);
      setProcessedUrl(url);
    }
  };

  const extractGoogleDriveFileId = (url: string): string | null => {
    // Multiple patterns to extract file ID from different Google Drive URL formats
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9-_]+)/,
      /id=([a-zA-Z0-9-_]+)/,
      /\/open\?id=([a-zA-Z0-9-_]+)/,
      /\/uc\?id=([a-zA-Z0-9-_]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('PDF loaded successfully, pages:', numPages);
    setNumPages(numPages);
    setLoading(false);
    setError('');
    if (loadTimeout) {
      clearTimeout(loadTimeout);
      setLoadTimeout(null);
    }
  };

  const onDocumentLoadError = (error: any) => {
    console.error('PDF load error:', error);
    setLoading(false);
    if (loadTimeout) {
      clearTimeout(loadTimeout);
      setLoadTimeout(null);
    }
    
    // Try iframe fallback for Google Drive or any failed URLs
    if (pdfUrl.includes('drive.google.com') || pdfUrl.includes('docs.google.com')) {
      console.log('Switching to iframe fallback for Google Drive');
      setUseIframe(true);
      setError('');
    } else {
      setError('Unable to load PDF. Please try the external link below.');
    }
  };

  const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages));
  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

  const openInNewTab = () => {
    let urlToOpen = pdfUrl;
    
    // Convert Google Drive URLs to viewer format
    const fileId = extractGoogleDriveFileId(pdfUrl);
    if (fileId) {
      urlToOpen = `https://drive.google.com/file/d/${fileId}/preview`;
    }
    
    window.open(urlToOpen, '_blank');
  };

  // Loading state
  if (loading && !useIframe) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg p-6 gap-4">
        <Loader2 className="h-12 w-12 text-orange-600 animate-spin" />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium text-gray-900">Loading {title}</h3>
          <p className="text-sm text-gray-600">
            {pdfUrl.includes('drive.google.com') 
              ? "Processing......"
              : "Loading PDF document..."}
          </p>
          <Button 
            onClick={openInNewTab} 
            variant="outline" 
            className="mt-4"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in New Tab
          </Button>
        </div>
      </div>
    );
  }

  // Error state with external link option
  if (error && !useIframe) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <div className="text-center space-y-4">
          <Eye className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="text-lg font-medium text-gray-900">Couldn't load PDF</h3>
          <p className="text-gray-600">{error}</p>
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
    const fileId = extractGoogleDriveFileId(pdfUrl);
    
    if (fileId) {
      embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    }

    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="flex gap-2">
            <Button onClick={openInNewTab} variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open External
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <iframe
            src={embedUrl}
            className="w-full h-[80vh] border-0"
            title={title}
            loading="lazy"
            allow="autoplay"
          />
        </div>
        
        <div className="p-2 bg-orange-50 border-t border-orange-200">
          <p className="text-xs text-orange-800 text-center">
            PDF is being displayed via Google Drive viewer. Use the external link if you need full functionality.
          </p>
        </div>
      </div>
    );
  }

  // Main PDF viewer with controls
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* PDF Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-200 bg-gray-50 gap-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium whitespace-nowrap">
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

        <div className="flex items-center gap-2">
          <Button onClick={zoomOut} variant="outline" size="sm" disabled={scale <= 0.5}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium whitespace-nowrap">
            {Math.round(scale * 100)}%
          </span>
          <Button onClick={zoomIn} variant="outline" size="sm" disabled={scale >= 3.0}>
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
              file={processedUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex items-center justify-center h-96 w-full">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                </div>
              }
              options={{
                cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
                cMapPacked: true,
                httpHeaders: {
                  'Accept': 'application/pdf',
                  'Cache-Control': 'no-cache'
                }
              }}
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={false}
                loading={
                  <div className="flex items-center justify-center h-96 w-full">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                  </div>
                }
              />
            </Document>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-2 bg-orange-50 border-t border-orange-200">
        <p className="text-xs text-orange-800 text-center">
          {pdfUrl.includes('drive.google.com') 
            ? "Google Drive PDF - May take a moment to load"
            : "Secure PDF viewer with zoom and navigation controls"}
        </p>
      </div>
    </div>
  );
};

export default PDFViewer;
