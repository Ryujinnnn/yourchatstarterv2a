import { Component } from 'react'
import { Table } from 'rsuite'

const { Column, HeaderCell, Cell } = Table;

export class BlogManager extends Component {
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
                    this.setState({ 
                        data: res.blog_list
                    })
                    //console.log(this.state.context)
            })
            .catch(err => console.log(err));
    }

    callApi = async () => {
        const response = await fetch('/api/admin/blog/all_blog');
        const body = await response.json();
        return body;
    };

    render() {
        //console.log(this.state.data)
          
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

                    <Column width={300} align="center" fixed>
                        <HeaderCell>Title</HeaderCell>
                        <Cell dataKey="title" />
                    </Column>

                    {/* <Column width={200} fixed>
                        <HeaderCell>Tags</HeaderCell>
                        <Cell dataKey="email" />
                    </Column> */}

                    <Column width={200}>
                        <HeaderCell>Creation Date</HeaderCell>
                        <Cell dataKey="createOn" />
                    </Column>

                    <Column width={100}>
                        <HeaderCell>Article Id</HeaderCell>
                        <Cell dataKey="articleId" />
                    </Column>
                    <Column width={100}>
                        <HeaderCell>Image</HeaderCell>
                        <Cell dataKey="imageLink" />
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