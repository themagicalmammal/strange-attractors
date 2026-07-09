export interface ComponentDoc {
  name: string;
  description: string;
  importPath: string;
  usage: string;
  variants: { name: string; type: string; options: string[]; default: string }[];
}

export const componentDocs: ComponentDoc[] = [
  {
    name: "Button",
    description: "A flexible button component with multiple variants and sizes.",
    importPath: "@/components/ui/button",
    usage: `import { Button } from "@/components/ui/button";

<Button variant="default" size="default">
  Click me
</Button>`,
    variants: [
      { name: "variant", type: "string", options: ["default", "outline", "secondary", "ghost", "destructive", "link"], default: "default" },
      { name: "size", type: "string", options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"], default: "default" },
    ],
  },
  {
    name: "Select",
    description: "A customizable select component for dropdown menus.",
    importPath: "@/components/ui/select",
    usage: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

<Select value={value} onValueChange={setValue}>
  <SelectTrigger className="w-full">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>`,
    variants: [],
  },
  {
    name: "Slider",
    description: "A range slider for selecting values within a range.",
    importPath: "@/components/ui/slider",
    usage: `import { Slider } from "@/components/ui/slider";

<Slider
  min={0}
  max={100}
  step={1}
  value={[value]}
  onValueChange={([v]) => setValue(v)}
  className="w-full"
/>`,
    variants: [],
  },
  {
    name: "Switch",
    description: "A toggle switch component for boolean values.",
    importPath: "@/components/ui/switch",
    usage: `import { Switch } from "@/components/ui/switch";

<Switch
  checked={isChecked}
  onCheckedChange={setIsChecked}
  id="my-switch"
/>
<label htmlFor="my-switch" className="text-sm">
  Toggle
</label>`,
    variants: [
      { name: "size", type: "string", options: ["default", "sm"], default: "default" },
    ],
  },
  {
    name: "Card",
    description: "A container component with header, content, and footer sections.",
    importPath: "@/components/ui/card",
    usage: `import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

<Card className="w-[350px]">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
  <CardFooter className="flex justify-end">
    <Button>Action</Button>
  </CardFooter>
</Card>`,
    variants: [
      { name: "size", type: "string", options: ["default", "sm"], default: "default" },
    ],
  },
  {
    name: "Separator",
    description: "A visual divider for grouping content.",
    importPath: "@/components/ui/separator",
    usage: `import { Separator } from "@/components/ui/separator";

<Separator className="my-4" />`,
    variants: [],
  },
  {
    name: "ScrollArea",
    description: "A custom scrollable area component.",
    importPath: "@/components/ui/scroll-area",
    usage: `import { ScrollArea } from "@/components/ui/scroll-area";

<ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
  <div>Content that overflows...</div>
</ScrollArea>`,
    variants: [],
  },
  {
    name: "Badge",
    description: "A small badge or tag component for labels and status indicators.",
    importPath: "@/components/ui/badge",
    usage: `import { Badge } from "@/components/ui/badge";

<Badge variant="default">Badge</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="ghost">Ghost</Badge>`,
    variants: [
      { name: "variant", type: "string", options: ["default", "outline", "secondary", "destructive", "ghost"], default: "default" },
    ],
  },
  {
    name: "Tooltip",
    description: "A tooltip component for showing additional information on hover.",
    importPath: "@/components/ui/tooltip",
    usage: `import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>This is a tooltip</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>`,
    variants: [],
  },
  {
    name: "Label",
    description: "An accessible label component for form inputs.",
    importPath: "@/components/ui/label",
    usage: `import { Label } from "@/components/ui/label";

<Label htmlFor="email">Email</Label>
<input id="email" type="email" />`,
    variants: [],
  },
];
