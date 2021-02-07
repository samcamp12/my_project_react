import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../component/UI/Input/Input';
import Button from '../../component/UI/Button/Button';
import Spinner from '../../component/UI/Spinner/Spinner';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Mail Address'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        },
        isSignup: true
    }

    componentDidMount() { // change the redirect path back when the user didn't build burger
        if (!this.props.buildingBurger && this.props.authRedirectPath !== '/'){ // not building a burger and direct to checkout
            this.props.onSetAuthRedirectPath();
        }
    }

    checkValidity(value, rules) {
        let isValid = true;
        if (!rules) {
            return true;
        }
        
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }

        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }

        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }

        return isValid;
    }

    inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
            }
        };
        this.setState({controls: updatedControls});
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth( 
            this.state.controls.email.value, 
            this.state.controls.password.value,
            this.state.isSignup); // pass data to dispatch
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {isSignup: !prevState.isSignup};
            }
        )
    }

    render() {
        const formElementsArray = [];
        for(let key in this.state.controls){
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            
            });
        }

        let form = formElementsArray.map(formElement => (
            <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={(event) => this.inputChangedHandler(event, formElement.id)} />
        ));

        if (this.props.loading) {
            form = <Spinner/>
        }

        let errorMessage = null;

        if(this.props.error) {
            errorMessage = (
                <p className={classes.ErrorMessage}>Sorry, you cannot signin with {this.props.error.message}</p> // the error message is from firebase database
            );
        }

        let authRedirect = null;
        if (this.props.isAuthenticated) { // test authenticate state to enable redirect
            authRedirect = <Redirect to={this.props.authRedirectPath}/>; // redirect to homepage after success login
        }
        
        return (
            <div className={classes.Auth}>
                {authRedirect}
                <p className={classes.HeadLine}>{this.state.isSignup ? 'SIGNUP' : "SIGNIN"}</p>
                <form onSubmit={this.submitHandler}>
                    {form}
                    {errorMessage}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button 
                    clicked={this.switchAuthModeHandler} // change the signin and aignup button
                    btnType="Danger">SWITCH TO {this.state.isSignup ? 'SIGNIN' : "SIGNUP"}</Button>
            </div>
        )
    }
}

const mapStateToProps = (state) => { // store the token from database
        return {
            laoding: state.auth.loading,  // from index.js
            error: state.auth.error,
            isAuthenticated: state.auth.token !== null, // to redirect after the user is authenticated
            buildingBurger: state.burgerBuilder.building,
            authRedirectPath: state.auth.authRedirectPath 
        }
    }

const mapDispatchToProps = (dispatch) => {
        return {
            onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
            onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
        };
    }

export default connect (mapStateToProps, mapDispatchToProps)(Auth);