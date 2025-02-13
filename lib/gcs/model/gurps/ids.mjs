const containerKeyPostfix = '_container'

const AllID = 'all'
const BasicMoveID = 'basic_move'
const BasicSpeedID = 'basic_speed'
const BlockID = 'block'
const DexterityID = 'dx'
const DodgeID = 'dodge'
const LiftingStrengthID = 'lifting_st'
const MoveID = 'move'
const ParryID = 'parry'
const RitualMagicSpellID = 'ritual_magic_spell'
const SizeModifierID = 'sm'
const SkillID = 'skill'
const SpellID = 'spell'
const StrengthID = 'st'
const StrikingStrengthID = 'striking_st'
const TechniqueID = 'technique'
const ThrowingStrengthID = 'throwing_st'
const TorsoID = 'torso'

function SanitizeID(id, permitLeadingDigits, ...reserved) {
  let buffer = ''
  for (let ch of id) {
    if (ch >= 'A' && ch <= 'Z') {
      ch = String.fromCharCode(ch.charCodeAt(0) + ('a'.charCodeAt(0) - 'A'.charCodeAt(0)))
    }
    if (
      ch === '_' ||
      (ch >= 'a' && ch <= 'z') ||
      (ch >= '0' && ch <= '9' && (permitLeadingDigits || buffer.length > 0))
    ) {
      buffer += ch
    }
  }
  if (buffer.length === 0) {
    buffer = '_'
  }
  while (true) {
    let ok = true
    id = buffer
    for (let one of reserved) {
      if (one === id) {
        buffer += '_'
        ok = false
        break
      }
    }
    if (ok) {
      return id
    }
  }
}

export {
  AllID,
  BasicMoveID,
  BasicSpeedID,
  BlockID,
  DexterityID,
  DodgeID,
  LiftingStrengthID,
  MoveID,
  ParryID,
  RitualMagicSpellID,
  SizeModifierID,
  SkillID,
  SpellID,
  StrengthID,
  StrikingStrengthID,
  TechniqueID,
  ThrowingStrengthID,
  TorsoID,
  containerKeyPostfix,
  SanitizeID,
}
