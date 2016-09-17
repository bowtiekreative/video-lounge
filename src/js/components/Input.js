import React from 'react';
import '../../assets/_chat-input.scss';

class ChatInput extends React.Component {

  constructor() {
    super();
    this.state = {
      messageText: '',
      isTyping: false,
      user: null,
    };
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.blockEnterKey = this.blockEnterKey.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.resetTextarea = this.resetTextarea.bind(this);
    this.broadcastChat = this.broadcastChat.bind(this);
    this.handleSendChat = this.handleSendChat.bind(this);
  }

  componentWillMount() {
    // eslint-disable-next-line
    Bebo.User.getUser('me', (err, data) => {
      this.setState({ user: data });
    });
  }

  componentDidMount() {
    document.addEventListener('keydown', this.blockEnterKey, false);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.blurChat === this.props.blurChat){ return }
    if (nextProps.blurChat) {
      this.refs.textarea.blur();
    } else if (!nextProps.blurChat) {
      this.refs.textarea.focus();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.blockEnterKey);
  }

  blockEnterKey(e) {
    if (e.keyCode === 13 && this.state.messageText && this.state.messageText.length) {
      this.handleSendChat(e);
    } else if(e.keyCode === 13) {
      this.refs.textarea.blur();
    }
  }

  handleInputChange(e) {
    this.setState({ messageText: e.target.value });
  }

  handleSendChat(e) {
    //this.refs.textarea.focus();
    if(e){
      e.preventDefault();
    }
    const text = this.state.messageText.trim();
    if (text.length > 0) {
      const message = {
        username: this.state.user.username,
        userImg: this.state.user.image_url,
        message: text,
        timestamp: Date.now()
      };

      // TODO mention stuff in users[]
      // eslint-disable-next-line
      this.broadcastChat(message);
      this.resetTextarea();
    } else {
      console.warn('no message, returning');
    }
  }
  resetTextarea() {
    this.setState({ messageText: '' });
  }
  broadcastChat(m) {
    // eslint-disable-next-line
    Bebo.emitEvent({ type: 'chat_sent', message: m });
    // TODO check if any user is in str
  }

  handleInputFocus() {
    this.setState({isFocussed: true});
    this.props.setChatInputState(true);
  }

  handleInputBlur() {
    this.setState({isFocussed: false});
    this.props.setChatInputState(false);
  }

  calculateSendBtnStyle() {
    if(this.state.messageText.length) {
      return {transform: 'translateX(0)'}
    }
    return {}
  }

  renderActions() {
    return (<div className="chat-input--actions">
      <button className="chat-input--actions--item caller-btn" onClick={this.props.callInHangUp}>

      </button>
    </div>);
  }

  render() {
    return (<div className="chat-input" style={this.state.mode === 'gif' ? { transform: 'translate3d(0,-100vh, 0' } : {}}>
      <div className="chat-input--left">
        {this.renderActions()}
      </div>
      <div className="chat-input--middle">
        <input
          type="text"
          onFocus={this.handleInputFocus}
          onBlur={this.handleInputBlur}
          ref="textarea"
          placeholder="type a message.."
          onChange={this.handleInputChange}
          value={this.state.messageText}
        />
        <div onTouchStart={this.handleSendChat} className="send-button" style={this.calculateSendBtnStyle()}>
          <span>Send</span>
        </div>
      </div>
    </div>);
  }
}

ChatInput.displayName = 'ChatInput';

// Uncomment properties you need
ChatInput.propTypes = {
  setChatInputState: React.PropTypes.func.isRequired
};
// ChatInput.defaultProps = {};

export default ChatInput;