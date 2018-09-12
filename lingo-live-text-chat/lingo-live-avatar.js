/**
 * `lingo-live-avatar`
 * Display an avatar of initials for a user
 *
 *
 * @customElement
 * @polymer
 * @demo demo/avatar.html
 */
 class LingoLiveAvatar extends Polymer.Element {
  /**
   * Name the dom-module ID that should be
   * targeted for the element template
   */
  static get is() { return 'lingo-live-avatar'; }
  /**
   * Declare the properties that will be
   * available in the binding system
   */
  static get properties() {
    return {
      /** The user to be displayed */
      user: {
        type: Object,
        observer: '_userChanged',
      },
      title: {
        type: String,
        value: '',
        reflectToAttribute: true,
      },
    };
  }
  /**
   * Take the first and last initials of the supplied user name
   * @param {string} user
   *
   * @return {string}
   */
  _initials(user) {
    let firstName = user.firstName || '';
    let lastName = user.lastName || '';
    firstName = firstName.trim();
    lastName = lastName.trim();
    let firstInitial = firstName[0] || '';
    let lastInitial = lastName[0] || '';
    return `${firstInitial}${lastInitial}`;
  }
  /**
   * Ensure the elements title attribute to set to the user name.
   * @param {object} user - the user is question
   */
  _userChanged(user) {
    let firstName = user.firstName;
    let lastName = user.lastName;
    this.title = `${firstName || ''}${lastName ? ' ' + lastName : ''}`;
  }
}

window.customElements.define(LingoLiveAvatar.is, LingoLiveAvatar);
