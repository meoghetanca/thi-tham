import React from "react";
import { useTranslation } from "react-i18next";
import { ShowOverlay } from "../ShowOverlay";
import { SettingsGroup } from "../../ui/SettingsGroup";
import { HistoryLimit } from "../HistoryLimit";
import { RecordingRetentionPeriodSelector } from "../RecordingRetentionPeriod";
import { PostProcessingToggle } from "../PostProcessingToggle";

export const AdvancedSettings: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl w-full mx-auto space-y-6">
      <SettingsGroup title={t("settings.advanced.groups.history")}>
        <HistoryLimit descriptionMode="tooltip" grouped={true} />
        <RecordingRetentionPeriodSelector
          descriptionMode="tooltip"
          grouped={true}
        />
      </SettingsGroup>

      <SettingsGroup title={t("settings.advanced.groups.app")}>
        <ShowOverlay descriptionMode="tooltip" grouped={true} />
      </SettingsGroup>

      {/* Cleanup is the punctuation/capitalisation pass that fixes mixed
          Vietnamese-English dictation. Upstream hides this behind the
          experimental flag; here it is a first-class setting. */}
      <SettingsGroup title={t("settings.cleanup.title")}>
        <PostProcessingToggle descriptionMode="tooltip" grouped={true} />
      </SettingsGroup>
    </div>
  );
};
