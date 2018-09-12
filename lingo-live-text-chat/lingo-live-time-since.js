/**
 * `lingo-live-time-since`
 * Display and manage the time since a specified event
 *
 *
 * @customElement
 * @polymer
 * @demo demo/time-since.html
 */
class LingoLiveTimeSince extends Polymer.Element {
  /**
   * Name the dom-module ID that should be
   * targeted for the element template
   */
  static get is() { return 'lingo-live-time-since'; }
  /**
   * Declare the properties that will be
   * available in the binding system
   */
  static get properties() {
    return {
      /** Epoc of the event to be tracked */
      timestamp: {
        type: Number,
        observer: '_computeDatetime',
      },
      /** Readable string of the time since the event */
      datetime: {
        type: String,
      },
    };
  }
  /**
   * Begin to track time once the element has been attached to the dom
   */
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * Process the readable time string.
   * @param {Number} timestamp - epoc of event to be tracked
   */
  _computeDatetime(timestamp) {
    let date = new Date(timestamp);
    this.datetime = date.toISOString();
  }
}

window.customElements.define(
  LingoLiveTimeSince.is,
  LingoLiveTimeSince
);
