import { Component } from "react";
import { Container, Sidenav, Sidebar, Nav, Navbar, Dropdown, Icon, Header, Content } from 'rsuite'
// import { BillManager } from "./Component/AdminPanelComponents/BillManager";
// import { BlogManager } from "./Component/AdminPanelComponents/BlogManager";
// import { UserManager } from './Component/AdminPanelComponents/UserManager';
// import { ServiceManager } from './Component/AdminPanelComponents/ServiceManager'
import { BillManager, BlogManager, UserManager, ServiceManager } from "../Component";

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
            expand: true,
            currentPageTitle: "Dashboard" 
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
        const LoadedComponet = (this.state.currentPageTitle === "Users") ? <UserManager />
            : (this.state.currentPageTitle === "Billing") ? <BillManager />
            : (this.state.currentPageTitle === "Subscription Plan") ? <ServiceManager />
            : (this.state.currentPageTitle === "Blog") ? <BlogManager />
            : (this.state.currentPageTitle === "Dashboard")? (<p>Dashboard</p>)
            : (<p>This page is empty</p>)

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
                                    <span style={{ marginLeft: 12 }}>Admin Panel</span>
                                </div>
                            </Sidenav.Header>
                            <Sidenav.Body>
                                <Nav>
                                    <Nav.Item eventKey="1" active icon={<Icon icon="dashboard" />} onSelect={() => {this.setState({currentPageTitle: "Dashboard"})}}>
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
                                        <Dropdown.Item eventKey="3-1" onSelect={() => {this.setState({currentPageTitle: "Users"})}}>Users</Dropdown.Item>
                                        <Dropdown.Item eventKey="3-2" onSelect={() => {this.setState({currentPageTitle: "Billing"})}}>Billing</Dropdown.Item>
                                        <Dropdown.Item eventKey="3-3" onSelect={() => {this.setState({currentPageTitle: "Subscription Plan"})}}>Subscription Plan</Dropdown.Item>
                                        <Dropdown.Item eventKey="3-4" onSelect={() => {this.setState({currentPageTitle: "Blog"})}}>Blog</Dropdown.Item>
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

                    <Container style={{padding: 10}}>
                        <Header style={{marginBottom: 10}}>
                            <h4>{this.state.currentPageTitle}</h4>
                        </Header>
                        <Content>{LoadedComponet}</Content>
                    </Container>
                </Container>
            </div>
        );
    }
}