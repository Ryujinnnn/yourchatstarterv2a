import { Component } from 'react'
import { Divider, Icon, IconButton, Table } from 'rsuite'

const { Column, HeaderCell, Cell } = Table;

export class BillManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        this.requestFetch()
    }

    requestFetch() {
        this.callApi()
            .then(res => {
                if (!res.bill_list) return
                this.setState({ 
                    data: res.bill_list
                })
                //console.log(this.state.context)
            })
            .catch(err => console.log(err));
    }

    callApi = async () => {
        const response = await fetch('/api/admin/bill/all_bill');
        const body = await response.json();
        return body;
    };

    render() {
        //console.log(this.state.data)
          
        return (
            <div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'end', alignItems: 'center'}}>
                    <div style={{flex: 1}}>
                    <p>Hiện tại có {this.state.data.length} hóa đơn thanh toán ví dịch vụ hệ thống</p>
                    </div>
                    <div style={{flex: 1}}>
                    <IconButton style={{float: 'right'}} icon={<Icon icon="plus"></Icon>} onClick={this.onNewUser} color="green"> Thêm mới</IconButton>
                    </div>
                </div>
                <Divider />

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
                        <HeaderCell>Username</HeaderCell>
                        <Cell dataKey="username" />
                    </Column>

                    <Column width={200} fixed>
                        <HeaderCell>Plan Name</HeaderCell>
                        <Cell dataKey="plan_name" />
                    </Column>

                    <Column width={200}>
                        <HeaderCell>Creation Date</HeaderCell>
                        <Cell dataKey="created_at" />
                    </Column>

                    <Column width={100}>
                        <HeaderCell>Amount</HeaderCell>
                        <Cell dataKey="amount" />
                    </Column>
                    <Column width={120} fixed="right">
                        <HeaderCell>Action</HeaderCell>
                        <Cell>
                            {rowData => {
                                function handleAction() {
                                    alert(`id:${rowData.id}`);
                                }
                                return (
                                    <span>
                                        <a onClick={handleAction}> Edit </a> |{' '}
                                        <a onClick={handleAction}> Remove </a>
                                    </span>
                                );
                            }}
                        </Cell>
                    </Column>
                </Table>
            </div>
        )
    }
}