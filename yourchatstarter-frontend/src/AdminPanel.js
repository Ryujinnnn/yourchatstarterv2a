import { Component } from "react";
import { Container, Sidenav, Sidebar, Nav, Navbar, Dropdown, Icon, Header, Content } from 'rsuite'

const headerStyles = {
    padding: 18,
    fontSize: 16,
    height: 56,
    background: '#34c3ff',
    color: ' #fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
};

const iconStyles = {
    width: 56,
    height: 56,
    lineHeight: '56px',
    textAlign: 'center'
};

const NavToggle = ({ expand, onChange }) => {
    return (
        <Navbar appearance="subtle" className="nav-toggle">
            <Navbar.Body>
                <Nav>
                    <Dropdown
                        placement="topStart"
                        trigger="click"
                        renderTitle={children => {
                            return <Icon style={iconStyles} icon="cog" />;
                        }}
                    >
                        <Dropdown.Item>Help</Dropdown.Item>
                        <Dropdown.Item>Settings</Dropdown.Item>
                        <Dropdown.Item>Sign out</Dropdown.Item>
                    </Dropdown>
                </Nav>

                <Nav pullRight>
                    <Nav.Item onClick={onChange} style={{ width: 56, textAlign: 'center' }}>
                        <Icon icon={expand ? 'angle-left' : 'angle-right'} />
                    </Nav.Item>
                </Nav>
            </Navbar.Body>
        </Navbar>
    );
};

export class AdminPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expand: true
        };
        this.handleToggle = this.handleToggle.bind(this);
    }
    handleToggle() {
        this.setState({
            expand: !this.state.expand
        });
    }
    render() {
        const { expand } = this.state;
        return (
            <div className="show-fake-browser sidebar-page" style={{textAlign: 'left'}}>
                <Container>
                    <Sidebar
                        style={{ display: 'flex', flexDirection: 'column' }}
                        width={expand ? 260 : 56}
                        collapsible
                    >
                        <Sidenav expanded={expand} defaultOpenKeys={['3']} appearance="subtle">
                            <Sidenav.Header>
                                <div style={headerStyles}>
                                    <Icon icon="logo-analytics" size="lg" style={{ verticalAlign: 0 }} />
                                    <span style={{ marginLeft: 12 }}> AdminPanel</span>
                                </div>
                            </Sidenav.Header>
                            <Sidenav.Body>
                                <Nav>
                                    <Nav.Item eventKey="1" active icon={<Icon icon="dashboard" />}>
                                        Dashboard
                                    </Nav.Item>
                                    <Nav.Item eventKey="2" icon={<Icon icon="group" />}>
                                        Info
                                    </Nav.Item>
                                    <Dropdown
                                        eventKey="3"
                                        trigger="hover"
                                        title="Managing"
                                        icon={<Icon icon="magic" />}
                                        placement="rightStart"
                                    >
                                        <Dropdown.Item eventKey="3-1">Users</Dropdown.Item>
                                        <Dropdown.Item eventKey="3-2">Billing</Dropdown.Item>
                                        <Dropdown.Item eventKey="3-3">Subscription Plan</Dropdown.Item>
                                        <Dropdown.Item eventKey="3-4">Blog</Dropdown.Item>
                                    </Dropdown>
                                    <Dropdown
                                        eventKey="4"
                                        trigger="hover"
                                        title="Settings"
                                        icon={<Icon icon="gear-circle" />}
                                        placement="rightStart"
                                    >
                                        <Dropdown.Item eventKey="4-1">Applications</Dropdown.Item>
                                        <Dropdown.Item eventKey="4-2">Websites</Dropdown.Item>
                                        <Dropdown.Item eventKey="4-3">Versions</Dropdown.Item>
                                    </Dropdown>
                                </Nav>
                            </Sidenav.Body>
                        </Sidenav>
                        <NavToggle expand={expand} onChange={this.handleToggle} />
                    </Sidebar>

                    <Container style={{padding: 20}}>
                        <Header>
                            <h4>Page Title</h4>
                        </Header>
                        <Content>Content</Content>
                    </Container>
                </Container>
            </div>
        );
    }
}