/**
 * `lingo-live-message-content`
 * Processes the message content to the UI
 *
 *
 * @customElement
 * @polymer
 * @demo demo/message-content.html
 */
 class LingoLiveMessageContent extends Polymer.Element {
  /**
   * Name the dom-module ID that should be
   * targeted for the element template
   */
  static get is() { return 'lingo-live-message-content'; }
  /**
   * Declare the properties that will be
   * available in the binding system
   */
  static get properties() {
    return {};
  }
}

window.customElements.define(
  LingoLiveMessageContent.is,
  LingoLiveMessageContent
);
