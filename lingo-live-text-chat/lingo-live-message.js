/**
 * `lingo-live-message`
 * Displays a text chat message
 *
 *
 * @customElement
 * @polymer
 * @demo demo/message.html
 */
class LingoLiveMessage extends Polymer.Element {
  /**
   * Name the dom-module ID that should be
   * targeted for the element template
   */
  static get is() { return 'lingo-live-message'; }
  /**
   * Declare the properties that will be
   * available in the binding system
   */
  static get properties() {
    return {
      /** The message to display */
      message: {
        type: Object,
        value: () => {},
      },
      /** The local user object */
      user: {
        type: Object,
        value: () => {},
      },
      /** Whether the message is by the local user */
      self: {
        type: Boolean,
        reflectToAttribute: true,
      },
      /** Whether to display the avatar for this message */
      avatar: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
      /** Whether the message is from the same day as the one before it */
      sameDay: {
        type: Boolean,
        value: false,
      },
    };
  }
  /**
   * Compelex observers
   */
  static get observers() {
    return [
      '_applyAvatarColor(user.color)',
    ];
  }
  /**
   * When available apply the avatar background color CSS variable
   * @param {string} color - the hex value
   */
  _applyAvatarColor(color) {
    this.updateStyles({
      '--lingo-live-avatar-background-color': color,
    });
  }
  /**
   * Handle clicks on links in messages
   * @param {object} e - the event object
   */
  _handleClick(e) {
    let destination;
    if (typeof e.path !== 'undefined') {
      destination = e.path.find((el) => el.href);
    } else {
      destination = e.target;
    }
    if (destination) {
      e.preventDefault();
      let event = new CustomEvent(
        'lingo-live-link-click',
        {
          detail: {
            destination: destination.href,
          },
          bubbles: true,
          composed: true,
        }
      );
      this.dispatchEvent(event);
    }
  }
  /**
   * Whether to hide the avatar
   * @param {boolean} self - whether the message is by the current user
   * @param {boolean} avatar - whether the parent component expects an avatar
   *
   * @return {boolean}
   */
  _hideAvatar(self, avatar) {
    return self || !avatar;
  }
  /**
   * The user that gets displayed.
   *
   * @return {object}
   */
  _displayUser() {
    if (this.user) return this.user;
    return {
      firstName: this.message.user,
      lastName: '',
    };
  }
  /**
   * Switch timestamp to ISO string
   * @param {number} ts
   *
   * @return {string}
   */
  _datetime(ts) {
    let date = new Date(ts);
    return date.toISOString();
  }
}

window.customElements.define(LingoLiveMessage.is, LingoLiveMessage);
