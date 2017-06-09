import { Meteor } from 'meteor/meteor';
import {WebApp} from 'meteor/webapp';


import '../imports/api/users';
import {Links} from '../imports/api/links';
import '../imports/startup/simple-schema-configuration';


Meteor.startup(() => {
  // code to run on server at startup

  //run middleware
  //use takes 3 arguments:
  // req  - request, stores things about incoming request
  // res - response, allows us to respond to the http request
  // next - a function, allows app to keep moving
WebApp.connectHandlers.use((req, res, next) => {
  const _id = req.url.slice(1); //start at 2nd character
  //find a link in the db to match to found id above
  const link = Links.findOne({_id: _id}); //where _id: _id in db

  if(link) {
    //set http status code
    res.statusCode = 302;
    //set http headers for redirect
    res.setHeader('location', link.url );
    res.end();
    //track links for analytics
    Meteor.call('links.trackVisit', _id);
  } else {
next()
  }

});

});
