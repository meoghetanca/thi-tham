import React from "react";
import { useTranslation } from "react-i18next";
import ThiThamLogo from "./ThiThamLogo";

/**
 * Logo and name as one lockup.
 *
 * `nameSize` is its own prop rather than a ratio of `size`: the two were tied
 * together before, so every adjustment to the mark quietly dragged the wordmark
 * with it and undid the last decision about the text.
 */
const ThiThamWordmark: React.FC<{
  size?: number;
  nameSize?: number;
  className?: string;
}> = ({ size = 60, nameSize = 20, className = "" }) => {
  const { t } = useTranslation();
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <ThiThamLogo size={size} />
      <span className="font-display truncate" style={{ fontSize: nameSize }}>
        {t("app.name")}
      </span>
    </div>
  );
};

export default ThiThamWordmark;
