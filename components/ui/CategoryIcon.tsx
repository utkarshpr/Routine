import { createElement } from "react";
import {
  Blocks,
  Braces,
  Briefcase,
  ChefHat,
  Circle,
  Dumbbell,
  Heart,
  type LucideIcon,
  Moon,
  Network,
  Sparkles,
  Terminal,
  Users,
} from "lucide-react";
import type { Category } from "@/types";
import { CATEGORY_META } from "@/lib/constants";

const ICONS: Record<string, LucideIcon> = {
  Briefcase,
  Braces,
  Terminal,
  Network,
  Blocks,
  Dumbbell,
  ChefHat,
  Sparkles,
  Users,
  Heart,
  Moon,
  Circle,
};

export function iconForName(name: string): LucideIcon {
  return ICONS[name] ?? Circle;
}

export const ICON_NAMES = Object.keys(ICONS);

export function CategoryIcon({
  category,
  iconName,
  className,
  style,
}: {
  category?: Category;
  iconName?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const resolvedName = iconName ?? (category ? CATEGORY_META[category].icon : "Circle");
  return createElement(iconForName(resolvedName), { className, style, "aria-hidden": true });
}
