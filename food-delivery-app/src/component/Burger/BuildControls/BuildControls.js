import React from 'react';
import classes from './BuildControls.css';
import BuildControl  from './BuildControl/BuildControl'


// edit the order and button 
const controls = [
    { label: 'Lettuce', type:'lettuce'},
    { label: 'Bacon', type:'bacon'},
    { label: 'Cheese', type:'cheese'},
    { label: 'Meat', type:'meat'},
    { label: 'Tomato', type:'tomato'},

];
const buildControls = (props) => (
    <div className={classes.BuildControls}>
        <p>Current Price: <strong>{props.price.toFixed(2)}</strong></p>
        {controls.map(ctrl => (
            <BuildControl 
            key={ctrl.label} 
            label={ctrl.label} 
            type={ctrl.type}
            added={() => props.ingredientAdded(ctrl.type)} 
            removed={() => props.ingredientRemoved(ctrl.type)}
            disabled={props.disabled[ctrl.type]}/> // specify the keys to get the boolean of certain types {lettuce: true, meat: false ...}
        ))}
        <button 
        className={classes.OrderButton}
        disabled={!props.purchasable}
        onClick={props.ordered}>{props.isAuth ? 'ORDER NOW' : 'SIGN UP TO ORDER'}</button> 
    </div>
);

export default buildControls;