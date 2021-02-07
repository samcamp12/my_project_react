import React, {Component} from 'react';
import { connect } from 'react-redux';
import Aux from '../../hoc/aux1';
import Burger from '../../component/Burger/Burger';
import BuildControls from '../../component/Burger/BuildControls/BuildControls';
import Model from '../../component/UI/Model/Model';
import OrderSummary from '../../component/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders';
import Spinner from '../../component/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';


class BurgerBuilder extends Component {
    
    state = {
        purchasing: false
    }
    componentDidMount() {
        console.log(this.props);
        this.props.onInitIngredients();
    }

    updatePurchaseState = (ingredients) => {

        const sum = Object.keys(ingredients)
        .map(igKey => {
            return ingredients[igKey];
        })
        .reduce((sum, elem) => {
            return sum + elem;       
        },0) // return the sum of items
        return sum > 0;
    };

    purchaseHandler = () => {
        if(this.props.isAuthenticated){
            this.setState({purchasing: true});
        } else {
            this.props.onSetAuthRedirectPath('/checkout') // redirect to checkout page after login with order
            this.props.history.push('/auth'); // redirect to login. history is from react router
        }
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
   }

    render() {
        const disableInfo = {
            ...this.props.ings
        };
        for(let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0; // change disableInfo into a boolean array
        }
        let orderSummary =  null;
        let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

        if(this.props.ings){
            burger =  (
        <Aux>
            <Burger ingredients = {this.props.ings}/> 
            <BuildControls  // the "order now" button 
                ingredientAdded={this.props.onIngredientAdded}
                ingredientRemoved={this.props.onIngredientRemoved}
                disabled = {disableInfo} // handle error and value <= 0
                purchasable={this.updatePurchaseState(this.props.ings)}
                ordered={this.purchaseHandler}
                isAuth={this.props.isAuthenticated} // redirect unauthenticated user to signup page
                price={this.props.price}/>
         </Aux>
        );

        orderSummary =  <OrderSummary 
            ingredients={this.props.ings}
            price={this.props.price}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}/>
            }; // {salad: true, meat: false, ...}

        return (
            <Aux>
                <Model show={this.state.purchasing} modelClosed={this.purchaseCancelHandler}>
                  {orderSummary}  
                </Model>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error.error,
        isAuthenticated: state.auth.token !== null
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (withErrorHandler(BurgerBuilder, axios));