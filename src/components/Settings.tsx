import React from "react";
import { useChatStore } from "../store/chatStore";
import { AVAILABLE_MODELS } from "../utils/ai";
import { FiX, FiEye, FiEyeOff } from "react-icons/fi";

export default function Settings() {
  const { settings, updateSettings, setSettingsOpen } = useChatStore();
  const [showKey, setShowKey] = React.useState(false);
  const [localSettings, setLocalSettings] = React.useState(settings);

  const handleSave = () => {
    updateSettings(localSettings);
    setSettingsOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setSettingsOpen(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button
            className="modal-close"
            onClick={() => setSettingsOpen(false)}
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="settings-section">
            <label className="settings-label">
              OpenRouter API Key
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="settings-link"
              >
                Get key →
              </a>
            </label>
            <div className="api-key-input">
              <input
                type={showKey ? "text" : "password"}
                className="settings-input"
                value={localSettings.apiKey}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, apiKey: e.target.value })
                }
                placeholder="sk-or-..."
              />
              <button
                className="toggle-key-btn"
                onClick={() => setShowKey(!showKey)}
                type="button"
              >
                {showKey ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            <p className="settings-hint">
              D-Bolt-AI uses OpenRouter to access various AI models. Your key is
              stored locally in your browser.
            </p>
          </div>

          <div className="settings-section">
            <label className="settings-label">AI Model</label>
            <select
              className="settings-select"
              value={localSettings.selectedModel}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  selectedModel: e.target.value,
                })
              }
            >
              {AVAILABLE_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.provider} — {model.name} ({model.description})
                </option>
              ))}
            </select>
          </div>

          <div className="settings-section">
            <label className="settings-label">System Prompt</label>
            <textarea
              className="settings-textarea"
              value={localSettings.systemPrompt}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  systemPrompt: e.target.value,
                })
              }
              rows={4}
            />
          </div>

          <div className="settings-row">
            <div className="settings-section">
              <label className="settings-label">
                Temperature: {localSettings.temperature}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={localSettings.temperature}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    temperature: parseFloat(e.target.value),
                  })
                }
                className="settings-range"
              />
              <div className="range-labels">
                <span>Precise</span>
                <span>Creative</span>
              </div>
            </div>

            <div className="settings-section">
              <label className="settings-label">
                Max Tokens: {localSettings.maxTokens}
              </label>
              <input
                type="range"
                min="512"
                max="8192"
                step="512"
                value={localSettings.maxTokens}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    maxTokens: parseInt(e.target.value),
                  })
                }
                className="settings-range"
              />
              <div className="range-labels">
                <span>512</span>
                <span>8192</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn-secondary"
            onClick={() => setSettingsOpen(false)}
          >
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}