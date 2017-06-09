import React from 'react';
import {Meteor} from 'meteor/meteor';
import Modal from 'react-modal';


export default class AddLink extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      url: '',
      isOpen:false,
      error: ''
    };
  }

  onSubmit(e) {

//    const url = this.refs.url.value.trim();
    const url = this.state.url;

  e.preventDefault();
      //call url method from meteor methods
      Meteor.call("links.insert", url, (err,res) => {
        if(!err) {
          this.setState({url: '', isOpen: false, error: ''});  //clear value input
        } else {
          this.setState({error: err.reason});
        }
      });
}

  onChange(e) {
this.setState ({
  url: e.target.value
});
  }

  render() {
    return (
      <div>
        <button className="button" onClick={() => this.setState({isOpen: true})}>+ Add Link</button>
        <Modal isOpen={this.state.isOpen}
          className="boxed-view__box"
          overlayClassName="boxed-view boxed-view--modal"
          contentLabel="Add Link"
          onAfterOpen={() => this.refs.url.focus()}
          onRequestClose={() => this.setState({url: '', isOpen: false, error: ''})}>
          <h1> Add link </h1>
          {this.state.error ? <p>{this.state.error}</p> : undefined}
        <form onSubmit={this.onSubmit.bind(this)}>
          <input type="text" placeholder="enter url"
            value={this.state.url}
            ref="url"
            onChange={this.onChange.bind(this)}></input>
          <button className="button">Add link</button>
        </form>
        <button className="button button--secondary" onClick={() => this.setState({isOpen: false, url:'', error: ''})}>Close</button>
        </Modal>
      </div>
    );
  }
}
