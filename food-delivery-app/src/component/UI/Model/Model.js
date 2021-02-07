import React from 'react';
import classes from './Model.css';
import Aux from '../../../hoc/aux1';
import Backdrop from '../Backdrop/Backdrop';

const Model = (props) => ( // design the order modal
    <Aux>
        <Backdrop show={props.show} clicked={props.modelClosed}/>
        <div 
        className={classes.Model}
        style={{
        transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
        opacity: props.show? '1':'0'
         }}>
        {props.children}
    </div>
    </Aux>
    
);

export default Model;