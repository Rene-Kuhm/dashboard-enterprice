'use client';

import { Download, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils/date';

export function FileTable({ files }: { files: any[] }) {
  if (files.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No files found</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Type</th>
            <th className="text-left p-3">Size</th>
            <th className="text-left p-3">Uploaded</th>
            <th className="text-right p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id} className="border-b hover:bg-accent">
              <td className="p-3">{file.name}</td>
              <td className="p-3">{file.type}</td>
              <td className="p-3">{file.size}</td>
              <td className="p-3">{formatDate(file.createdAt)}</td>
              <td className="p-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
