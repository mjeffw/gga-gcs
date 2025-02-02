class ActorSettings extends ApplicationV2 {
  constructor(options = {}) {
    super(options)
  }

  static DEFAULT_OPTIONS = {
    tag: 'div',
    classes: ['gga-gcs', 'actor', 'settings'],
    position: {
      width: 600,
      height: 600,
    },
  }
}
