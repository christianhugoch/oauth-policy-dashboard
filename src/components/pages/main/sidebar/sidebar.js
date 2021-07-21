import { Link } from 'react-router-dom'
import {
    FaLock,
    FaCheckCircle,
    FaClipboard,
    FaQuestionCircle
} from 'react-icons/fa';
import {
    Collapse,
    NavbarBrand,
    Nav,
    NavItem,
} from 'reactstrap';

import oauthLogo from './oauth-logo-square.png';
import './sidebar.css';


const Sidebar = ({ collapsed }) => {
    return (
        <Collapse hide isOpen={!collapsed}>
            <Nav navbar vertical color='faded' className='bg-gradient-primary' id='sidebar'>
                <NavbarBrand id="sidebarbrand" href="/" className="d-flex">
                    <img 
                        src={oauthLogo} 
                        className="oauth-logo ml-1 mr-2" 
                        width="48"
                        alt="" />
                    <div
                        className="d-inline-block flex-grow-1 three-padd"
                    >
                        Policies
                    </div>
                </NavbarBrand>

                <hr className="sidebar-divider" />
                <NavItem>
                    <Link to="policies" className="nav-link">
                        <FaLock size="16px" className="icon-space" />
                        Policies
                    </Link>
                </NavItem>
                <NavItem>
                    <Link to="test_suites" className="nav-link">
                        <FaCheckCircle size="16px" className="icon-space" />
                        Tests
                        </Link>
                </NavItem>
                <NavItem>
                    <Link to='/logs' className="nav-link">
                        <FaClipboard size="16px" className="icon-space" />
                        Logs
                    </Link>
                </NavItem>
                <NavItem>
                    <Link to='/about' className="nav-link">
                        <FaQuestionCircle size="16px" className="icon-space" />
                        About
                    </Link>
                </NavItem>
            </Nav>
        </Collapse>
    );
}
export default Sidebar;