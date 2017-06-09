import React from 'react';
import FlipMove from 'react-flip-move';

import {Tracker} from 'meteor/tracker';
import {Links} from  '../api/links';
import LinksListItem from './LinksListItem';
import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';

export default class LinksList extends React.Component {
//create a default state for the autorun cycles below
constructor(props) {
  super(props);
  this.state = {
    links:[]  //create default array for links
  };
}

/// life cycle methods ///
//componentDidMount - called just after component is show to screen
componentDidMount() {
  //set up a tracker call - render links to screen
  this.linksTracker = Tracker.autorun(() => {
    //subscribe
Meteor.subscribe('linksPub');

    //find all links in db
    const links = Links.find({
      visible: Session.get('showVisible')
    }).fetch();
    this.setState({links}); //set links in state to links in api links:links
  });
}
//will unmount - called right before the component is removed from the screen
componentWillUnmount() {
  //clean up the tracker run call so isnt running in the back ground
this.linksTracker.stop();
}

renderLinksListItems() {
if(this.state.links.length === 0) {
  return (
    <div className="item">
      <p className="item__status-messsage">No Links Found</p>
    </div>
  );
}

  //create map to render items
  return this.state.links.map((link) => {
    //append the full url from headers
    const shortUrl = Meteor.absoluteUrl(link._id);
    //link to equal an object
    //{...} is a spread value to spread all the props into it
    //spread the url, _id and userid
    return <LinksListItem key={link._id} shortUrl={shortUrl} {...link} />;
  });
}

  render() {
    return (
      <div>

    <FlipMove maintainContainerHeight={true}>
        {this.renderLinksListItems()}
      </FlipMove>
    </div>

    );
  }

};
