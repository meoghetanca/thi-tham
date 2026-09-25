import React from "react";
import { useTranslation } from "react-i18next";
import { ShowOverlay } from "../ShowOverlay";
import { SettingsGroup } from "../../ui/SettingsGroup";
import { HistoryLimit } from "../HistoryLimit";
import { RecordingRetentionPeriodSelector } from "../RecordingRetentionPeriod";
import { PostProcessingToggle } from "../PostProcessingToggle";
import { ModelsSettings } from "../models/ModelsSettings";
import { AboutSettings } from "../about/AboutSettings";
import { PostProcessingSettings } from "../post-processing/PostProcessingSettings";
import { useSettings } from "../../../hooks/useSettings";

/**
 * Everything that isn't dictating or reading transcripts.
 *
 * Models and About live here rather than in the navigation: a model is chosen
 * once and rarely revisited, so it earns a section, not a tab.
 */
export const AdvancedSettings: React.FC = () => {
  const { t } = useTranslation();
  const { getSetting } = useSettings();
  const cleanupOn = getSetting("post_process_enabled") || false;

  return (
    <div className="max-w-3xl w-full mx-auto space-y-6">
      <ModelsSettings />

      <SettingsGroup title={t("settings.cleanup.title")}>
        <PostProcessingToggle descriptionMode="tooltip" grouped={true} />
      </SettingsGroup>

      {/* Provider and prompt configuration only matters once cleanup is on;
          it used to be a whole navigation tab of its own. */}
      {cleanupOn && <PostProcessingSettings />}

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

      <AboutSettings />
    </div>
  );
};
