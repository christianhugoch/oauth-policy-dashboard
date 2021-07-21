import PolicyPage from '../policy/policy_page';
import PolicyEditor from '../policy/editor/policy_editor';
import TestSuitePage from '../test_suite/test_suite_page';
import TestSuiteEditor from '../test_suite/editor/test_suite_editor';
import LogsPage from '../logs/logs_page';
import AboutPage from '../about/about_page';
import Topbar from './topbar/topbar';
import Sidebar from './sidebar/sidebar';
import UserView from '../auth_views/user/user_page';

import React, { useState } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './main_page.css'


const MainPage = () => {
    const [collapsed, setCollapsed] = useState(false);
    const toggleNavbar = () => setCollapsed(!collapsed);
    const [topBarLabel, setTobbarLabel] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    return (
        <LoadingOverlay
            active={isLoading}
            spinner
            text='Loading your content...'
            className="full-height-spinner"
        >
            <div id='wrapper' className='d-flex'>
                <BrowserRouter basename="/policy-dashboard">
                    <Sidebar collapsed={collapsed} />
                    <div
                        id="content-wrapper"
                        className="helper"
                    >
                        <Topbar
                            toggleNavbar={toggleNavbar}
                            label={topBarLabel}
                            setIsLoading={setIsLoading}
                        />
                        <Switch>
                            {/* policy routes */}
                            <Route path='/policies' >
                                <PolicyPage
                                    setTobbarLabel={setTobbarLabel}
                                    label='Policies'
                                    setIsLoading={setIsLoading}
                                />
                            </Route>
                            <Route path='/policy_editor'>
                                <PolicyEditor
                                    setTobbarLabel={setTobbarLabel}
                                    label='Policy-Editor'
                                    setIsLoading={setIsLoading}
                                />
                            </Route>
                            <Route path='/policy_viewer'>
                                <PolicyEditor
                                    setTobbarLabel={setTobbarLabel}
                                    label='Policy-Viewer'
                                    setIsLoading={setIsLoading}
                                />
                            </Route>

                            {/* test suite routes */}
                            <Route path='/test_suites'>
                                <TestSuitePage
                                    setTobbarLabel={setTobbarLabel}
                                    label="Policy-Tests"
                                    setIsLoading={setIsLoading}
                                />
                            </Route>
                            <Route path='/test_suite_editor'>
                                <TestSuiteEditor
                                    setTobbarLabel={setTobbarLabel}
                                    label='Testsuite-Editor'
                                    setIsLoading={setIsLoading}
                                />
                            </Route>
                            <Route path='/test_suite_viewer'>
                                <TestSuiteEditor
                                    setTobbarLabel={setTobbarLabel}
                                    label='Testsuite-Viewer'
                                    setIsLoading={setIsLoading}
                                />
                            </Route>

                            {/* user-auth routes */}
                            <Route path='/user' >
                                <UserView
                                    setTobbarLabel={setTobbarLabel}
                                    label='User-Infos'
                                    setIsLoading={setIsLoading}
                                />
                            </Route>

                            {/* not yet implemented */}
                            <Route path="/logs">
                                <LogsPage
                                    setTobbarLabel={setTobbarLabel}
                                    label="Logs"
                                    setIsLoading={setIsLoading}
                                />
                            </Route>
                            <Route path="/about">
                                <AboutPage
                                    setTobbarLabel={setTobbarLabel}
                                    label="About"
                                    setIsLoading={setIsLoading}
                                />
                            </Route>
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        </LoadingOverlay>
    );
}
export default MainPage;