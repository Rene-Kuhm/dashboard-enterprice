'use client';

import { Download, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function FileGrid({ files }: { files: any[] }) {
  if (files.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No files found</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map((file) => (
        <div key={file.id} className="border rounded-lg p-4 hover:shadow-md transition group">
          <div className="aspect-square bg-muted rounded-lg mb-2 flex items-center justify-center">
            {file.type.startsWith('image/') ? (
              <img src={file.url} alt={file.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <div className="text-4xl">📄</div>
            )}
          </div>
          <p className="font-medium text-sm truncate">{file.name}</p>
          <div className="flex items-center justify-between mt-2">
            <Badge variant="secondary" className="text-xs">{file.size}</Badge>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Eye className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Download className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
