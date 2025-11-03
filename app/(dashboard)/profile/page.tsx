'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PersonalInfoForm } from './_components/personal-info-form';
import { ChangePasswordForm } from './_components/change-password-form';
import { TwoFactorSetup } from './_components/two-factor-setup';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/avatar.jpg" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">John Doe</h1>
          <p className="text-muted-foreground">john.doe@example.com</p>
        </div>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <PersonalInfoForm />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <ChangePasswordForm />
          <TwoFactorSetup />
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="p-6">
            <p className="text-muted-foreground">Preferences settings coming soon</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
