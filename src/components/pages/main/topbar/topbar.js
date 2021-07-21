import { getAuthenticatedUser, logout } from '../../../../util/auth_module';

import React, { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import {
    Navbar,
    Button,
} from 'reactstrap';
import { useHistory } from 'react-router-dom';

import './topbar.css'


const Topbar = ({ setIsLoading, toggleNavbar, label }) => {
    const [userName, setUserName] = useState(null);
    const history = useHistory();


    useEffect(() => {
        init();
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps


    async function init() {
        let user = await getAuthenticatedUser();
        console.log(user);
        if (user && user.profile) {
            setUserName(user.profile.sub);
        }
    }


    function openUserInfoPage() {
        let locationDescriptor = {
            pathname: 'user',
        }
        history.push(locationDescriptor);
    }


    function getUserInitials(userName) {
        if (!userName || userName.length === 0) {
            return '??';
        }
        return userName.substring(0, 1);
    }


    return (
        <Navbar color="light" id="topbar">
            <Button
                onClick={toggleNavbar}
                className='btn-link '
            >
                <FaBars />
            </Button>

            <h1 className="h3 mb-0">
                {label}
            </h1>

            <div>
                <div
                    className="d-inline-block mr-3"
                    role="button"
                    onClick={() => {
                        setIsLoading(true);
                        logout();
                    }}
                >
                    Logout
                    </div>
                <div className="d-inline-block">
                    <div
                        className="dot d-flex justify-content-center align-items-center mr-3"
                        role="button"
                        onClick={openUserInfoPage}
                    >
                        <div>{getUserInitials(userName)}</div>
                    </div>
                </div>
            </div>
        </Navbar>
    );
}

export default Topbar;