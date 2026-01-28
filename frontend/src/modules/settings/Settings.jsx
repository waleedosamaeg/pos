import React from 'react';
import { Settings as SettingsIcon, Save, RotateCcw } from 'lucide-react';

/**
 * Settings Module
 * System configuration and preferences
 */
export default function Settings() {
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="erp-panel max-w-2xl">
        <div className="erp-panel-header flex items-center gap-2">
          <SettingsIcon size={16} />
          <span>Preferences</span>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-4">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-2">Company Name</label>
                <input type="text" placeholder="Enter company name" className="erp-input" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-2">Currency</label>
                <select className="erp-input">
                  <option>SAR - Saudi Riyal</option>
                  <option>USD - US Dollar</option>
                  <option>EUR - Euro</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-2">Tax Rate (%)</label>
                <input type="number" placeholder="15" className="erp-input" />
              </div>
            </div>
          </div>

          <hr className="border-border" />

          <div>
            <h3 className="text-sm font-semibold mb-4">Display Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold">Dark Mode</label>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold">Show Tips on Startup</label>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
            </div>
          </div>

          <hr className="border-border" />

          <div className="flex gap-2 justify-end">
            <button className="erp-btn erp-btn-secondary flex items-center gap-2">
              <RotateCcw size={14} /> Reset
            </button>
            <button className="erp-btn erp-btn-primary flex items-center gap-2">
              <Save size={14} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
