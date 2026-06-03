import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useListTemplates,
  getListTemplatesQueryKey,
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";

interface TemplateForm {
  name: string;
  platform: string;
  content: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  stripchat: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  tango: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  xenalive: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
};

const EMPTY_FORM: TemplateForm = { name: "", platform: "all", content: "" };

function TemplateDialog({
  open,
  onClose,
  initial,
  templateId,
}: {
  open: boolean;
  onClose: () => void;
  initial: TemplateForm;
  templateId?: number;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<TemplateForm>(initial);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getListTemplatesQueryKey() });

  const createMutation = useCreateTemplate({
    mutation: {
      onSuccess: () => { toast({ title: "Template created" }); invalidate(); onClose(); },
      onError: (e) => toast({ title: String(e), variant: "destructive" }),
    },
  });

  const updateMutation = useUpdateTemplate({
    mutation: {
      onSuccess: () => { toast({ title: "Template updated" }); invalidate(); onClose(); },
      onError: (e) => toast({ title: String(e), variant: "destructive" }),
    },
  });

  const isEditing = templateId !== undefined;
  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSave = () => {
    if (!form.name || !form.content) {
      toast({ title: "Name and content are required", variant: "destructive" });
      return;
    }
    const payload = {
      name: form.name,
      content: form.content,
      platform: form.platform === "all" ? null : form.platform,
    };
    if (isEditing) {
      updateMutation.mutate({ id: templateId, data: payload });
    } else {
      createMutation.mutate({ data: payload });
    }
  };

  // Reset form when dialog opens
  const handleOpenChange = (v: boolean) => {
    if (!v) onClose();
    else setForm(initial);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Template" : "New Template"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                placeholder="e.g. Friendly Intro"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Platform</Label>
              <Select value={form.platform} onValueChange={v => setForm(f => ({ ...f, platform: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="stripchat">Stripchat</SelectItem>
                  <SelectItem value="tango">Tango</SelectItem>
                  <SelectItem value="xenalive">Xenalive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>
              Content{" "}
              <span className="text-xs text-muted-foreground font-normal">
                — use {"{streamer_name}"} as a placeholder
              </span>
            </Label>
            <Textarea
              placeholder={`Hi {streamer_name}, I'd like to invite you to our agency...`}
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Templates() {
  const { data: templates, isLoading } = useListTemplates();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<{ id: number; form: TemplateForm } | null>(null);

  const deleteMutation = useDeleteTemplate({
    mutation: {
      onSuccess: () => {
        toast({ title: "Template deleted" });
        queryClient.invalidateQueries({ queryKey: getListTemplatesQueryKey() });
      },
      onError: () => toast({ title: "Failed to delete template", variant: "destructive" }),
    },
  });

  const openNew = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (t: { id: number; name: string; content: string; platform: string | null }) => {
    setEditing({ id: t.id, form: { name: t.name, content: t.content, platform: t.platform ?? "all" } });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Message Templates</h1>
          <p className="text-muted-foreground mt-1">Manage reusable outreach message templates.</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="w-4 h-4" /> New Template
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}
        </div>
      ) : !templates?.length ? (
        <Card>
          <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
            <FileText className="w-10 h-10 text-muted-foreground/40" />
            <p className="font-medium text-muted-foreground">No templates yet</p>
            <p className="text-sm text-muted-foreground/70 max-w-sm">
              Create message templates to use in your campaigns.
            </p>
            <Button variant="outline" size="sm" className="mt-2 gap-2" onClick={openNew}>
              <Plus className="w-4 h-4" /> Create Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {templates.map(t => (
            <Card key={t.id}>
              <CardContent className="py-4 px-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">{t.name}</p>
                      {t.platform && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PLATFORM_COLORS[t.platform] ?? "bg-muted text-muted-foreground"}`}>
                          {t.platform.charAt(0).toUpperCase() + t.platform.slice(1)}
                        </span>
                      )}
                      {!t.platform && (
                        <Badge variant="secondary" className="text-xs">All Platforms</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{t.content}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(t)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteMutation.mutate({ id: t.id })}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TemplateDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initial={editing?.form ?? EMPTY_FORM}
        templateId={editing?.id}
      />
    </div>
  );
}
