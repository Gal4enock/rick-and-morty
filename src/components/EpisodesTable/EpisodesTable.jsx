import React, { Component } from 'react';
import { connect } from 'react-redux';
import selector from '../../redux/selectors';
import operations from '../../redux/operations';
import TableRow from '../../shared/TableRow/TableRow';
import SliderBurrons from '../../shared/SlidereButtons/SlidereButtons';
import FilterField from '../FilterField/FilterField';
import style from './EpisodesTable.module.css'

class EpisodesTable extends Component {
  state = {
    page: 1,
    arrList: []
  }

  componentDidMount() {
    setTimeout(() => {
      console.log('iv done');
      this.props.toFetchEpisodes(this.state.page)
    
    }, 500)
    
    setTimeout(() => {
      this.setState({
        arrList: this.props.episObj
      })
      console.log("mounted",this.state.arrList);
    }, 600) 
}

  componentDidUpdate(prevProps, prevState) {
    if (prevState.page !== this.state.page) {
      this.props.toFetchEpisodes(this.state.page)
      setTimeout(() => {
        
        this.setState({
          arrList: this.props.episObj
        })
    }, 50)
    }
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
    this.props.toFilterEpisodes(key, query)
    setTimeout(() => {
      this.setState({arrList: this.props.episObj ? this.props.episObj : 'sorry, try again'})
      e.target[0].value = ''
      console.log('this.state.arrList', this.state.arrList);
      console.log('key', key);
    },50)
  }

  render() {
    const episArr = this.state.arrList
    console.log("episodesList", episArr);
    return (
      <div className={style.background}>
        <FilterField name='name' filterList={this.filterByQuery} />
        <p className={style.currentPage}>your page is #{this.state.page }</p>
        <table className={style.table}>
          <tr  key='9678'>
            <th key='name' className={style.row}>Name</th>
            <th key='date' className={style.row}>Air date</th>
            <th key='episode' className={style.row}>Episode</th>
          </tr>
          {episArr && episArr.length > 0 ? episArr.map(epis => <TableRow obj = {epis}/>) : 'please wait or try again'}
        </table>
        <SliderBurrons goPrevious={this.goPrevious} goNext={this.goNext} page={this.state.page}/>
        </div>
    )
  }
}

const mapStateToProps = state => ({
  episObj: selector.getEpisodes(state),
});

const mapDispatchToProps = dispath => {
  return {
    toFetchEpisodes: page => dispath(operations.fetchEpisodes(page)),
    toFilterEpisodes: (key, query) => dispath(operations.filterEpisodes(key, query))
  }
}
export default connect (mapStateToProps, mapDispatchToProps) (EpisodesTable)