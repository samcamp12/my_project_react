import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    ingredients: null,
    totalPrice: 3,
    error: false,
    building: false // ckeck if user chenged ingredients. if so, web will direct the user to checkout after authenticated
};

const INGREDIENT_PRICES = {
    lettuce: 0,
    tomato: 0,
    cheese: 0.5,
    meat: 1.5,
    bacon: 0.5
};

const addIngredient = ( state, action ) => {
    const updatedIngredient = { [action.ingredientName]: state.ingredients[action.ingredientName] + 1 }
    const updatedIngredients = updateObject( state.ingredients, updatedIngredient );
    const updatedState = {
        ingredients: updatedIngredients,
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
        building: true
    }
    return updateObject( state, updatedState );
};

const removeIngredient = (state, action) => {
    const updatedIng = { [action.ingredientName]: state.ingredients[action.ingredientName] - 1 }
    const updatedIngs = updateObject( state.ingredients, updatedIng );
    const updatedSt = {
        ingredients: updatedIngs,
        totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
        building: true
    }
    return updateObject( state, updatedSt );
};

const setIngredients = (state, action) => {
    return updateObject( state, {
        ingredients: {
            lettuce: action.ingredients.lettuce,
            tomato: action.ingredients.tomato,
            bacon: action.ingredients.bacon,
            cheese: action.ingredients.cheese,
            meat: action.ingredients.meat
        },
        totalPrice: 3,
        error: false,
        building: false // not begin bulid burger yet
    } );
};

const fetchIngredientsFailed = (state, action) => {
    return updateObject( state, { error: true } );
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.ADD_INGREDIENT: return addIngredient( state, action );
        case actionTypes.REMOVE_INGREDIENT: return removeIngredient(state, action);
        case actionTypes.SET_INGREDIENTS: return setIngredients(state, action);    
        case actionTypes.FETCH_INGREDIENTS_FAILED: return fetchIngredientsFailed(state, action);
        default: return state;
    }
};

export default reducer;