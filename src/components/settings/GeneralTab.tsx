"use client";

import { useState } from "react";
import { Upload, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const TIMEZONES = [
  "UTC",
  "America/New_York (EST/EDT)",
  "America/Chicago (CST/CDT)",
  "America/Denver (MST/MDT)",
  "America/Los_Angeles (PST/PDT)",
  "Europe/London (GMT/BST)",
  "Europe/Paris (CET/CEST)",
  "Europe/Berlin (CET/CEST)",
  "Asia/Tokyo (JST)",
  "Asia/Singapore (SGT)",
  "Australia/Sydney (AEST/AEDT)",
];

const inputCls =
  "w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/10 transition-all";

export function GeneralTab() {
  const [orgName, setOrgName] = useState("WaniWani");
  const [timezone, setTimezone] = useState("America/New_York (EST/EDT)");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Card className="border-border/50">
        <CardContent className="p-6">
          <h3 className="mb-5 text-sm font-semibold">Organization</h3>
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className={inputCls}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Appears in reports, emails, and invoices sent to your customers.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Organization Logo</label>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-border bg-gray-50 text-3xl">
                  🐊
                </div>
                <div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-gray-50 transition-colors">
                    <Upload className="h-3.5 w-3.5" />
                    Upload new logo
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    PNG, JPG or SVG — 512×512px recommended
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className={inputCls}
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Used for report timestamps and scheduled tasks.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-lg bg-[#6C5CE7] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#5a4bd1] transition-colors"
        >
          {saved && <Check className="h-4 w-4" />}
          {saved ? "Saved" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
