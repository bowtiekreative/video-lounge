import React from 'react';

class Top extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const {background, handleClick} = this.props;
    return (<div className="top" style={{background:background}} onClick={handleClick}>
      top
    </div>);
  }

}

Top.displayName = 'Top';

Top.propTypes = {
  background: React.PropTypes.string.isRequired,
  handleClick: React.PropTypes.func.isRequired,
};

export default Top;
