"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [siteName, setSiteName] = useState("ITAM Platform");
  const [timezone, setTimezone] = useState("America/New_York");
  const [retention, setRetention] = useState("90");
  const [currency, setCurrency] = useState("USD");
  const [depMethod, setDepMethod] = useState("straight-line");
  const [autoTag, setAutoTag] = useState(true);

  const [emailNotif, setEmailNotif] = useState(true);
  const [licenseExpiry, setLicenseExpiry] = useState(true);
  const [assetAssign, setAssetAssign] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  const [passwordMinLength, setPasswordMinLength] = useState("8");
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [twoFactor, setTwoFactor] = useState(false);

  // Integration states
  const [adConnected, setAdConnected] = useState(false);
  const [jiraConnected, setJiraConnected] = useState(false);
  const [slackConnected, setSlackConnected] = useState(true);

  // Save confirmation
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveSection, setSaveSection] = useState("");

  // Integration dialog
  const [integrationOpen, setIntegrationOpen] = useState(false);
  const [integrationName, setIntegrationName] = useState("");
  const [integrationAction, setIntegrationAction] = useState<"connect" | "disconnect">("connect");

  function handleSave(section: string) {
    setSaveSection(section);
    setSaveOpen(true);
  }

  function handleIntegrationToggle(name: string, currentlyConnected: boolean) {
    setIntegrationName(name);
    setIntegrationAction(currentlyConnected ? "disconnect" : "connect");
    setIntegrationOpen(true);
  }

  function confirmIntegration() {
    if (integrationName === "Active Directory") {
      setAdConnected(integrationAction === "connect");
    } else if (integrationName === "JIRA") {
      setJiraConnected(integrationAction === "connect");
    } else if (integrationName === "Slack") {
      setSlackConnected(integrationAction === "connect");
    }
    setIntegrationOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">System Settings</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Configure platform settings
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="general" className="data-active:bg-zinc-800 data-active:text-zinc-100 text-zinc-400">
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-active:bg-zinc-800 data-active:text-zinc-100 text-zinc-400">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-active:bg-zinc-800 data-active:text-zinc-100 text-zinc-400">
            Security
          </TabsTrigger>
          <TabsTrigger value="integrations" className="data-active:bg-zinc-800 data-active:text-zinc-100 text-zinc-400">
            Integrations
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general">
          <div className="space-y-6 pt-2">
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h2 className="text-lg font-semibold text-zinc-100 mb-5">
                Platform Settings
              </h2>
              <div className="space-y-5 max-w-lg">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Site Name</Label>
                  <Input
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-zinc-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Default Timezone</Label>
                  <Select value={timezone} onValueChange={(val) => setTimezone(val as string)}>
                    <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (US & Canada)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (US & Canada)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (US & Canada)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Data Retention</Label>
                  <Select value={retention} onValueChange={(val) => setRetention(val as string)}>
                    <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h2 className="text-lg font-semibold text-zinc-100 mb-5">
                Asset Settings
              </h2>
              <div className="space-y-5 max-w-lg">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Default Currency</Label>
                  <Select value={currency} onValueChange={(val) => setCurrency(val as string)}>
                    <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (&euro;)</SelectItem>
                      <SelectItem value="GBP">GBP (&pound;)</SelectItem>
                      <SelectItem value="INR">INR (&#8377;)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Depreciation Method</Label>
                  <Select value={depMethod} onValueChange={(val) => setDepMethod(val as string)}>
                    <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="straight-line">Straight Line</SelectItem>
                      <SelectItem value="declining-balance">Declining Balance</SelectItem>
                      <SelectItem value="sum-of-years">Sum of Years Digits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      Auto-generate Asset Tags
                    </p>
                    <p className="text-xs text-zinc-500">
                      Automatically assign asset tags on creation
                    </p>
                  </div>
                  <Switch
                    checked={autoTag}
                    onCheckedChange={setAutoTag}
                  />
                </div>
              </div>
            </Card>

            <div>
              <Button onClick={() => handleSave("General")}>Save Changes</Button>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div className="pt-2">
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h2 className="text-lg font-semibold text-zinc-100 mb-5">
                Notification Preferences
              </h2>
              <div className="space-y-6 max-w-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      Email Notifications
                    </p>
                    <p className="text-xs text-zinc-500">
                      Receive email alerts for important events
                    </p>
                  </div>
                  <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      License Expiry Alerts
                    </p>
                    <p className="text-xs text-zinc-500">
                      Get notified before software licenses expire
                    </p>
                  </div>
                  <Switch checked={licenseExpiry} onCheckedChange={setLicenseExpiry} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      Asset Assignment Alerts
                    </p>
                    <p className="text-xs text-zinc-500">
                      Notify when assets are assigned or unassigned
                    </p>
                  </div>
                  <Switch checked={assetAssign} onCheckedChange={setAssetAssign} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      Weekly Digest
                    </p>
                    <p className="text-xs text-zinc-500">
                      Receive a weekly summary of system activity
                    </p>
                  </div>
                  <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
                </div>
              </div>
            </Card>
            <div className="mt-6">
              <Button onClick={() => handleSave("Notifications")}>Save Changes</Button>
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="pt-2">
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h2 className="text-lg font-semibold text-zinc-100 mb-5">
                Security Settings
              </h2>
              <div className="space-y-5 max-w-lg">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Minimum Password Length</Label>
                  <Input
                    type="number"
                    min={6}
                    max={32}
                    value={passwordMinLength}
                    onChange={(e) => setPasswordMinLength(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 w-32"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Session Timeout</Label>
                  <Select value={sessionTimeout} onValueChange={(val) => setSessionTimeout(val as string)}>
                    <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      Two-Factor Authentication
                    </p>
                    <p className="text-xs text-zinc-500">
                      Require 2FA for all user accounts
                    </p>
                  </div>
                  <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                </div>
              </div>
            </Card>
            <div className="mt-6">
              <Button onClick={() => handleSave("Security")}>Save Changes</Button>
            </div>
          </div>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <div className="pt-2 space-y-4">
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-zinc-100">
                    Active Directory
                  </h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Sync users and groups from Active Directory / LDAP
                  </p>
                </div>
                {adConnected ? (
                  <Button variant="outline" className="border-green-600 text-green-400 hover:bg-green-950" onClick={() => handleIntegrationToggle("Active Directory", true)}>
                    Disconnect
                  </Button>
                ) : (
                  <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800" onClick={() => handleIntegrationToggle("Active Directory", false)}>
                    Connect
                  </Button>
                )}
              </div>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-zinc-100">
                    JIRA
                  </h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Link IT asset tickets with JIRA issues
                  </p>
                </div>
                {jiraConnected ? (
                  <Button variant="outline" className="border-green-600 text-green-400 hover:bg-green-950" onClick={() => handleIntegrationToggle("JIRA", true)}>
                    Disconnect
                  </Button>
                ) : (
                  <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800" onClick={() => handleIntegrationToggle("JIRA", false)}>
                    Connect
                  </Button>
                )}
              </div>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-zinc-100">
                    Slack
                  </h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Send notifications and alerts to Slack channels
                  </p>
                </div>
                {slackConnected ? (
                  <Button variant="outline" className="border-green-600 text-green-400 hover:bg-green-950" onClick={() => handleIntegrationToggle("Slack", true)}>
                    Disconnect
                  </Button>
                ) : (
                  <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800" onClick={() => handleIntegrationToggle("Slack", false)}>
                    Connect
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Save Confirmation Dialog */}
      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent className="sm:max-w-sm bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              Settings Saved
            </DialogTitle>
            <DialogDescription>
              {saveSection} settings have been saved successfully.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setSaveOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Integration Connect/Disconnect Dialog */}
      <Dialog open={integrationOpen} onOpenChange={setIntegrationOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">
              {integrationAction === "connect" ? "Connect" : "Disconnect"} {integrationName}
            </DialogTitle>
            <DialogDescription>
              {integrationAction === "connect"
                ? `Are you sure you want to connect ${integrationName} to your ITAM platform?`
                : `Are you sure you want to disconnect ${integrationName}? This will stop all data syncing.`}
            </DialogDescription>
          </DialogHeader>
          {integrationAction === "disconnect" && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300">
              Disconnecting will stop all automated syncing and notifications through this integration.
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIntegrationOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Cancel</Button>
            {integrationAction === "connect" ? (
              <Button onClick={confirmIntegration}>Connect</Button>
            ) : (
              <Button variant="destructive" onClick={confirmIntegration}>Disconnect</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
