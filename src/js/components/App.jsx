import React from 'react';
import Input from './Input';
import {withBebo} from 'bebo-react';

class App extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.parentClick = this.parentClick.bind(this);
    this.state = {
      background: 'yellow',
      callersList: [],
      callersCount: 0,
      calledIn: false,
      hasCalledIn: false,
      blurInput: true,
      share: false,
      messages: [],
      share_text: "Join me in the Video Lounge"
    };

    this.callInHangUp = this.callInHangUp.bind(this);
    this.handleEvents = this.handleEvents.bind(this);
    this.blurInput = this.blurInput.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleEvents = this.handleEvents.bind(this);
    this.toggleShare = this.toggleShare.bind(this);

    this.props.Bebo.liveVideoOn();
  }

  componentWillMount() {
    this.handleCallerChanges();
    this.handleEvents();
  }

  blurInput() {
    this.setState({ blurInput: true });
  }

  handleEvents() {
    this.props.bebo.onEvent((data) => {
      console.log('data', data);
      this.handleMessage(data);
    });
  }

  handleMessage(m) {
    let message = m;
    const messages = this.state.messages;
    messages.push(message.message);
    this.setState({messages});
    console.log(message);
    setTimeout(() => {
      this.setState({messages: this.state.messages.filter((m)=> m.timestamp !== message.message.timestamp)
      })
    }, 6000)
  }

  handleCallerChanges() {
    let _this = this;
    this.props.bebo.onCallUpdate((data) => {
      _this.setState({callersList: data, callersCount: data ? data.length: 0});
    });
  }

  notifyer(message) {
    const prom = this.props.bebo.Notification.roster('{{{user.username}}}', message);
    prom.then(function(){
      console.log('notified - ', message);
    });
  }

  notifyServer() {
    if(this.state.callersCount >= 2 && !this.state.hasCalledIn){
      this.notifyer('is on video NOW');
    } else if(!this.state.hasCalledIn) {
      this.notifyer('is on video NOW');
    }
  }

  callInHangUp() {
    console.log('toad', this.state.calledIn);
    if(!this.state.calledIn){
      this.setState({calledIn: true, hasCalledIn: true});
      this.props.bebo.callin(true, true);
      this.notifyServer();
    } else {
      this.setState({calledIn: false});
      this.props.bebo.hangup();
    }
  }

  parentClick() {
    console.log('click');
    this.setState({background:'blue'});
  }

  toggleShare(){
    this.state.share = !this.state.share;
  }

  renderShare() {
    if(!this.state.share){
      return (
        <div className="share-container">
          <div className="share" onClick={this.toggleShare}></div>
        </div>);

    }
    return (
        <div className="share-container">
          <div className="share active fa-2x" onClick={this.toggleShare}>
          <div className="fab active" onClick={(e)=>{e.stopPropagation(); this.props.bebo.Share.sms(this.state.share_text);}}><i className="fa fa-comment-o fa-inverse" aria-hidden="true"></i></div>
          <div className="fab active" onClick={(e)=>{e.stopPropagation(); this.props.bebo.Share.twitter(this.state.share_text);}}><i className="fa fa-twitter fa-inverse" aria-hidden="true"></i></div>
          <div className="fab active" onClick={(e)=>{e.stopPropagation(); this.props.bebo.Share.whatsapp(this.state.share_text);}}><i className="fa fa-whatsapp fa-inverse" aria-hidden="true"></i></div>
          </div>
        </div>);
  }

  renderEmpty() {
    if(this.state.callersCount !== 0){ return null }
    return <div id='empty-state' className='landing'>
      <div className="landing-text">
        <h1>video<strong>lounge</strong></h1>
        <p>8 way facetime</p>
        <button id='camera' className='big-call-btn camera-btn' onClick={this.callInHangUp}></button>
      </div>
      <div className="notify-container">
        <p>Notify the group when I call in</p>
      </div>
    </div>
  }

  renderChat() {
    return <Input calledIn={this.state.calledIn} setChatInputState={this.blurInput} blurChat={this.state.blurInput} callInHangUp={this.callInHangUp}/>;
  }

  renderMessages() {
    if (this.state.messages.length === 0) {
      return null
    }
    return this.state.messages.map((message,i) =>{
      return (<div key={i} className='message'>
          <div className='message-left'>
            <div className='message-avatar' style={{backgroundImage: `url(${message.userImg})`}}></div>
          </div>
          <div className='message-right'>
            <div className='message-username'> {message.username} </div>
            <div className='message-text'> {message.message} </div>
          </div>
        </div>
        );
    })
  }

  render() {
    return (
      <div className="app-layer" onClick={this.blurInput}>
        {this.renderEmpty()}
        <div className="content-container">
        {this.renderChat()}
        <ul className="messages-list">
          {this.renderMessages()}
        </ul>
        </div>
        {this.renderShare()}
      </div>
    );
  }

}

App.displayName = 'App';

// Uncomment properties you need
// App.propTypes = {};
// App.defaultProps = {};

export default withBebo(App);
