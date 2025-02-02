import GgaGcsActorBase from './base-actor.mjs'

export default class GgaGcsCharacter extends GgaGcsActorBase {
  static LOCALIZATION_PREFIXES = [...super.LOCALIZATION_PREFIXES, 'GGAGCS.Actor.Character']

  static defineSchema() {
    const fields = foundry.data.fields
    const requiredInteger = { required: true, nullable: false, integer: true }
    const schema = super.defineSchema()

    schema.attributes = new fields.SchemaField({
      level: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1 }),
      }),
    })

    // type AttributeDefData struct {
    // 	DefID               string              `json:"id"`
    // 	Type                attribute.Type      `json:"type"`
    // 	Placement           attribute.Placement `json:"placement,omitempty"`
    //   -- (automatic, primary, secondary, hidden)
    // 	Name                string              `json:"name"`
    // 	FullName            string              `json:"full_name,omitempty"`
    // 	AttributeBase       string              `json:"attribute_base,omitempty"`
    // 	CostPerPoint        fxp.Int             `json:"cost_per_point,omitempty"`
    // 	CostAdjPercentPerSM fxp.Int             `json:"cost_adj_percent_per_sm,omitempty"`
    // 	Thresholds          []*PoolThreshold    `json:"thresholds,omitempty"`
    // }

    //type PoolThresholdData struct {
    // 	State       string         `json:"state"`
    // 	Expression  string         `json:"expression"`
    // 	Explanation string         `json:"explanation,omitempty"`
    // 	Ops         []threshold.Op `json:"ops,omitempty"`
    // 	 -- (unknown, halve_move, halve_dodge, halve_st)
    // }

    const ops = new fields.ArrayField(new fields.StringField({ required: true }))

    const attributeDef = new fields.SchemaField({
      id: new fields.StringField({ required: true }),
      type: new fields.StringField({ required: true }),
      placement: new fields.StringField({ required: false }),
      name: new fields.StringField({ required: true }),
      full_name: new fields.StringField({ required: false }),
      attribute_base: new fields.StringField({ required: false }),
      cost_per_point: new fields.NumberField({ required: false }),
      cost_adj_percent_per_sm: new fields.NumberField({ required: false }),
      thresholds: new fields.ArrayField(
        new fields.SchemaField({
          state: new fields.StringField({ required: true }),
          expression: new fields.StringField({ required: true }),
          explanation: new fields.StringField({ required: false }),
          ops: ops,
        }),
      ),
    })

    schema.settings = new fields.SchemaField({
      attributes: new fields.ArrayField(attributeDef),
    })

    // Iterate over ability names and create a new SchemaField for each.
    schema.abilities = new fields.SchemaField(
      Object.keys(CONFIG.GGAGCS.abilities).reduce((obj, ability) => {
        obj[ability] = new fields.SchemaField({
          value: new fields.NumberField({
            ...requiredInteger,
            initial: 10,
            min: 0,
          }),
        })
        return obj
      }, {}),
    )

    // ====

    return schema
  }

  prepareDerivedData() {
    // Loop through ability scores, and add their modifiers to our sheet output.
    for (const key in this.abilities) {
      // Calculate the modifier using d20 rules.
      this.abilities[key].mod = Math.floor((this.abilities[key].value - 10) / 2)
      // Handle ability label localization.
      this.abilities[key].label = game.i18n.localize(CONFIG.GGAGCS.abilities[key]) ?? key
    }
  }

  getRollData() {
    const data = {}

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (this.abilities) {
      for (let [k, v] of Object.entries(this.abilities)) {
        data[k] = foundry.utils.deepClone(v)
      }
    }

    data.lvl = this.attributes.level.value

    return data
  }
}
