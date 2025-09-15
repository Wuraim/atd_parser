import {
  CapeEquipment,
  DofusEquipment,
  HeadEquipment,
  PetEquipment,
  WeaponEquipment,
} from "@/enums/equipment.ts";

export type Equipment = WeaponEquipment &
  PetEquipment &
  CapeEquipment &
  HeadEquipment &
  DofusEquipment;
