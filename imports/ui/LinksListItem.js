import React from 'react';
import Clipboard from 'clipboard';
import {Meteor} from 'meteor/meteor';
import moment from 'moment';

export default class LinksListItem extends React.Component {
constructor(props) {
  super(props);
    this.state = {
      justCopied: false
    };
}

  //load library when on screen
componentDidMount() {
  //create reference to create new instance of clipboard
  this.clipboard = new Clipboard (this.refs.copy);

//create conditional for presentation
//on success do something
//change copy to 'copied' for one second
  this.clipboard.on("success", () => {
    this.setState({justCopied: true});
    //after 1 sec, change back to false
    setTimeout(() => this.setState({justCopied: false}), 1000);
    //if copy error
  }).on('error', () => {
    alert('Unable to copy');
  });
}

componentWillUnmount() {
  this.clipboard.destroy();
}
  renderStats(){
      const visitMessage = this.props.visitedCount === 1 ? 'visit' : "visits";
      let visitedMessage = null;
//if lastVisitedAt is not a null/empty
      if (typeof this.props.lastVisitedAt === 'number') {
        visitedMessage = `(visited ${ moment(this.props.lastVisitedAt).fromNow()})`;
      }
      return (
      <p className="item__message">{this.props.visitedCount} {visitMessage} - {visitedMessage}</p>
    )
  }


  render() {
    return(
      <div className="item">
        <p>{this.props.url}</p>
        <p className="item__message">{this.props.shortUrl}</p>
        {this.renderStats()}
        <a className="button button--pill button--link" href={this.props.shortUrl} target="_blank">visit</a>
        <button className="button button--pill" ref="copy" data-clipboard-text={this.props.shortUrl}>
          {this.state.justCopied ? 'Copied' : 'Copy'}
        </button>
        <button className="button button--pill" onClick={() => {
          Meteor.call('links.setVisibility', this.props._id, !this.props.visible)
        }}>
          {this.props.visible ? 'hide' : 'unhide'}</button>
      </div>
    );
  }
};

LinksListItem.propTypes = {
  _id: React.PropTypes.string.isRequired,
  url: React.PropTypes.string.isRequired,
  userId: React.PropTypes.string.isRequired,
  shortUrl: React.PropTypes.string.isRequired,
  visible: React.PropTypes.bool.isRequired,
  visitedCount: React.PropTypes.number.isRequired,
  lastVisitedAt: React.PropTypes.number

};
