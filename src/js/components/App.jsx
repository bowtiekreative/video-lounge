import React from 'react';
import Input from './Input';

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
  }

  componentWillMount() {
    this.handleCallerChanges();
    this.handleEvents();
  }

  blurInput() {
    this.setState({ blurInput: true });
  }

  handleEvents() {
    Bebo.onEvent((data) => {
      console.log('data', data);
      this.handleMessage(data);
    });
  }

  handleMessage(message) {
    const messages = this.state.messages;
    messages.push(message.message);
    this.setState({messages});
    console.log(messages);
    setTimeout(() => {
      this.setState({messages: messages.filter((m)=> m.timestamp !== message.message.timestamp)
      })
    }, 4500)
  }

  handleCallerChanges() {
    let _this = this;
    Bebo.onCallUpdate((data) => {
      _this.setState({callersList: data, callersCount: data ? data.length: 0});
    });
  }

  notifyer(message) {
    const prom = Bebo.Notification.roster('{{{user.username}}}', message);
    prom.then(function(){
      console.log('notified - ', message);
    });
  }

  notifyServer() {
    if(this.state.callersCount >= 2 && !this.state.hasCalledIn){
      this.notifyer('is chilling in the video lounge');
    } else if(!this.state.hasCalledIn) {
      this.notifyer('is lonely in the video lounge...');
    }
  }

  callInHangUp() {
    console.log('toad', this.state.calledIn);
    if(!this.state.calledIn){
      this.setState({calledIn: true, hasCalledIn: true});
      Bebo.callin(true, true);
      this.notifyServer();
    } else {
      this.setState({calledIn: false});
      Bebo.hangup();
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
          <div className="fab active" onClick={(e)=>{e.stopPropagation(); Bebo.Share.sms(this.state.share_text);}}><i className="fa fa-comment-o fa-inverse" aria-hidden="true"></i></div>
          <div className="fab active" onClick={(e)=>{e.stopPropagation(); Bebo.Share.twitter(this.state.share_text);}}><i className="fa fa-twitter fa-inverse" aria-hidden="true"></i></div>
          <div className="fab active" onClick={(e)=>{e.stopPropagation(); Bebo.Share.whatsapp(this.state.share_text);}}><i className="fa fa-whatsapp fa-inverse" aria-hidden="true"></i></div>
          </div>
        </div>);
  }

  renderEmpty() {
    if(this.state.callersCount !== 0){ return null }
    return <div id='empty-state' className='Aligner'>
      <div id='fist-participant' className='Aligner-item'>
        <div className='action-text Aligner-item'>take a seat</div>
        <div className='action-arrow Aligner-item'></div>
        <button id='camera' className='camera-btn' onClick={this.callInHangUp}/>
      </div>
    </div>
  }

  renderChat() {
    return <Input setChatInputState={this.blurInput} blurChat={this.state.blurInput} callInHangUp={this.callInHangUp}/>;
  }

  renderMessages() {
    if (this.state.messages.length === 0) {
      return null
    }
    return this.state.messages.map((message,i) =>{
      return (<div key={i} className='message animate-out'>
        <div className='message--inner'>
          <div className='message--inner--left'>
            <div className='message--avatar' style={{backgroundImage: `url(${message.userImg})`}}></div>
        </div>
        <div className='message--inner--right'>
          <div className='message--content'>
            <div className='message--content--username'> {message.username} </div>
            <div className='message--content--text'> {message.message} </div>
          </div>
        </div>
      </div>
        </div>
        );
    })
  }

  render() {
    return (
      <div className="app-layer" onClick={this.blurInput}>
        {this.renderEmpty()}
        {this.renderChat()}
        {this.renderMessages()}
        {this.renderShare()}
      </div>
    );
  }

}

App.displayName = 'App';

// Uncomment properties you need
// App.propTypes = {};
// App.defaultProps = {};

export default App;
