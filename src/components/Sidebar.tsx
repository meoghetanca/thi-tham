import React from "react";
import { useTranslation } from "react-i18next";
import { Keyboard, ScrollText, Settings2 } from "lucide-react";
import HandyTextLogo from "./icons/HandyTextLogo";
import { MicButton } from "./MicButton";
import {
  GeneralSettings,
  AdvancedSettings,
  HistorySettings,
} from "./settings";

export type SidebarSection = keyof typeof SECTIONS_CONFIG;

interface IconProps {
  width?: number | string;
  height?: number | string;
  size?: number | string;
  className?: string;
  [key: string]: any;
}

interface SectionConfig {
  labelKey: string;
  icon: React.ComponentType<IconProps>;
  component: React.ComponentType;
  enabled: () => boolean;
}

/**
 * Three sections, because that is all this app has to say. Models and About sit
 * inside Advanced: both are visited once and then forgotten, which is a section,
 * not a tab.
 */
export const SECTIONS_CONFIG = {
  dictation: {
    labelKey: "sidebar.dictation",
    icon: Keyboard,
    component: GeneralSettings,
    enabled: () => true,
  },
  history: {
    labelKey: "sidebar.history",
    icon: ScrollText,
    component: HistorySettings,
    enabled: () => true,
  },
  advanced: {
    labelKey: "sidebar.advanced",
    icon: Settings2,
    component: AdvancedSettings,
    enabled: () => true,
  },
} as const satisfies Record<string, SectionConfig>;

interface TopBarProps {
  activeSection: SidebarSection;
  onSectionChange: (section: SidebarSection) => void;
}

/**
 * Horizontal shell: brand, section tabs, and the mic.
 *
 * The mic sits in the bar rather than inside a section because dictating is the
 * thing you came to do — it stays one click away no matter which settings page
 * is open.
 */
export const TopBar: React.FC<TopBarProps> = ({
  activeSection,
  onSectionChange,
}) => {
  const { t } = useTranslation();

  const availableSections = Object.entries(SECTIONS_CONFIG)
    .filter(([_, config]) => config.enabled())
    .map(([id, config]) => ({ id: id as SidebarSection, ...config }));

  return (
    <header className="shrink-0 border-b border-mid-gray/20">
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <HandyTextLogo width={92} className="shrink-0" />
        <div className="flex-1" />
        <MicButton />
      </div>

      <nav
        className="flex items-center gap-1 overflow-x-auto px-3 pb-2"
        aria-label={t("sidebar.general")}
      >
        {availableSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSectionChange(section.id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm
                transition-colors cursor-pointer
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-logo-primary
                ${
                  isActive
                    ? "bg-logo-primary/85 text-logo-stroke font-medium"
                    : "opacity-70 hover:opacity-100 hover:bg-mid-gray/15"
                }`}
            >
              <Icon width={16} height={16} className="shrink-0" />
              <span className="truncate">{t(section.labelKey)}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
