/**
 * `lingo-live-message-actions`
 * Surfaces actions to take against a message
 *
 *
 * @customElement
 * @polymer
 * @demo demo/actions.html
 */
 class LingoLiveMessageActions extends
  Polymer.GestureEventListeners(Polymer.Element) {
  /**
   * Name the dom-module ID that should be
   * targeted for the element template
   */
  static get is() { return 'lingo-live-message-actions'; }
  /**
   * Declare the properties that will be
   * available in the binding system
   */
  static get properties() {
    return {
      /** The message in question */
      message: {
        type: Object,
        notify: true,
      },
    };
  }
  /**
   * @event lingo-live-new-message
   *
   * Publish a message from the contents of this message
   */
  /**
   * Repost a message
   */
  _repostMessage() {
    let message = Object.assign({}, this.message);
    message.likes = 0;
    message.replies = 0;
    message.reposts = 0;
    if (message.reply_to) {
      delete message.reply_to;
    }
    delete message.ts;
    delete message.user;
    delete message.id;
    let event = new CustomEvent(
      'lingo-live-new-message',
      {
        detail: {
          message: message,
        },
        bubbles: true,
        composed: true,
      }
    );
    this.dispatchEvent(event);
    let reposts = this.message.reposts + 1;
    this.set('message.reposts', reposts);
  }
  /**
   * @event lingo-live-new-message-reply-to-target
   *
   * Announce that the UI should prepare to reply to a message
   */
  /**
   * Reply to a message
   */
  _replyToMessage() {
    let event = new CustomEvent(
      'lingo-live-new-message-reply-to-target',
      {
        detail: {
          reply_to: this.message.id,
        },
        bubbles: true,
        composed: true,
      }
    );
    this.dispatchEvent(event);
    let replies = this.message.replies + 1;
    this.set('message.replies', replies);
  }
  /**
   * Like a message
   */
  _likeMessage() {
    let likes = this.message.likes + 1;
    this.set('message.likes', likes);
  }
}

window.customElements.define(
  LingoLiveMessageActions.is,
  LingoLiveMessageActions
);
