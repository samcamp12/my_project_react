import React from 'react';
import {withRouter} from 'react-router-dom';
import classes from './Burger.css';
import BurgerIngredient from './Burgeringre/Burgeringre';

const burger = (props) => {
    let transIngredients = Object.keys(props.ingredients)
    .map(igKey => {
        return [...Array(props.ingredients[igKey])] // construct an array with size of ingredients
        .map((_,i) => { 
            return <BurgerIngredient key={igKey + i} type={igKey} />
        });
    })
    .reduce((arr, elem) => {
        return arr.concat(elem)
    }, []); // to reduce 5 arrays into one, so we could know when all arrays are empty

    if(transIngredients.length === 0){
        transIngredients = <p>Please start adding ingredients!</p>
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type='bread-top'/>
           {transIngredients}
            <BurgerIngredient type='bread-bottom'/>
        </div>
    );
};

export default withRouter(burger); // pass the special router props to this component