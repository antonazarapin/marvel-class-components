import { Component } from 'react/cjs/react.production.min';
import PropTypes from 'prop-types';

import './charList.scss';
import MarverService from '../../services/MarverService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false,
        activeCharacter: null
    }

    marverService = new MarverService();

    componentDidMount() {
        this.onRequest()
    }

    onRequest = (offset) => {
        this.onCharLoading();
        this.marverService.getAllCharacters(offset)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    onCharLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }));
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }



    renderItems(arr) {

        const items = arr.map(item => {

            return (
                <li key={item.id}
                    onClick={() => {
                        this.props.onCharSelected(item.id)
                        this.setState({
                            activeCharacter: item.id
                        })
                    }}
                    className={
                        this.state.activeCharacter === item.id
                            ? 'char__item char__item_selected'
                            : 'char__item'
                    }>
                        <img src={item.thumbnail} 
                             alt={item.name}
                             style={
                                item.thumbnail.indexOf('not_available') !== -1 
                                    ? { objectFit: 'unset' } 
                                    : { objectFit: 'cover' }
                             }/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })
    
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }


    render() {
        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;

        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}

                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    onClick={() => this.onRequest(offset)}
                    style={{'display': charEnded ? 'none' : 'block'}}>

                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}



export default CharList;