/**
 * `lingo-live-write-message`
 * UI for writing a text chat message
 *
 *
 * @customElement
 * @polymer
 * @demo demo/writing.html
 */
 class LingoLiveWriteMessage extends
  Polymer.GestureEventListeners(Polymer.Element) {
  /**
   * Name the dom-module ID that should be
   * targeted for the element template
   */
  static get is() { return 'lingo-live-write-message'; }
  /**
   * Declare the properties that will be
   * available in the binding system
   */
  static get properties() {
    return {
      /** Text of the message to be submitted */
      message: {
        type: String,
        value: '',
      },
    };
  }
  /**
   * Bind events to the element
   */
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this._keyEventHandler.bind(this));
    this.addEventListener('keyup', this._keyEventHandler.bind(this));
  }
  /**
   * Remove events to the element
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._keyEventHandler.bind(this));
    this.removeEventListener('keyup', this._keyEventHandler.bind(this));
  }
  /**
   * Handle keydown events
   * @param {object} e - event object
   */
   _keyEventHandler(e) {
     e.stopPropagation();
     if (e.type === 'keydown') {
       switch (e.keyCode) {
         case /* ENTER */ 13:
           if (e.shiftKey) break;
           e.preventDefault();
           if (this.message) {
             this._submitMessage();
           }
           break;
       }
     }
   }
  /**
   * Prepare to submit a message when text for one is present
   */
  _shouldSubmitMessage() {
    if (this.message) this.__shouldSubmitMessage = true;
  }
  /**
   * Test if a message should be submitted
   */
  _testSubmitMessage() {
    if (this.__shouldSubmitMessage) this._submitMessage();
    this.__shouldSubmitMessage = false;
  }
  /**
   * @event lingo-live-new-message
   *
   * Publish a new chat message
   */
  /**
   * Submit a chat message
   */
  _submitMessage() {
    if (!this._isAction(this.message)) {
      let message = {
        message: this.message,
      };
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
    }
    this.message = '';
  }
  /**
   * Whether the message patter outlines it as an action
   * i.e. `/open https:\/\/docs.google.com.*`
   * @param {string} message - current message to test
   *
   * @return {boolean}
   */
  _isAction(message) {
    let regex = /^\/(\S*) *(.*|https:\/\/docs.google.com.*)$/;
    let match = message.match(regex);
    if (!match) return false;
    let destination = match[2];
    if (!destination.match(/^(https:\/\/|http:\/\/)/)) {
      destination = 'https://' + destination;
    }
    destination = destination.replace('http://', 'https://');
    if (
      (
        match[1] !== 'open-test' &&
        match[1] !== 'lingolive' &&
        match[1] !== 'report'
      ) &&
      !destination.match(/https:\/\/docs.google.com.*/)
    ) {
      return false;
    }
    if (match[1] === 'lingolive') {
      switch (match[2]) {
        case 'calendar':
        case 'faq':
        case 'progress':
        case 'schedule':
          destination = `/${match[2]}`;
          break;
        default:
          destination = '/schedule';
          break;
      }
    }
    let event;
    if (match[1] === 'report') {
      event = new CustomEvent(
        'lingo-live-report',
        {
          detail: {
            roomType: '',
          },
          bubbles: true,
          composed: true,
        }
      );
    } else {
      event = new CustomEvent(
        'lingo-live-link-click',
        {
          detail: {
            destination: destination,
            originalDestination: destination,
          },
          bubbles: true,
          composed: true,
        }
      );
    }
    this.dispatchEvent(event);
    return true;
  }
  /**
   * Focus the input element
   */
  focus() {
    this.$.input._focusableElement.focus();
  }
}

window.customElements.define(
  LingoLiveWriteMessage.is,
  LingoLiveWriteMessage
);
