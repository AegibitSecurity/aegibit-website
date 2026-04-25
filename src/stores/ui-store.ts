import { create } from "zustand";

interface UiState {
  mobileMenuOpen: boolean;
  exitIntentShown: boolean;
  demoModalOpen: boolean;
  activeSection: string;

  setMobileMenuOpen: (v: boolean) => void;
  setExitIntentShown: () => void;
  setDemoModalOpen: (v: boolean) => void;
  setActiveSection: (s: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  mobileMenuOpen:   false,
  exitIntentShown:  false,
  demoModalOpen:    false,
  activeSection:    "hero",

  setMobileMenuOpen:  (v) => set({ mobileMenuOpen: v }),
  setExitIntentShown: ()  => set({ exitIntentShown: true }),
  setDemoModalOpen:   (v) => set({ demoModalOpen: v }),
  setActiveSection:   (s) => set({ activeSection: s }),
}));
