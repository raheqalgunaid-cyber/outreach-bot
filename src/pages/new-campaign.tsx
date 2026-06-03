import { useState } from "react";
import { useLocation } from "wouter";
import { useListTemplates } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NewCampaign() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { data: templates } = useListTemplates();

  const [form, setForm] = useState({
    name: "",
    platform: "",
    messageTemplateId: "",
    minViewers: "",
    maxViewers: "",
    category: "",
    messagesPerHour: "30",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        name: form.name,
        platform: form.platform,
        messagesPerHour: Number(form.messagesPerHour) || 30,
      };
      if (form.messageTemplateId) body.messageTemplateId = Number(form.messageTemplateId);
      if (form.minViewers) body.minViewers = Number(form.minViewers);
      if (form.maxViewers) body.maxViewers = Number(form.maxViewers);
      if (form.category) body.category = form.category;
      if (form.notes) body.notes = form.notes;

      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to create campaign");
      }
      toast({ title: "Campaign created" });
      navigate("/campaigns");
    } catch (err) {
      toast({ title: String(err), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Campaign</h1>
        <p className="text-muted-foreground mt-1">Configure and launch a new outreach campaign.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Summer Stripchat Push"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Platform *</Label>
              <Select value={form.platform} onValueChange={v => setForm(f => ({ ...f, platform: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stripchat">Stripchat</SelectItem>
                  <SelectItem value="tango">Tango</SelectItem>
                  <SelectItem value="xenalive">Xenalive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Message Template</Label>
              <Select value={form.messageTemplateId} onValueChange={v => setForm(f => ({ ...f, messageTemplateId: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="No template (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {(templates ?? []).map(t => (
                    <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="minViewers">Min Viewers</Label>
                <Input
                  id="minViewers"
                  type="number"
                  min={0}
                  placeholder="e.g. 10"
                  value={form.minViewers}
                  onChange={e => setForm(f => ({ ...f, minViewers: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="maxViewers">Max Viewers</Label>
                <Input
                  id="maxViewers"
                  type="number"
                  min={0}
                  placeholder="e.g. 500"
                  value={form.maxViewers}
                  onChange={e => setForm(f => ({ ...f, maxViewers: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g. cam, dance (optional)"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="messagesPerHour">Messages Per Hour</Label>
              <Input
                id="messagesPerHour"
                type="number"
                min={1}
                max={120}
                value={form.messagesPerHour}
                onChange={e => setForm(f => ({ ...f, messagesPerHour: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any internal notes about this campaign..."
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={submitting || !form.name || !form.platform}>
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {submitting ? "Creating..." : "Create Campaign"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/campaigns")}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
