import React, { Component } from 'react';
import Layout from './hoc/Layout/Layout';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import BurgerBuilder from './containers/burgerbuilder/burgerbuilder';
import Checkout from './containers/Checkout/Checkout';
import Orders from './containers/Orders/Orders';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

// all the routes are here
class App extends Component{

  componentDidMount() {
    this.props.onTryAutoSignup(); // sign up use local state when refresh the page
  }

  render(){
  return (
    <div>
       <Layout>
        <Switch>
          <Route path="/checkout" component={Checkout}/>  
          <Route path="/orders" component={Orders}/>  
          <Route path="/logout" component={Logout}/>
          <Route path="/" exact component={BurgerBuilder}/>
          <Route path="/auth" exact component={Auth}/>
        </Switch>
        </Layout>
    </div>
  );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default withRouter(connect(null, mapDispatchToProps)(App));
