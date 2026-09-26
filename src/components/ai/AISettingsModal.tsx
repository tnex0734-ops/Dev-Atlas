import React, { useState } from 'react';
import { Settings, X, Eye, EyeOff, Check } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { AIProviderType } from '../../types/aiTypes';
import { AVAILABLE_MODELS } from '../../services/aiService';

export const AISettingsModal: React.FC = () => {
  const { state, updateProviderConfig, toggleSettings } = useAI();
  const { providerConfig } = state;

  const [showKey, setShowKey] = useState(false);
  const [localKey, setLocalKey] = useState(providerConfig.apiKey);
  const [saved, setSaved] = useState(false);

  const providers: { id: AIProviderType; name: string; description: string }[] = [
    { id: 'openrouter', name: 'OpenRouter', description: 'Access many models with one key' },
    { id: 'openai', name: 'OpenAI', description: 'GPT-4o and GPT-4o Mini' },
    { id: 'groq', name: 'Groq', description: 'Fast inference, free tier available' },
  ];

  const models = AVAILABLE_MODELS[providerConfig.provider] || [];

  const handleSaveKey = () => {
    updateProviderConfig({ apiKey: localKey });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/dev-ai.png"
            alt="Dev AI"
            className="w-5 h-5 object-contain"
            style={{ width: 20, height: 20, maxWidth: 20, maxHeight: 20 }}
          />
          <h3 className="text-sm font-semibold text-[#171717]">Dev AI Engine Settings</h3>
        </div>
        <button
          onClick={toggleSettings}
          className="p-1.5 rounded-md hover:bg-[#f5f5f5] text-[#a1a1aa] hover:text-[#171717] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Security notice */}
      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 leading-relaxed">
        <strong>Note:</strong> Your API key is stored locally in your browser and sent directly to the AI provider. It is never sent to DevAtlas servers.
      </div>

      {/* Provider selection */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[#525252] uppercase tracking-wider">Provider</label>
        <div className="space-y-1.5">
          {providers.map(p => (
            <button
              key={p.id}
              onClick={() => {
                updateProviderConfig({
                  provider: p.id,
                  model: AVAILABLE_MODELS[p.id]?.[0]?.id || '',
                });
              }}
              className={`w-full text-left rounded-xl border px-4 py-3 transition-all ${
                providerConfig.provider === p.id
                  ? 'border-[#171717] bg-[#fafafa]'
                  : 'border-[#e5e7eb] hover:border-[#a1a1aa]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#171717]">{p.name}</span>
                {providerConfig.provider === p.id && (
                  <Check className="h-4 w-4 text-[#171717]" />
                )}
              </div>
              <p className="text-xs text-[#a1a1aa] mt-0.5">{p.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Model selection */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[#525252] uppercase tracking-wider">Model</label>
        <select
          value={providerConfig.model}
          onChange={(e) => updateProviderConfig({ model: e.target.value })}
          className="w-full rounded-lg border border-[#e5e7eb] bg-white px-3 py-2.5 text-sm text-[#171717] focus:border-[#171717] focus:outline-none"
        >
          {models.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* API Key */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[#525252] uppercase tracking-wider">API Key</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type={showKey ? 'text' : 'password'}
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              placeholder={`Enter your ${providers.find(p => p.id === providerConfig.provider)?.name} API key`}
              className="w-full rounded-lg border border-[#e5e7eb] bg-white px-3 py-2.5 pr-10 text-sm text-[#171717] font-mono focus:border-[#171717] focus:outline-none"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#a1a1aa] hover:text-[#171717]"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <button
            onClick={handleSaveKey}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              saved
                ? 'bg-emerald-600 text-white'
                : 'bg-[#171717] text-white hover:bg-[#333]'
            }`}
          >
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};
