'use client';

import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function ChangePasswordForm() {
  const form = useForm({ defaultValues: { current: '', new: '', confirm: '' } });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => toast.success('Password changed'))} className="space-y-4">
            <FormField control={form.control} name="current" render={({ field }) => (
              <FormItem><FormLabel>Current Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="new" render={({ field }) => (
              <FormItem><FormLabel>New Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="confirm" render={({ field }) => (
              <FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl></FormItem>
            )} />
            <Button type="submit">Change Password</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
