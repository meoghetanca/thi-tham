import React from "react";
import { useTranslation } from "react-i18next";
import ThiThamLogo from "./ThiThamLogo";

/** Logo and name as one lockup, so every surface scales them together. */
const ThiThamWordmark: React.FC<{ size?: number; className?: string }> = ({
  size = 56,
  className = "",
}) => {
  const { t } = useTranslation();
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <ThiThamLogo size={size} />
      <span
        className="font-display truncate"
        style={{ fontSize: Math.round(size * 0.36) }}
      >
        {t("app.name")}
      </span>
    </div>
  );
};

export default ThiThamWordmark;
