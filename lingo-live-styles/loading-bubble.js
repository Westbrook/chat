import {render, html, svg} from '../../node_modules/lit-html/lit-html.js';
(function() {
let instanceCounter = 0;

/**
 * `loading-bubble`
 * Displays the Lingo Live loading/waiting animation
 *
 *
 * @customElement
 * @demo demo/loading.html
 */
class LoadingBubble extends HTMLElement {
  /**
   * Init local properties.
   */
  constructor() {
    super();
    this.cycle = 30;
    this.pause = 8;
    this.durration = this.cycle - this.pause;
    this.combined = 140;
    this.max = 118;
    this.min = 22;
    this.active = false;
    this._connected = false;
    this.instanceCounter = instanceCounter++;
    this.instanceCounter = this.instanceCounter.toString();
  }

  /**
   * List attribute changes to listen to
   */
  static get observedAttributes() { return ['active']; }

  /**
   * Manage attribute changes
   * @param {string} name - the attribute in question
   * @param {string} oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'active') {
      this.active = (newValue === '');
      if (this.active && this._connected) {
        this.start();
      }
    }
  }

  /**
   * The default path data
   */
  get initialPathData() {
    return [
      {left: -57, top: 27.52, color: '#48bddd'},
      {left: 83, top: 27.52, color: '#da332a'},
      {left: -47, top: 49.9, color: '#fae11b'},
      {left: 93, top: 49.9, color: '#0a0b09'},
      {left: -105, top: 72.29, color: '#0a0b09'},
      {left: 35, top: 72.29, color: '#40b28a'},
    ];
  }

  /**
   * Cache connected state and start animation
   */
  connectedCallback() {
    this._connected = true;
    this.start();
  }

  /**
   * Cache connected state
   */
  disconnectedCallback() {
    this._connected = false;
  }

  /**
   * Start from 0
   */
  start() {
    if (this.started) return;
    this.started = true;
    this.pathData = this.initialPathData;
    requestAnimationFrame((_)=> {
      this.writeTemplate();
      this.tick();
    });
  }

  /**
   * Prepare data for the next animation
   */
  prepareNextTween() {
    let randomMax = this.max - this.min;
    [0, 2, 4].forEach((i) => {
      let target = Math.floor(Math.random() * Math.floor(randomMax));
      target += this.min;
      this.pathData[i].left = target * -1;
      this.pathData[i+1].left = this.combined - target;
    });
  }

  /**
   * Push data into the template
   */
  writeTemplate() {
    render(this.template({
      pathData: this.pathData,
      durration: this.durration,
      instanceCounter: this.instanceCounter,
    }), this);
  }

  /**
   * Animation frame processing
   */
  tick() {
    if (this._connected && this.active) {
      this.doTick();
      requestAnimationFrame((_) => {
        this.tick();
      });
    } else {
      this.started = false;
    }
  }

  /**
   * Animation frame actions
   */
  doTick() {
    this._steps = this._steps || this.pause;
    this._steps--;
    if (this._steps <= 0) {
      this.prepareNextTween();
      this.writeTemplate();
      this._steps = this.cycle;
    }
  }

  /**
   * Base path description template
   * @param {number} top - the top value of the path
   *
   * @return {string}
   */
  pathD(top) {
    return `M65.6,${top}H4.88a5,5,0,0,1,0-10H123a5,5,0,0,1,0,10Z`;
  }

  /**
   * Break down the base elements path for line lengths.
   *
   * @return {string}
   */
  basePathD() {
    return 'M65.58,110.43c-5.77,0-11.47-9.12-15.61-15.75' +
      'H5a5,5,0,0,1,0-10H55.71l1.35,2.53' +
      'c2.71,5.14,6.47,10.41,8.48,12,1.94-1.64,5.5-6.86,8-11.92' +
      'l1.32-2.63h48.24a5,5,0,0,1,0,10H80.76' +
      'c-3.94,6.63-9.41,15.75-15.11,15.75Z';
  }

  /**
   * Full tempalte
   *
   * @return {template}
   */
  template({pathData, durration, instanceCounter}) {
    return html`
        <style>
          ${'#loading-bubble-' + instanceCounter} {
            width: 100%;
            height: 100%;
          }
          ${'#loading-bubble-' + instanceCounter} path {
            will-change: transform;
            transition: ease-in-out ${(durration / 60) + 's'};
          }
        </style>
        <svg
          id="loading-bubble-${instanceCounter}"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 128 128"
        >
          <defs>
            ${pathData.map((path, i) => {
              return svg`
                  <clipPath id="clip-${i + 1}-${instanceCounter}">
                    <path
                      transform="translate(${path.left.toString()})"
                      d="${this.pathD(path.top)}"
                      ></path>
                  </clipPath>
              `;
            })}
          </defs>
          ${pathData.map((path, i) => {
            return svg`
                <path
                  d="${this.pathD(path.top)}"
                  fill="${path.color}"
                  clip-path="url(#clip-${i + 1}-${instanceCounter})"
                />
            `;
          })}
          <path
            fill="#48bddd"
            d="${this.basePathD()}"
          />
        </svg>
    `;
  }
};

customElements.define(
  'loading-bubble',
  LoadingBubble
);
})();
