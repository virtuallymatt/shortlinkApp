import React from 'react';
import ReactDOM from 'react-dom';

export default class NotFound extends React.Component {
  render() {
    return (
    <div className="boxed-view">
      <div className="boxed-view__box">
      <h1>Page Not Found</h1>
      <p> We're unable to find that page </p>
      <Link to="/" className="button button--link">Go to Home</Link>
    </div>
  </div>
  );
  }
}
