/**
 * `lingo-live-user-readable`
 * Display the user name in the UI
 *
 *
 * @customElement
 * @polymer
 * @demo demo/user.html
 */
class LingoLiveUserReadable extends Polymer.Element {
  /**
   * Name the dom-module ID that should be
   * targeted for the element template
   */
  static get is() { return 'lingo-live-user-readable'; }
  /**
   * Declare the properties that will be
   * available in the binding system
   */
  static get properties() {
    return {
      /** The user object */
      user: {
        type: Object,
      },
    };
  }
}

window.customElements.define(
  LingoLiveUserReadable.is,
  LingoLiveUserReadable
);
