import React from 'react';
import classes from './Input.css';

const input = (props) => {

    let inputElement = null;
    const inputClasses = [classes.InputElement];

    if(props.invalid && props.shouldValidate && props.touched) { // shouldValite will prevent dropdown be part of validate
        inputClasses.push(classes.Invalid);
    }
    
    switch(props.elementType){
        case ('input'):
            inputElement = <input 
                className={inputClasses.join(' ')} // for css styling
                {...props.elementConfig} 
                value={props.value}
                onChange={props.changed}/>; // the props will receive other attributes
            break;
        case ('select'):
            inputElement = (
            <select
                className={inputClasses.join(' ')}
                value={props.value}
                onChange={props.changed}>
                {props.elementConfig.options.map(option => (
                    <option key={option.value} value={option.value}>{option.displayValue}</option> // refer to the options in contact data
                ))
                }
            </select>
            );
            break;

        default:
            inputElement = <input 
                className={inputClasses.join(' ')}
                {...props.elementConfig} 
                value={props.value} 
                onChange={props.changed}/>;
    }
    
    return(
        <div className={classes.Input}>
            <label className='Label'>{props.label}</label>
            {inputElement}
        </div>
    )
    
};

export default input;