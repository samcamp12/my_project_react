import React , {Component} from 'react';
import Model from '../../component/UI/Model/Model';
import Aux from '../aux1';

const withErrorHandler = ( WrappedComponent , axios) => {
    return class extends Component {  // a class factory
        state={
            error: null
        }

        componentDidMount() {
            axios.interceptors.request.use(req => {
                this.setState({error: null});
                return req;
            })
            axios.interceptors.response.use(res => res, error => {
                this.setState({error: error});
                return 0;
            });
        }

        errorConfirmedHandler = () => {
            this.setState({error: null});
        }

        render() {
            return (
                <Aux> 
                <Model 
                show = {this.state.error}
                clicked={this.errorConfirmedHandler}>
                    {this.state.error ? this.state.error.message: null}
                </Model>
                <WrappedComponent {...this.props}/>
            </Aux>
            );
        }
}
}

export default withErrorHandler;