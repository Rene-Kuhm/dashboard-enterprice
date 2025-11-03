'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function EmailSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Settings</CardTitle>
        <CardDescription>Configure SMTP and email notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>SMTP Host</Label>
          <Input placeholder="smtp.example.com" />
        </div>
        <div className="space-y-2">
          <Label>SMTP Port</Label>
          <Input type="number" placeholder="587" />
        </div>
        <div className="space-y-2">
          <Label>SMTP User</Label>
          <Input placeholder="user@example.com" />
        </div>
        <div className="space-y-2">
          <Label>SMTP Password</Label>
          <Input type="password" />
        </div>
        <div className="flex gap-2">
          <Button>Save Settings</Button>
          <Button variant="outline">Test Connection</Button>
        </div>
      </CardContent>
    </Card>
  );
}
