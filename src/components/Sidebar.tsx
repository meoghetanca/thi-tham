import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { House, Keyboard, Menu, ScrollText, Settings2 } from "lucide-react";
import ThiThamLogo from "./icons/ThiThamLogo";
import ThiThamWordmark from "./icons/ThiThamWordmark";
import { MicButton } from "./MicButton";
import {
  HomePanel,
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
  home: {
    labelKey: "sidebar.home",
    icon: House,
    component: HomePanel,
    enabled: () => true,
  },
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

const COLLAPSE_KEY = "sidebar:collapsed";

interface SidebarProps {
  activeSection: SidebarSection;
  onSectionChange: (section: SidebarSection) => void;
}

/**
 * Collapsible left rail.
 *
 * Collapsed, the logo doubles as the expand control — a hamburger in a 64px
 * column costs a row and earns nothing, and the mark is the one thing always
 * worth showing. The collapsed state is per-machine window furniture, so it
 * lives in localStorage rather than app settings.
 */
export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
}) => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      // Private mode or blocked storage: expanded is the safe default.
    }
  }, []);

  const toggle = useCallback(() => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        // Not worth failing the interaction over.
      }
      return next;
    });
  }, []);

  const sections = Object.entries(SECTIONS_CONFIG)
    .filter(([, config]) => config.enabled())
    .map(([id, config]) => ({ id: id as SidebarSection, ...config }));

  return (
    <aside
      className={`flex h-full shrink-0 flex-col border-e border-mid-gray/20
        transition-[width] duration-200 ease-out
        ${collapsed ? "w-[72px] px-2" : "w-60 px-3"}`}
    >
      {/* Brand row doubles as the collapse control */}
      <div
        className={`flex items-center pt-4 pb-5 ${
          collapsed ? "justify-center" : "gap-2.5"
        }`}
      >
        <button
          type="button"
          onClick={collapsed ? toggle : undefined}
          aria-label={collapsed ? t("sidebar.expand") : undefined}
          title={collapsed ? t("sidebar.expand") : undefined}
          className={`flex shrink-0 items-center rounded-lg ${
            collapsed
              ? "cursor-pointer p-1 hover:bg-mid-gray/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-logo-primary"
              : "cursor-default"
          }`}
        >
          {collapsed ? (
            <ThiThamLogo size={44} />
          ) : (
            <ThiThamWordmark size={44} />
          )}
        </button>

        {!collapsed && (
          <>
            <button
              type="button"
              onClick={toggle}
              aria-label={t("sidebar.collapse")}
              title={t("sidebar.collapse")}
              className="ms-auto shrink-0 cursor-pointer rounded-lg p-1.5 opacity-60
                transition hover:bg-mid-gray/15 hover:opacity-100
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-logo-primary"
            >
              <Menu width={19} height={19} />
            </button>
          </>
        )}
      </div>

      <nav className="flex flex-col gap-1.5">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          const label = t(section.labelKey);

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSectionChange(section.id)}
              aria-current={isActive ? "page" : undefined}
              title={collapsed ? label : undefined}
              className={`flex cursor-pointer items-center rounded-xl transition-colors
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-logo-primary
                ${collapsed ? "h-11 w-11 justify-center self-center" : "gap-3 px-3 py-2.5"}
                ${
                  isActive
                    ? "bg-logo-primary/25 text-accent-strong font-semibold"
                    : "opacity-70 hover:bg-mid-gray/15 hover:opacity-100"
                }`}
            >
              <Icon width={20} height={20} className="shrink-0" />
              {!collapsed && (
                <span className="truncate text-[15px]">{label}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className={`mt-auto pb-4 ${collapsed ? "self-center" : ""}`}>
        <MicButton expanded={!collapsed} />
      </div>
    </aside>
  );
};
