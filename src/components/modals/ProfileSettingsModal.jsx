import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User, Phone, Lock, Save } from 'lucide-react';
import { authService } from '../../services/api';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

export function ProfileSettingsModal({ isOpen, onClose }) {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password && password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const response = await authService.updateProfile(name, phoneNumber, password || undefined);
      toast.success(response.message);
      
      // Update context user name
      if (setUser) {
          const updatedUser = { ...user, name, phone_number: phoneNumber };
          setUser(updatedUser);
      }
      
      onClose(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="items-center text-center">
          <div className="flex items-center justify-center gap-2 text-primary mb-2">
            <User className="h-5 w-5" />
            <DialogTitle>Profile Settings</DialogTitle>
          </div>
          <DialogDescription>
            Update your personal information and security settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="profile-name" className="flex items-center gap-2">
              <User className="h-3.5 w-3.5" /> Full Name
            </Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-phone" className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" /> Phone Number
            </Label>
            <Input
              id="profile-phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 1234567890"
              type="tel"
              required
            />
          </div>

          <div className="pt-4 border-t">
            <h4 className="text-sm font-semibold mb-3">Change Password</h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="new-password" opacity-70>New Password (Optional)</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" opacity-70>Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button 
                type="button" 
                variant="outline" 
                onClick={() => onClose(false)}
                disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              disabled={loading}
            >
              {loading ? 'Saving...' : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
