/* eslint no-unused-vars:
[2, { "args": "none", "varsIgnorePattern": "LingoLiveTextChat" }]*/

const resizeBehaviorClass =
  Polymer.mixinBehaviors([Polymer.IronResizableBehavior], Polymer.Element);

/**
 * `lingo-live-text-chat`
 * Manages the text chat interface of a Lingo Lvie Interactive Classroom
 *
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class LingoLiveTextChat extends resizeBehaviorClass {
  /**
   * Name the dom-module ID that should be
   * targeted for the element template
   */
  static get is() { return 'lingo-live-text-chat'; }
  /**
   * Declare the properties that will be
   * available in the binding system
   */
  static get properties() {
    return {
      apiKey: {
        type: String,
        value: 'AIzaSyBJhRBcpE--XW1csRxYareKXNkT1iLZg24',
      },
      /** Object defining the current user */
      currentUserData: {
        type: Object,
        value: () => ({}),
      },
      /** User name of the current user */
      identity: {
        type: String,
        notify: true,
      },
      roomType: {
        type: String,
      },
      /** Messages in the chat room */
      messages: {
        type: Array,
        value: () => [],
      },
      /** Users in the chat room */
      roomUsers: {
        type: Array,
        notify: true,
      },
      /** Users data array */
      users: {
        type: Array,
        value: () => [],
        notify: true,
      },
      /** User data object */
      user: {
        type: Object,
        value: () => ({}),
        notify: true,
      },
      /** Name of the current chat room */
      roomName: {
        type: String,
        value: 'no-room',
        notify: true,
      },
      /** Whether the avatars should be displayed */
      avatar: {
        type: Boolean,
        value: false,
      },
      /** Whether links should be opened inline */
      inlineLinks: {
        type: Boolean,
        value: false,
      },
      tokenFirebase: {
        type: String,
        value: '',
        observer: '_tokenFirebaseChanged',
      },
      showSelf: {
        type: Boolean,
        value: false,
      },
    };
  }
  /**
   * Complex observers
   */
  static get observers() {
    return [
      '_messagesChanged(messages, messages.*)',
      '_roomUsersChanged(roomUsers, roomUsers.*)',
    ];
  }
  constructor() {
    super();
    let url = this.resolveUrl(
      'firestore-worker.js',
      this.importPath
    );
    let storedMessages = JSON.parse(localStorage.getItem('openRooms/westbrook/events'));
    if (storedMessages) {
      this.messages = storedMessages;
    }
    this.worker = new Worker(url);
    this.worker.addEventListener('message', event => {
      switch (event.data.cmd) {
        case 'messages':
          this.messages = event.data.messages;
          localStorage.setItem(
            'openRooms/westbrook/events',
            JSON.stringify(this.messages)
          )
          break;
        case 'users':
          this.roomUsers = event.data.users;
          break;
      }
    });
    this.worker.postMessage({ cmd: 'initializeApp' });
  }
  /**
   * Ensure that required properties (identity and roomName)
   * are set at runtime.
   */
  ready() {
    super.ready();
    this.addEventListener('iron-resize', (_) => this._measure());
  }
  /**
   * Manage changed to `tokenFirebase`
   */
  _tokenFirebaseChanged() {
    if (this.tokenFirebase) {
      this._authenticate();
    }
  }
  /**
   * Use the local room user data to request the complete user data objects
   * @param {array} roomUsers - array of {id: `1234`} pointers of room users
   */
  _roomUsersChanged(roomUsers) {
    if (!roomUsers) return;
    let users = [];
    let colorOffset = Math.floor(Math.random() * (this.colors.length - 1));
    let usersRef;// = this.db.collection('users');
    if (!usersRef) return;
    roomUsers.forEach((roomUser) => {
      if (roomUser.id) {
        users.push(usersRef.doc(roomUser.id).get());
      }
    });
    if (!users.length) return;
    Promise.all(users).then((values) => {
      this.users = values.map((val, i) => {
        let user = val.data();
        let offsetForColor = i + colorOffset;
        user.color = this.colors[offsetForColor % this.colors.length];
        return user;
      });
    });
  }
  /**
   * When `lingo-live-report` events come through append the roomType
   * @param {object} e - the event object
   */
  _addRoomType(e) {
    e.detail.roomType = this.roomType;
  }
  /**
   * Push a new message to the remote server
   * @param {object} e - the event object
   */
  _prepNewMessage(e) {
    this.__newMessageQueue = this.__newMessageQueue || [];
    let message = e.detail.message;
    message.user = (this.user && this.user.uid) || this.identity;
    message.ts = Date.now();
    message.room = this.roomName;
    message.type = 'message';
    this._setNewMessage(message);
  }
  /**
   * Set a message onto a document in the message reference.
   * @param {object} message - the message object
   */
  _setNewMessage(message) {
    this.worker.postMessage({
      cmd: 'postMessage',
      message
    });
  }
  /**
   * Query the users array for the user matching the supplied username
   * @param {string} userName - the requested user
   *
   * @return {object}
   */
  _getUser(userName) {
    if (!this.users) return {};
    return this.users.find((user) => {
      return user.id === userName;
    });
  }
  /**
   * Whether the user is question is the current local user
   * @param {string} postUser - the user in question
   * @param {string} currentUser - the current local user
   * @param {boolean} showSelf - whether to show self
   *
   * @return {boolean}
   */
  _isCurrentUser(postUser, currentUser, showSelf) {
    if (showSelf) return false;
    let testUser = (currentUser && currentUser.id) || this.identity;
    return postUser === testUser;
  }
  /**
   * When new messages are spliced into the array confirm whether a
   * notification event should be published regarding it. In all changes,
   * focus the last message in the array.
   * @param {array} messages - the current messages
   * @param {object} changes - the changes last made to the messages array
   */
  _messagesChanged(messages, changes) {
    if (changes.path === 'messages.splices') {
      this._notifyMessage(messages[messages.length - 1]);
    }
    this._focusLast();
  }
  /**
   * Focus the messages list on the most recent message
   */
  _focusLast() {
    if (!this.messages) return;
    this.$.messagesList.scrollToIndex(this.messages.length - 1);
  }
  /**
   * Whether the browser supports `new Notification`. When you call it on
   * an Android browser you end up with a weird error. Here we're catching it
   * and not trying to send notifications anymore.
   *
   * @return {boolean}
   */
  _isNewNotificationSupported() {
    if (typeof this.__isNewNotificationSupported === 'undefined') {
      if (!window.Notification || !Notification.requestPermission) {
        this.__isNewNotificationSupported = false;
      }
      if (Notification.permission == 'granted') {
        throw new Error(`You must only call this *before* calling
          Notification.requestPermission(),otherwise this feature detect would
          bug the user with an actual notification!`);
      }
      try {
        new Notification('');
      } catch (e) {
        if (e.name == 'TypeError') {
          this.__isNewNotificationSupported = false;
        }
      }
      this.__isNewNotificationSupported = true;
    }
    return this.__isNewNotificationSupported;
  }
  /**
   * @event lingo-live-message-notification
   *
   * Announce that a new remote message has been added
   */
  /**
   * Publish an event when new messages are posted be remove
   * users to the chat
   * @param {object} message - the message object
   */
  _notifyMessage(message) {
    if (this._isCurrentUser(message.user, this.identity)) return;
    let canBrowserNotify;
    if (this._skipNotificationsForTesting) {
      canBrowserNotify = false;
    } else if (window.Notification && Notification.permission === 'granted') {
      canBrowserNotify = true;
    } else {
      canBrowserNotify =
        Notification.permission === 'denied' ?
          false :
          this._isNewNotificationSupported();
    }

    canBrowserNotify = canBrowserNotify &&
      Notification.permission === 'granted';

    if (
      canBrowserNotify &&
      (
        document.hidden ||
        document.msHidden ||
        document.webkitHidden ||
        !document.hasFocus()
      )
    ) {
      let userName = message.user;
      if (this.users) {
        let user = this.users.find((user) => user.id === userName);
        if (user) {
          userName = user.firstName;
        }
      }
      let notification = new Notification(
        `${userName} says...`,
        {
          body: message.message,
          icon: 'https://assets.lingolive.com/assets/manifest/icon-144x144.png',
        }
      );
      notification.onclick = function() {
        window.focus();
        this.close();
      };
    } else {
        let event = new CustomEvent(
          'lingo-live-message-notification',
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
  }
  /**
   * Pass the resize event into the messages list and then focus the last
   * message in the list
   */
  notifyResize() {
    this.$.messagesList.notifyResize();
    this._focusLast();
  }
  /**
   * Check to see if the avatars should be displayed
   */
  _measure() {
    let width = this.offsetWidth;
    this.avatar = width > 250;
  }
  /**
   * Catch and open URLs when inlineLinks is false
   * @param {object} e - event oject
   */
  _linkAction(e) {
    let destination = e.detail.destination;
    destination = destination.replace('http://', 'https://');
    let originalDestination = destination;
    let tedLink;
    let vimeoLink;
    let youtubeLink;
    let eventDetail;
    if (!this.inlineLinks) {
      e.stopPropagation();
      window.open(destination, '_blank');
    } else if (
      destination.match(/ww3.nhk.or.jp/) ||
      destination.match(/www.npr.org/)
    ) {
      e.stopPropagation();
      eventDetail = {
        destination: destination,
        originalDestination: originalDestination,
        type: 'URL',
      };
    } else if (tedLink = destination.match(/https:\/\/(\S*).ted.com\/talks/)) {
      e.stopPropagation();
      destination = destination.replace(tedLink[1], 'embed');
      eventDetail = {
        destination: destination,
        originalDestination: originalDestination,
        type: 'Video',
      };
    } else if (vimeoLink = destination.match(/https:\/\/vimeo.com\/(\d*)/)) {
      e.stopPropagation();
      destination = 'https://player.vimeo.com/video/' + vimeoLink[1];
      eventDetail = {
        destination: destination,
        originalDestination: originalDestination,
        type: 'Video',
      };
    } else if (youtubeLink = this._isYouTubeUrl(destination)) {
      e.stopPropagation();
      destination =
        `https://www.youtube.com/embed/${youtubeLink[1]}?enablejsapi=1`;
      eventDetail = {
        destination: destination,
        originalDestination: originalDestination,
        type: 'Video',
      };
    } else if (
      !/https:\/\/docs.google.com.*/.test(destination) &&
      !/https:\/\/web.kamihq.com\/web\/viewer.html.*/.test(destination)
    ) {
      e.stopPropagation();
      window.open(destination, '_blank');
    }
    if (eventDetail) {
      let event = new CustomEvent(
        'lingo-live-link-click',
        {
          detail: eventDetail,
          bubbles: true,
          composed: true,
        }
      );
      this.dispatchEvent(event);
    }
  }
  /**
   * Whether the URL in question points to a YouTube Video
   * @param {string} url - the url to test
   *
   * @return {object}
   */
  _isYouTubeUrl(url) {
    let regexes = [
      /https:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})/,
      /https:\/\/youtu\.be\/([\w-]{11})/,
      /https:\/\/www\.youtube\.com\/embed\/([\w-]{11})/,
    ];
    let regex = regexes.find((re) => {
      return url.match(re) !== null;
    });
    return regex ? url.match(regex) : false;
  }
  /**
   * Authenticate the tokened user against the Firebase application
   */
  _authenticate() {
    if (!this._appInitialized) return;
    requestAnimationFrame((_) => {
      requestAnimationFrame((_) => {
        this.$.auth.signInWithCustomToken(this.tokenFirebase)
          .then((_) => {
            this.roomType = 'rooms';
          });
      });
    });
  }
  /**
   * Handle the Firebase App being initialized
   */
  _firebaseAppInitialized() {
    this._appInitialized = true;
    if (this.tokenFirebase) {
      this._authenticate();
    }
  }
  /**
   * Whether the message is on the same day as the previous one
   * @param {number} index - the index of the current message
   *
   * @return {boolean}
   */
  _isSameDay(index) {
    if (index === 0) return false;
    let current = new Date(this.messages[index].ts);
    let previous = new Date(this.messages[index - 1].ts);
    return (current.getDate() === previous.getDate() &&
      current.getMonth() === previous.getMonth() &&
      current.getYear() === previous.getYear());
  }
  /**
   * Array of color values for customizing the avatar delivery
   */
  get colors() {
    return [
      '#fc6471',
      '#bcc1eb',
      '#c9dcb3',
      '#6d98ba',
      '#b9b9b6',
      '#f1c4b7',
      '#7d5ba6',
      '#e6b7dd',
      '#f19c79',
      '#f283b6',
      '#52b788',
      '#ebd489',
    ];
  }
}
