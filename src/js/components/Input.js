import React from 'react';
import {withBebo} from 'bebo-react';

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
    this.props.bebo.User.getUser('me', (err, data) => {
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
    this.props.bebo.emitEvent({ type: 'chat_sent', message: m });
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
      return {transform: 'translateX(15px)'}
    }
    return {}
  }

  calculateCallBtnStyle() {
    if(this.state.messageText.length) {
      return {transform: 'translateX(150px)'}
    }
    return {}
  }

  renderActions() {
    return (<div className="controls-action" style={this.calculateCallBtnStyle()}>
      <button className='mute-btn'></button>
      <button className={`chat-input--actions--item call-btn ${this.props.calledIn ? 'hangup' : '' }` } onClick={this.props.callInHangUp}>
      </button>
    </div>);
  }

  render() {
    return (<div className="controls">

      <div className="controls-chat">
        <input
          type="text"
          onFocus={this.handleInputFocus}
          onBlur={this.handleInputBlur}
          ref="textarea"
          placeholder="type a message..."
          onChange={this.handleInputChange}
          value={this.state.messageText}
        />
        <div onTouchStart={this.handleSendChat} className="send-btn" style={this.calculateSendBtnStyle()}>
          Send
        </div>
      </div>
      {this.renderActions()}
    </div>);
  }
}

ChatInput.displayName = 'ChatInput';

// Uncomment properties you need
ChatInput.propTypes = {
  setChatInputState: React.PropTypes.func.isRequired
};
// ChatInput.defaultProps = {};

export default withBebo(ChatInput);
