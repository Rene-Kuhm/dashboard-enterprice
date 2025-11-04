'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function TwoFactorSetup() {
  const [enabled, setEnabled] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>Add an extra layer of security to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="2fa">Enable 2FA</Label>
          <Switch id="2fa" checked={enabled} onCheckedChange={setEnabled} />
        </div>
        {enabled && (
          <div className="space-y-4 border-t pt-4">
            <div className="bg-muted p-4 rounded text-center">
              <p className="text-sm mb-2">Scan this QR code with your authenticator app</p>
              <div className="h-48 flex items-center justify-center">QR Code Here</div>
            </div>
            <div className="space-y-2">
              <Label>Verification Code</Label>
              <Input placeholder="Enter 6-digit code" />
            </div>
            <Button>Verify & Enable 2FA</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
