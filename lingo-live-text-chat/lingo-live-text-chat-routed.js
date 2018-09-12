/**
 * `lingo-live-text-chat-routed`
 * Manages the text chat interface of a Lingo Live Interactive Classroom
 * with room routing URL management.
 *
 * @customElement
 * @polymer
 * @demo demo/routed.html
 * @appliesMixin lingoLiveRoomRoutingMixin
 * @appliesMixin LingoLiveTextChat
 */
class LingoLiveTextChatRouted extends
  lingoLiveRoomRoutingMixin(LingoLiveTextChat) {
  /**
   * Declare the properties that will be
   * available in the binding system
   */
  static get properties() {
    return {
      basePath: {
        type: String,
        value: '/text',
      },
    };
  }
}

customElements.define(
  LingoLiveTextChatRouted.is,
  LingoLiveTextChatRouted
);
