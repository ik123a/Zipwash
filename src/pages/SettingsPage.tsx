import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import {
  Moon,
  Sun,
  Bell,
  Mail,
  Shield,
  Globe,
  Smartphone,
  Volume2,
  Lock,
  Palette,
  Type,
  ChevronRight,
} from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const [settings, setSettings] = React.useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    preferences: {
      autoLogout: true,
      sound: true,
      compactMode: false,
    },
    security: {
      twoFactor: false,
      sessionTimeout: '30',
    },
  });

  const handleToggle = (category: keyof typeof settings, key: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key as keyof typeof prev[typeof category]],
      },
    }));
  };

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full animate-fade-up p-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground dark:text-muted-foreground">Settings</h1>
        <p className="text-muted-foreground dark:text-muted-foreground mt-1">Manage your preferences and application settings</p>
      </div>

      {/* Appearance Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info-surface dark:bg-purple-900/30 flex items-center justify-center">
              <Palette className="h-5 w-5 text-info-foreground dark:text-info-foreground" />
            </div>
            <div>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted dark:bg-slate-800 flex items-center justify-center">
                {isDark ? (
                  <Moon className="h-4 w-4 text-text-moderate dark:text-muted-foreground" />
                ) : (
                  <Sun className="h-4 w-4 text-text-moderate" />
                )}
              </div>
              <div>
                <Label htmlFor="theme" className="text-base font-medium text-foreground dark:text-muted-foreground">
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </Label>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                  {isDark ? 'Easier on the eyes in low light' : 'Clean and bright interface'}
                </p>
              </div>
            </div>
            <Switch
              id="theme"
              checked={isDark}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>

          <Separator />

          {/* Compact Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted dark:bg-slate-800 flex items-center justify-center">
                <Type className="h-4 w-4 text-text-moderate dark:text-muted-foreground" />
              </div>
              <div>
                <Label htmlFor="compact" className="text-base font-medium text-foreground dark:text-muted-foreground">
                  Compact Mode
                </Label>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Reduce spacing for denser content</p>
              </div>
            </div>
            <Switch
              id="compact"
              checked={settings.preferences.compactMode}
              onCheckedChange={() => handleToggle('preferences', 'compactMode')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info-surface dark:bg-info/30 flex items-center justify-center">
              <Bell className="h-5 w-5 text-info-foreground dark:text-info-foreground" />
            </div>
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Control how you receive alerts and updates</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted dark:bg-slate-800 flex items-center justify-center">
                <Mail className="h-4 w-4 text-text-moderate dark:text-muted-foreground" />
              </div>
              <div>
                <Label htmlFor="email" className="text-base font-medium text-foreground dark:text-muted-foreground">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
            </div>
            <Switch
              id="email"
              checked={settings.notifications.email}
              onCheckedChange={() => handleToggle('notifications', 'email')}
            />
          </div>

          <Separator />

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Smartphone className="h-4 w-4 text-text-moderate" />
              </div>
              <div>
                <Label htmlFor="push" className="text-base font-medium">
                  Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Browser and app push alerts</p>
              </div>
            </div>
            <Switch
              id="push"
              checked={settings.notifications.push}
              onCheckedChange={() => handleToggle('notifications', 'push')}
            />
          </div>

          <Separator />

          {/* SMS Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Smartphone className="h-4 w-4 text-text-moderate" />
              </div>
              <div>
                <Label htmlFor="sms" className="text-base font-medium">
                  SMS Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Text message order updates</p>
              </div>
            </div>
            <Switch
              id="sms"
              checked={settings.notifications.sms}
              onCheckedChange={() => handleToggle('notifications', 'sms')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success-surface dark:bg-success/30 flex items-center justify-center">
              <Globe className="h-5 w-5 text-success-foreground dark:text-success-foreground" />
            </div>
            <div>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>General application preferences</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sound Effects */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Volume2 className="h-4 w-4 text-text-moderate" />
              </div>
              <div>
                <Label htmlFor="sound" className="text-base font-medium">
                  Sound Effects
                </Label>
                <p className="text-sm text-muted-foreground">Play sounds for actions and notifications</p>
              </div>
            </div>
            <Switch
              id="sound"
              checked={settings.preferences.sound}
              onCheckedChange={() => handleToggle('preferences', 'sound')}
            />
          </div>

          <Separator />

          {/* Auto Logout */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Lock className="h-4 w-4 text-text-moderate" />
              </div>
              <div>
                <Label htmlFor="autologout" className="text-base font-medium">
                  Auto Logout
                </Label>
                <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
              </div>
            </div>
            <Switch
              id="autologout"
              checked={settings.preferences.autoLogout}
              onCheckedChange={() => handleToggle('preferences', 'autoLogout')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-error-surface dark:bg-error/30 flex items-center justify-center">
              <Shield className="h-5 w-5 text-error-foreground dark:text-error-foreground" />
            </div>
            <div>
              <CardTitle>Security</CardTitle>
              <CardDescription>Keep your account secure</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Two Factor Auth */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-background border border-border dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center">
                <Lock className="h-4 w-4 text-text-moderate" />
              </div>
              <div>
                <span className="text-base font-medium block text-foreground dark:text-muted-foreground">Two-Factor Authentication</span>
                <span className="text-sm text-muted-foreground">Add an extra layer of security</span>
              </div>
            </div>
            <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white">
              Setup
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Session Timeout */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-background border border-border dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center">
                <Moon className="h-4 w-4 text-text-moderate" />
              </div>
              <div>
                <span className="text-base font-medium block text-foreground dark:text-muted-foreground">Session Timeout</span>
                <span className="text-sm text-muted-foreground">Auto logout after 30 minutes of inactivity</span>
              </div>
            </div>
            <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white">
              Change
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Change Password */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-background border border-border dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center">
                <Lock className="h-4 w-4 text-text-moderate" />
              </div>
              <div>
                <span className="text-base font-medium block">Change Password</span>
                <span className="text-sm text-muted-foreground">Update your account password</span>
              </div>
            </div>
            <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white">
              Change
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => {
          setSettings({
            notifications: { email: true, push: true, sms: false },
            preferences: { autoLogout: true, sound: true, compactMode: false },
            security: { twoFactor: false, sessionTimeout: '30' },
          });
          toast.info("Settings reset to defaults");
        }}>
          Reset to Default
        </Button>
        <Button onClick={handleSave} className="bg-slate-900 hover:bg-slate-800">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
