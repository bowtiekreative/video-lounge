import React from 'react';

class App extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.shareClick = this.shareClick.bind(this);
    this.state = {
      background: 'yellow',
      serverId: null
    };
  }

  componentWillMount() {
    var _this = this;
    Bebo.Server.get(function(err, data) {
      if(err){ console.log('error getting server') }
      _this.setState({serverId: data.access_code});
      _this.setState({serverTheme: data.theme});
    });
  }

  shareClick() {
    console.log('click');
    var message;
    message = "sms:&body=" + encodeURIComponent('Join my Bebo server '+ this.state.serverTheme +' using this secret code ' + this.state.serverId + ' !');
    Bebo.openURI(message);
  }

  renderId() {
    return (
      <div className="server-id">
        <div className="Aligner">
          <div className="Aligner-item theme">
            {this.state.serverTheme}
          </div>
          <div className="Aligner-item">
            <button className="btn" onClick={this.shareClick}>share</button>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="app-layer" onClick={this.blurInput}>
        {this.renderId()}
      </div>
    );
  }

}

App.displayName = 'App';

// Uncomment properties you need
// App.propTypes = {};
// App.defaultProps = {};

export default App;