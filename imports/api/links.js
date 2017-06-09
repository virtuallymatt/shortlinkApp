import {Mongo } from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import shortid from 'shortid';

export const Links = new Mongo.Collection('links');


//only want to run publish when we run on server
if (Meteor.isServer) {
  Meteor.publish('linksPub', function() {   //links is not specific to collection
    //user can see all links
  return Links.find({userId: this.userId});
  });
}


Meteor.methods({
  //create insert method
  'links.insert'(url) {
    //make user is logged in - if not give an error
    if (!this.userId) {
      throw new Meteor.error('not-authorised');  //throw error
}
//create validation before insert
  new SimpleSchema({
    url: {
      type: String,
      label: 'Your link',
      regEx: SimpleSchema.RegEx.Url
    }
  }).validate({url});

    Links.insert({   //insert the link if logged in
      _id: shortid.generate(),
      url,            ///pass the url and user id into db
      userId: this.userId,     //where userId = current userid
      visitedCount: 0,
      lastVisitedAt: null,
      visible:true
    });
  },
'links.setVisibility'(_id, visible) {
  //check user is logged in or throw error
  if(!this.userId) {
      throw new Meteor.Error('not-authorised');
  }
  //validate arguments
  //_id is string with length greater than 1
  //visible is boolean
  new SimpleSchema({
    _id: {
      type: String,
      min: 1
    },
    visible: {
      type: Boolean
    }
  }).validate({_id, visible});

  //links.update - where id and userid match document
  //set visible prop to visible argument

  Links.update({
    _id,
    userId: this.userId
  }, {
    $set: {visible}
  });
},

'links.trackVisit'(_id) {
  new SimpleSchema({
    _id: {
      type: String,
      min: 1
    }
  }).validate({_id});
  Links.update({_id: _id}, {
    $set: {
      lastVisitedAt: new Date().getTime()
    },
    $inc: {
      visitedCount: 1
    }
  });
}

});
