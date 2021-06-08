import { Component } from 'react'
import { Table, Checkbox  } from 'rsuite'

const { Column, HeaderCell, Cell,} = Table;

export class ServiceManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            checkedKeys: [],
        };
        this.handleCheck = this.handleCheck.bind(this)
    }

    componentDidMount() {
        this.requestFetch()
    }

    requestFetch() {
        this.callApi()
            .then(res => {
                    this.setState({ 
                        data: res.sv_list
                    })
                    //console.log(this.state.context)
            })
            .catch(err => console.log(err));
    }

    callApi = async () => {
        const response = await fetch('/api/admin/service/all_service');
        const body = await response.json();
        return body;
    };

    handleCheck(value, checked) {
        const checkedKeys = this.state.checkedKeys;
        const nextCheckedKeys = checked
            ? [...checkedKeys, value]
            : checkedKeys.filter(item => item !== value);

        this.setState({
            checkedKeys: nextCheckedKeys
        });
    }

    render() {
        //console.log(this.state.data)
        const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
            <Cell {...props} style={{ padding: 0 }}>
              <div style={{marginTop: -10}}>
                <Checkbox
                  value={rowData[dataKey]}
                  inline
                  onChange={onChange}
                  checked={checkedKeys.some(item => item === rowData[dataKey])}
                />
              </div>
            </Cell>
          );
          
        return (
            <div>
                <Table
                    height={400}
                    data={this.state.data}
                    onRowClick={data => {
                        console.log(data);
                    }}
                >
                    <Column width={180}>
                        <HeaderCell>Id</HeaderCell>
                        <Cell dataKey="_id" />
                    </Column>

                    <Column width={200} align="center" fixed>
                        <HeaderCell>Plan Name</HeaderCell>
                        <Cell dataKey="plan_name" />
                    </Column>

                    <Column width={200} fixed>
                        <HeaderCell>Checked</HeaderCell>
                        <CheckCell dataKey="_id"
                            checkedKeys={this.state.checkedKeys}
                            onChange={this.handleCheck} />
                    </Column>

                    <Column width={200}>
                        <HeaderCell>Plan Expiration Date</HeaderCell>
                        <Cell dataKey="payment_mode" />
                    </Column>

                    <Column width={100}>
                        <HeaderCell>Amount</HeaderCell>
                        <Cell dataKey="amount" />
                    </Column>
                </Table>
            </div>
        )
    }
}