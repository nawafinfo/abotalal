import React from 'react';
import { FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ExportButtonProps {
  onExportExcel: () => void;
  onExportPDF: () => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onExportExcel, onExportPDF }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileSpreadsheet className="w-4 h-4" />
          تصدير
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onExportExcel} className="gap-2">
          <FileSpreadsheet className="w-4 h-4 text-primary" />
          تصدير Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onExportPDF} className="gap-2">
          <FileText className="w-4 h-4 text-destructive" />
          تصدير PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
