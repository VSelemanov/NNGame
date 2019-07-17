import * as React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import style from "./AdminTools.module.scss";
import { mapStateToProps, mapDispatchToProps } from '../../exports';
import { connect } from 'react-redux';
import store from '../../store';
import { push } from 'connected-react-router';
import { getAllTeams } from '../../toServer/requests';

class ListTeams extends React.Component <any, any>{
  constructor(props: any) {
    super(props);
    this.state = {
      allTeams: [],
    };
  }
  componentDidMount() {
    getAllTeams().then(response => {
      const allTeams = response.data
      this.setState({
        allTeams
      });
    });
  }
  public render() {
    const data = this.state.allTeams;
    const params = {
      previousText: 'Пред.',
      nextText: 'След.',
      loadingText: 'Загрузка...',
      noDataText: 'Нет данных',
      pageText: 'Стр.',
      ofText: 'из',
      rowsText: 'строк',
      showPagination: false,
      };
    const columns = [
      {
        Header: 'Название',
			  accessor: 'name',
      },
      {
        Header: 'Созданa',
			  accessor: 'cAt',
      },
      {
        Header: 'Действия',
        id: 'actions',
        accessor: (d: any) => {
          return (<div>
            <button
              // className={style.edit}
              >
              Edit
            </button>
            <button
              // className={style.delete}
              >
              Del
            </button>
          </div>)
        },
        resisable: false,
        sortable: false,
        style: {padding: 5},
        width: 100,

      },
    ];
    return (
      <div className={style.main_table}>
        <ReactTable
					data={data}
          columns={columns}
          defaultPageSize={15}
					{...params}
					className="-striped -highlight"
        />
      </div>
    )
  }
}
export default connect( mapStateToProps, mapDispatchToProps)(ListTeams);
