declare module '*.jsx' {
  import * as React from 'react';
  const component: React.ComponentType<Record<string, unknown>>;
  export default component;
}

declare module '../modals/ProfileSettingsModal' {
  export const ProfileSettingsModal: React.ComponentType<{
    isOpen: boolean;
    onClose: (open: boolean) => void;
  }>;
}

