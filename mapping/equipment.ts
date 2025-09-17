import {
  WeaponEquipment,
  PetEquipment,
  CapeEquipment,
  HeadEquipment,
  DofusEquipment,
  EquipmentCategory,
} from "@/enums/equipment.ts";
import { invertRecord } from "@/mapping/utils.ts";

// 23 Weapon equipments
export const RECORD_WEAPON_EQUIPMENT: Record<number, WeaponEquipment> = {
  0xc: WeaponEquipment.Comete,
  0x17: WeaponEquipment.Hishantes,
  0xb: WeaponEquipment.LyodaDa,
  0x16: WeaponEquipment.Rafeuses,
  0x1: WeaponEquipment.Razielle,
  0x2: WeaponEquipment.Kwaklame,
  0x25: WeaponEquipment.ArcAnge,
  0x1c: WeaponEquipment.LaCorde,
  0x22: WeaponEquipment.ArcScieClone,
  0x1d: WeaponEquipment.ArcHidsad,
  0x15: WeaponEquipment.Fourbeuses,
  0xf: WeaponEquipment.Bashers,
  0x45: WeaponEquipment.Falistos,
  0x49: WeaponEquipment.Nitruhant,
  0x28: WeaponEquipment.Celestine,
  0x2b: WeaponEquipment.Meneuse,
  0x31: WeaponEquipment.Pataflone,
  0x41: WeaponEquipment.Cerberus,
  0x54: WeaponEquipment.LuneRouge,
  0x4f: WeaponEquipment.PelleMelle,
  0x55: WeaponEquipment.Solote,
  0x52: WeaponEquipment.FossoyeuseInfidele,
  0x46: WeaponEquipment.Kassgoul,
};

// 15 Pet equipments
export const RECORD_PET_EQUIPMENT: Record<number, PetEquipment> = {
  0xa6: PetEquipment.Abra,
  0x5c: PetEquipment.BwakDeFeu,
  0xa5: PetEquipment.Atouin,
  0x5b: PetEquipment.BwakDeTerre,
  0x5e: PetEquipment.BwakDeau,
  0x5d: PetEquipment.BwakDair,
  0xa4: PetEquipment.Corbaka,
  0xa3: PetEquipment.Kwoko,
  0x5f: PetEquipment.Moon,
  0xa2: PetEquipment.Fotome,
  0x58: PetEquipment.Chienchien,
  0x59: PetEquipment.Chacha,
  0x5a: PetEquipment.Wabbit,
  0x9f: PetEquipment.Rehokul,
  0x9e: PetEquipment.Tiduc,
};

// 15 Cape equipments
export const RECORD_CAPE_EQUIPMENT: Record<number, CapeEquipment> = {
  0x69: CapeEquipment.Abracapa,
  0x6a: CapeEquipment.CapeBouffante,
  0x9c: CapeEquipment.CapePlumelaches,
  0x60: CapeEquipment.CapeTainflam,
  0x62: CapeEquipment.CapeOrale,
  0x7f: CapeEquipment.CapeChampChamp,
  0x63: CapeEquipment.CapeDuTofuFou,
  0x82: CapeEquipment.Craquelocape,
  0x66: CapeEquipment.Dofusteuse,
  0x67: CapeEquipment.CapeDuWaWabbit,
  0x83: CapeEquipment.CapeDuPrespic,
  0x61: CapeEquipment.CapeDuCoqHu,
  0x6b: CapeEquipment.Vegacape,
  0x68: CapeEquipment.LaGuenille,
  0x81: CapeEquipment.SacDuPetitMoskito,
};

// 16 Head equipments
export const RECORD_HEAD_EQUIPMENT: Record<number, HeadEquipment> = {
  0x73: HeadEquipment.Caracoiffe,
  0x72: HeadEquipment.Clint,
  0x7e: HeadEquipment.Champcoiffe,
  0x7d: HeadEquipment.CoiffeDuBouftou,
  0x75: HeadEquipment.Cheveuleuse,
  0x71: HeadEquipment.Champo,
  0x74: HeadEquipment.Corbacoiffe,
  0x6f: HeadEquipment.Dantgoule,
  0x6e: HeadEquipment.Dora,
  0x80: HeadEquipment.Moskitogalurette,
  0x84: HeadEquipment.CoiffeDuPrespic,
  0x6c: HeadEquipment.CoiffeDuPloukosse,
  0x85: HeadEquipment.LeCasqueleur,
  0x70: HeadEquipment.Dragocoiffe,
  0x6d: HeadEquipment.Kritter,
  0x9d: HeadEquipment.CouronneDeNidhane,
};

// 6 Dofus equipments
export const RECORD_DOFUS_EQUIPMENT: Record<number, DofusEquipment> = {
  0x79: DofusEquipment.Cawotte,
  0x76: DofusEquipment.Emeraude,
  0x78: DofusEquipment.Pourpre,
  0x77: DofusEquipment.Turquoise,
  0x7a: DofusEquipment.Vulbis,
  0x7b: DofusEquipment.Glace,
};

type RecordEquipment =
  | typeof RECORD_WEAPON_EQUIPMENT
  | typeof RECORD_PET_EQUIPMENT
  | typeof RECORD_CAPE_EQUIPMENT
  | typeof RECORD_HEAD_EQUIPMENT
  | typeof RECORD_DOFUS_EQUIPMENT;

export const RECORD_CATEGORY_EQUIPMENT: Record<number, EquipmentCategory> = {
  0x0: EquipmentCategory.Weapon,
  0x1: EquipmentCategory.Pet,
  0x2: EquipmentCategory.Cape,
  0x3: EquipmentCategory.Head,
  0x4: EquipmentCategory.Dofus,
};

export const RECORD_CATEGORY_EQUIPMENT_REVERSE = invertRecord(
  RECORD_CATEGORY_EQUIPMENT
);

export const RECORD_CATEGORY_RECORD_ID: Record<
  EquipmentCategory,
  RecordEquipment
> = {
  [EquipmentCategory.Weapon]: RECORD_WEAPON_EQUIPMENT,
  [EquipmentCategory.Pet]: RECORD_PET_EQUIPMENT,
  [EquipmentCategory.Cape]: RECORD_CAPE_EQUIPMENT,
  [EquipmentCategory.Head]: RECORD_HEAD_EQUIPMENT,
  [EquipmentCategory.Dofus]: RECORD_DOFUS_EQUIPMENT,
};

export const RECORD_WEAPON_EQUIPMENT_REVERSE = invertRecord(
  RECORD_WEAPON_EQUIPMENT
);
export const RECORD_PET_EQUIPMENT_REVERSE = invertRecord(RECORD_PET_EQUIPMENT);
export const RECORD_CAPE_EQUIPMENT_REVERSE = invertRecord(
  RECORD_CAPE_EQUIPMENT
);
export const RECORD_HEAD_EQUIPMENT_REVERSE = invertRecord(
  RECORD_HEAD_EQUIPMENT
);
export const RECORD_DOFUS_EQUIPMENT_REVERSE = invertRecord(
  RECORD_DOFUS_EQUIPMENT
);
