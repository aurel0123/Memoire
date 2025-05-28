
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Download, Printer, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import { useState } from "react";
import PropTypes from 'prop-types';

export default function PreviewDialog({ tableRef, onExport, onPrint }) {
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePreview = async () => {
    if (!tableRef.current) {
      setError("No table reference available");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const canvas = await html2canvas(tableRef.current, {
        scale: 1,
        useCORS: true,
        logging: false
      });
      setPreviewImage(canvas.toDataURL());
    } catch (err) {
      console.error("Error generating preview:", err);
      setError("Failed to generate preview");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={generatePreview} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Eye className="h-4 w-4 mr-2" />
          )}
          Aperçu
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Aperçu avant impression/export</DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="text-red-500 p-2 bg-red-50 rounded mb-4">
            {error}
          </div>
        )}

        {isLoading && !previewImage ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : previewImage ? (
          <img 
            src={previewImage} 
            alt="Aperçu du tableau" 
            className="w-full h-auto border rounded"
          />
        ) : (
          <div className="text-gray-500 text-center py-8">
            Cliquez sur &#34;Aperçu&#34; pour générer un aperçu
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={onExport} disabled={!previewImage || isLoading}>
            <Download className="h-4 w-4 mr-2" />
            Exporter en Excel
          </Button>
          <Button onClick={onPrint} disabled={!previewImage || isLoading}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

PreviewDialog.propTypes = {
  tableRef: PropTypes.shape({ 
    current: PropTypes.instanceOf(HTMLElement) 
  }).isRequired,
  onExport: PropTypes.func.isRequired,
  onPrint: PropTypes.func.isRequired,
};