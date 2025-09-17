import {
  CapeEquipment,
  DofusEquipment,
  EquipmentCategory,
  HeadEquipment,
  PetEquipment,
  WeaponEquipment,
} from "@/enums/equipment.ts";

export type Equipment = {
  [EquipmentCategory.Weapon]: WeaponEquipment;
  [EquipmentCategory.Pet]: PetEquipment;
  [EquipmentCategory.Cape]: CapeEquipment;
  [EquipmentCategory.Head]: HeadEquipment;
  [EquipmentCategory.Dofus]: DofusEquipment;
};
