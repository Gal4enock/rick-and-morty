import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup } from '@material-ui/core';


import selector from '../../redux/selectors';
import operations from '../../redux/operations';
import Card from '../Card';
import FilterField from '../FilterField/FilterField';
import style from './Gallery.module.css'

class CharactersList extends Component {
  state = {
    page: 1,
    arrList: []
}

  componentDidMount() {
    setTimeout(() => {
      console.log('iv done');
      this.props.toFetchCharacters(this.state.page)
    
    }, 500)
    
    setTimeout(() => {
      this.setState({
        arrList: this.props.charObj.results
      }) 
    }, 600) 
}

  componentDidUpdate(prevProps, prevState) {
    if (prevState.page !== this.state.page) {
      this.props.toFetchCharacters(this.state.page)
      setTimeout(() => {
        
        this.setState({
          arrList: this.props.charObj.results
        })
    }, 50)
    }
  }
  restart = () => {
   this.props.toFetchCharacters(this.state.page)
    setTimeout(() => {
      this.setState({
        arrList: this.props.charObj.results
      }) 
    }, 600)
  }

  goNext = () => {
    this.setState({ page: this.state.page + 1 })
    document.documentElement.scrollTop = 0;
  }

  goPrevious = () => {
   document.documentElement.scrollTop = 0;
    if (this.state.page > 1) {
      this.setState({ page: this.state.page - 1 })
    } else return
  }

  filterByQuery = (e) => {
    e.preventDefault();
    const key = e.target.name;
    const query = e.target[0].value
    this.props.toFilterCharacters(key, query)
    setTimeout(() => {
      this.setState({arrList: this.props.charObj ? this.props.charObj : 'sorry, try again'})
      e.target[0].value = ''
      console.log('this.state.arrList', this.state.arrList);
      console.log('key', key);
    },50)
  }


render() {
  const charArr = this.state.arrList
  console.log('cccccc', charArr); 
    return (
      <div onClick={this.showDetails}>
        <div >
          <div className={style.filterForm}>
            <FilterField name='name' filterList={this.filterByQuery} />
            <FilterField name='species' filterList={this.filterByQuery} />
            <FilterField name='gender' filterList={this.filterByQuery} />
          </div>
          <Button onClick = {this.restart}  variant="contained">Back to normal</Button>
        </div>
        <p className={style.currentPage}>your page is #{this.state.page }</p>
        <ul className={style.list}>{charArr && charArr.length > 0 ? charArr.map(char => <li key={char.id}><Card obj={char} /></li>) : 'please wait or try again'}</ul>
          <div className={style.buttons}>
        <ButtonGroup disableElevation variant="contained" color="primary" >
          <Button onClick={this.goPrevious}>&laquo;</Button>
          <p className={style.pageNumber}>{ this.state.page}</p>
            <Button onClick={this.goNext}> &raquo; </Button>
        </ButtonGroup>
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  charObj: selector.getCharacters(state),
});

const mapDispatchToProps = dispath => {
  return {
    toFetchCharacters: page => dispath(operations.fetchCharacters(page)),
    toFilterCharacters: (key, query) => dispath(operations.filterCharacters(key, query))
  }
}
export default connect (mapStateToProps, mapDispatchToProps) (CharactersList)