import { useState, useMemo } from "react";
import { componentDocs, type ComponentDoc } from "./ComponentDocsData";
import { cn } from "@/lib/utils";

// Import components for live previews
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

interface ComponentDocsProps {
  onClose: () => void;
}

function HighlightedCode({ code }: { code: string }) {
  const highlighted = useMemo(() => {
    return code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(
        /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,
        '<span class="text-green-400">$1</span>'
      )
      .replace(
        /\b(import|export|from|const|let|var|function|return|if|else|true|false|null|undefined|this|new|typeof|as|type|interface)\b/g,
        '<span class="text-purple-400">$1</span>'
      )
      .replace(
        /\b(\{|\}|\(|\)|\[|\]|=|:|;|,|\.|\+|-|\*|\/|%|!|&amp;&amp;|\|\|&lt;&gt;|===|!==|&gt;|&lt;)/g,
        '<span class="text-yellow-300">$1</span>'
      )
      .replace(
        /\b(\w+)(?=\s*\()/g,
        '<span class="text-blue-300">$1</span>'
      )
      .replace(
        /(&lt;\/?)([\w.]+)/g,
        '$1<span class="text-red-300">$2</span>'
      );
  }, [code]);

  return <code dangerouslySetInnerHTML={{ __html: highlighted }} className="block" />;
}

function ComponentPreview({ doc }: { doc: ComponentDoc }) {
  if (doc.name === "Button") {
    return (
      <div className="flex flex-wrap gap-3">
        {["default", "outline", "secondary", "ghost", "destructive", "link"].map((v) => (
          <Button key={v} variant={v as any} size="default">
            {v}
          </Button>
        ))}
      </div>
    );
  }
  if (doc.name === "Badge") {
    return (
      <div className="flex flex-wrap gap-2">
        {["default", "outline", "secondary", "destructive", "ghost"].map((v) => (
          <Badge key={v} variant={v as any}>
            {v}
          </Badge>
        ))}
      </div>
    );
  }
  if (doc.name === "Slider") {
    return (
      <Slider
        min={0}
        max={100}
        step={1}
        value={[50]}
        onValueChange={() => { /* noop */ }}
        className="w-full"
      />
    );
  }
  if (doc.name === "Switch") {
    const [on, setOn] = useState(false);
    return (
      <div className="flex items-center gap-2">
        <Switch checked={on} onCheckedChange={setOn} id="docs-switch" />
        <label htmlFor="docs-switch" className="text-sm text-muted-foreground">
          Toggle me
        </label>
      </div>
    );
  }
  if (doc.name === "Select") {
    const [val, setVal] = useState("");
    return (
      <Select value={val} onValueChange={(v: string | null) => setVal(v ?? val)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
          <SelectItem value="2">Option 2</SelectItem>
          <SelectItem value="3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    );
  }
  if (doc.name === "Card") {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This is a live preview of the Card component.
          </p>
        </CardContent>
      </Card>
    );
  }
  if (doc.name === "Separator") {
    return (
      <div className="space-y-3">
        <div className="p-3 rounded bg-muted/30">Before separator</div>
        <Separator className="my-4" />
        <div className="p-3 rounded bg-muted/30">After separator</div>
      </div>
    );
  }
  if (doc.name === "Label") {
    return (
      <div className="space-y-3">
        <div>
          <Label htmlFor="docs-email">Email</Label>
          <input id="docs-email" className="mt-1 w-full px-3 py-2 rounded border border-border bg-transparent text-sm" placeholder="Enter your email" />
        </div>
        <div>
          <Label htmlFor="docs-password">Password</Label>
          <input id="docs-password" type="password" className="mt-1 w-full px-3 py-2 rounded border border-border bg-transparent text-sm" placeholder="Enter password" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center h-32 rounded border border-border border-dashed text-muted-foreground text-sm">
      Preview not available for {doc.name}
    </div>
  );
}

function VariantControls({ doc }: { doc: ComponentDoc }) {
  const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({});

  if (doc.variants.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {doc.variants.map((v) => (
        <div key={v.name} className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">{v.name}:</span>
          <select
            className="text-xs px-1.5 py-0.5 rounded border border-border bg-transparent"
            value={selectedVariant[v.name] ?? v.default}
            onChange={(e) => setSelectedVariant((p) => ({ ...p, [v.name]: e.target.value }))}
          >
            {v.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

export function ComponentDocs({ onClose }: ComponentDocsProps) {
  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const doc = componentDocs[selected];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">{doc.name}</h2>
          <span className="text-xs px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">
            {doc.importPath}
          </span>
        </div>
        <button
          className="text-muted-foreground hover:text-foreground transition-colors"
          onClick={onClose}
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — component list */}
        <div className="w-44 border-r border-border overflow-auto shrink-0">
          {componentDocs.map((c, i) => (
            <button
              key={c.name}
              className={cn(
                "w-full text-left px-4 py-2 text-xs transition-colors",
                i === selected
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
              onClick={() => {
                setSelected(i);
                setTab("preview");
              }}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-auto">
          {/* Tabs */}
          <div className="flex items-center gap-0 px-5 border-b border-border">
            <button
              className={cn(
                "px-3 py-2 text-xs border-b-2 transition-colors",
                tab === "preview"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setTab("preview")}
            >
              Preview
            </button>
            <button
              className={cn(
                "px-3 py-2 text-xs border-b-2 transition-colors",
                tab === "code"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setTab("code")}
            >
              Code
            </button>
          </div>

          {/* Description */}
          <div className="px-5 py-3 text-xs text-muted-foreground border-b border-border">
            {doc.description}
          </div>

          {/* Variant controls */}
          {tab === "preview" && (
            <div className="px-5 py-3 border-b border-border">
              <VariantControls doc={doc} />
            </div>
          )}

          {/* Preview or code */}
          <div className="flex-1 p-5 overflow-auto">
            {tab === "preview" ? (
              <div className="flex items-center justify-center min-h-[120px]">
                <ComponentPreview doc={doc} />
              </div>
            ) : (
              <pre className="p-4 rounded-lg bg-muted/50 text-xs font-mono text-foreground overflow-auto whitespace-pre-wrap">
                <HighlightedCode code={doc.usage} />
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
