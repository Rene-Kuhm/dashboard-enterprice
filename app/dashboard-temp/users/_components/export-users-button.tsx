'use client';

import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { User } from '@/types/user';
import { exportToCSV, exportToExcel, exportToPDF } from '@/lib/utils/export';
import { formatDate } from '@/lib/utils/date';

interface ExportUsersButtonProps {
  users: User[];
  disabled?: boolean;
}

export function ExportUsersButton({ users, disabled }: ExportUsersButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const prepareExportData = () => {
    return users.map((user) => ({
      ID: user.id,
      'First Name': user.firstName,
      'Last Name': user.lastName,
      Email: user.email,
      Role: user.role,
      Status: user.isActive ? 'Active' : 'Inactive',
      'Created At': formatDate(user.createdAt),
      'Last Login': user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never',
    }));
  };

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const data = prepareExportData();
      await exportToCSV(data, 'users');
      toast.success('Users exported to CSV successfully');
    } catch (error) {
      toast.error('Failed to export users to CSV');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      const data = prepareExportData();
      await exportToExcel(data, 'users');
      toast.success('Users exported to Excel successfully');
    } catch (error) {
      toast.error('Failed to export users to Excel');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const data = prepareExportData();
      const columns = [
        'ID',
        'First Name',
        'Last Name',
        'Email',
        'Role',
        'Status',
        'Created At',
      ];
      await exportToPDF(data, columns, 'Users Report', 'users');
      toast.success('Users exported to PDF successfully');
    } catch (error) {
      toast.error('Failed to export users to PDF');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled || isExporting}>
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportCSV} disabled={isExporting}>
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportExcel} disabled={isExporting}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF} disabled={isExporting}>
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
