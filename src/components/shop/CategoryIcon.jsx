import { Armchair, Car, CircleDot, Cog, Disc, Droplet, Lightbulb, Sparkles, Wind, Wrench } from "lucide-react";

const ICONS = {
  "Mesin": Cog,
  "Kaki-kaki & Rem": Disc,
  "Velg & Ban": CircleDot,
  "Knalpot": Wind,
  "Body Kit & Eksterior": Car,
  "Interior": Armchair,
  "Lampu & Kelistrikan": Lightbulb,
  "Oli & Perawatan": Droplet,
  "Aksesoris": Sparkles,
};

export default function CategoryIcon({ name, size = 20, className = "" }) {
  const Icon = ICONS[name] ?? Wrench;
  return <Icon size={size} className={className} aria-hidden="true" />;
}
