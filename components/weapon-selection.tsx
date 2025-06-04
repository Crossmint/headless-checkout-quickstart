import type { WeaponSelectionProps, Weapon } from "../types/weapon";
import { WeaponCard } from "./weapon-card";

const WEAPONS: Weapon[] = [
  {
    id: "gods-sword",
    name: "God's sword",
    price: "$0.53",
    icon: "/sword.svg",
  },
  {
    id: "elves-axe-silver",
    name: "Elves axe - Silver",
    price: "$0.53",
    icon: "/axe.svg",
  },
  {
    id: "magic-potion",
    name: "Magic potion",
    price: "$0.53",
    icon: "/elixir.svg",
  },
];

export const WeaponSelection: React.FC<WeaponSelectionProps> = ({
  selectedWeaponId,
  onWeaponSelect,
}) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-8 max-w-md mx-auto">
      {WEAPONS.map((weapon) => (
        <WeaponCard
          key={weapon.id}
          weapon={weapon}
          isSelected={selectedWeaponId === weapon.id}
          onClick={() => onWeaponSelect(weapon.id)}
        />
      ))}
    </div>
  );
};
