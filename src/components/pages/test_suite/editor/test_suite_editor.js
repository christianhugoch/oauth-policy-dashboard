import InfoBox from '../../../common/info_box/info_box';
import { getAuthenticatedUser } from '../../../../util/auth_module';
import {
    POSTExecuteTestSuites,
    GetPolicyTestSuite,
    POSTPolicyTestSuite,
    PUTPolicyTestSuite
} from '../../../../util/http_utils';

import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import { UnControlled as CodeMirror } from 'react-codemirror2'
import classNames from 'classnames/bind';
import {
    Container,
    Row,
    Button,
    Label,
    Input,
} from 'reactstrap';

import 'codemirror/lib/codemirror.css';
import "codemirror/mode/javascript/javascript.js";

let qs = require('qs');


const TestSuiteEditor = ({ setTobbarLabel, label, setIsLoading }) => {
    const [suite, setSuite] = useState(null);
    const [codeState, setCodeState] = useState('');
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [formattedStatistics, setFormattedStatistics] = useState(null);

    const [alertText, setAlertText] = useState(null);

    const location = useLocation();
    const history = useHistory();


    useEffect(() => {
        init();
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps


    async function init() {
        setIsLoading(true);
        setTobbarLabel(label);
        try {
            let testSuiteId = getTestSuiteIdFromURL();
            if (testSuiteId !== undefined) {
                let suiteFromServer = await load(testSuiteId);
                setSuite(suiteFromServer);
                setCodeState(suiteFromServer.orginalCode);
            }
        }
        catch (error) {
            setAlertText(error.message);
        }
        setIsLoading(false);
    }


    async function load(testSuiteId) {
        try {
            let authUser = await getAuthenticatedUser();
            return await GetPolicyTestSuite(authUser.id_token, testSuiteId);

        }
        catch (error) {
            setAlertText(error.message);
        }
    }


    function close() {
        let locationDescriptor = {
            pathname: "test_suites",
        }
        history.push(locationDescriptor);
    }


    async function save() {
        setIsLoading(true);
        setAlertText(null);
        try {
            let authUser = await getAuthenticatedUser();
            let savedSuite = suite ?
                await PUTPolicyTestSuite(
                    authUser.id_token, codeState, suite._id) :
                await POSTPolicyTestSuite(
                    authUser.id_token, codeState);
            history.push({
                search: `test_suite_id=${savedSuite._id}`
            });
            setSuite(savedSuite);
            setAlertText('The suite was saved successfully.');
            setUnsavedChanges(false);
        }
        catch (error) {
            setAlertText(error.message);
        }
        setIsLoading(false);
    }


    function formatRunStatistics(statistics) {
        let strArray = [];
        for (let suiteResult of statistics) {
            let successCount = suiteResult.statistics.successfulChecks,
                failureCount = suiteResult.statistics.failures;
            let suiteSuccessLabel = failureCount === 0 ? 'successfully' : 'erroneous';
            strArray.push(`The suite '${suiteResult.name}' executed ${suiteSuccessLabel}.`);
            strArray.push(
                `   successfull tests: ${successCount}, erroneuus tests: ${failureCount}`)
            let index = 1;
            for (let test of suiteResult.results) {
                let testSuccessLabel = test.expected === test.actual ?
                    'success' : 'error';
                let scopes = test.scopes.join(', ')
                strArray.push(`    - test ${index++} '${test.testName}' ${testSuccessLabel}:`);
                strArray.push(`        clientId: 'dummy', requested scopes: '${scopes}'`);
                strArray.push(`        expected: ${test.expected}, actual: ${test.actual}`);
            }
        }
        return strArray.join('\n');
    }


    async function execute() {
        setIsLoading(true);
        try {
            let authUser = await getAuthenticatedUser();
            let statisticsFromServer = await POSTExecuteTestSuites(
                authUser.id_token, suite.name);
            let formattedStatistics = formatRunStatistics(statisticsFromServer);
            setFormattedStatistics(formattedStatistics);
        }
        catch (error) {
            setAlertText(error.message);
        }
        setIsLoading(false);
    }


    function getTestSuiteIdFromURL() {
        if (location.search !== undefined && location.search.length > 0) {
            let queryParams = qs.parse(location.search.substring(1));
            if (queryParams.test_suite_id !== undefined) {
                return queryParams.test_suite_id;
            }
        }
        return undefined;
    }


    return (
        <Container className="d-flex flex-column flex-grow-1">
            {alertText &&
                <Row className="mb-0">
                    <InfoBox
                        alertText={alertText}
                        setAlertText={setAlertText}
                    />
                </Row>
            }
            <Row className="editor-border m-1 p-2 justify-content-between">
                <div className="d-flex align-items-center">
                    <div className="form-inline mb-0">
                        <Label
                            for="suiteName"
                            className="mr-2"
                        >
                            name:
                                </Label>
                        <Input
                            type="text"
                            id="suiteName"
                            defaultValue={suite !== null ? suite.name : ''}
                            readOnly={false}
                        />
                    </div>
                    <div className=
                        {`ml-1 ${classNames({ 'd-none': !unsavedChanges })}`}
                    >
                        *
                    </div>
                </div >

                <div>
                    <Button
                        className="mr-3"
                        onClick={execute}
                    >
                        execute
                    </Button>
                    <Button
                        className="mr-3"
                        onClick={save}
                    >
                        save
                    </Button>
                    <Button onClick={close}>
                        close
                    </Button>
                </div>
            </Row>

            <Row className="m-1 h-100">
                <CodeMirror
                    value={codeState}
                    autoCursor={false}
                    autoScroll={true}
                    className='editor-border w-100'
                    options={{
                        mode: 'javascript',
                        json: true,
                        lineNumbers: true,
                    }}
                    onChange={(editor, data, value) => {
                        if (suite) {
                            setUnsavedChanges(value !== suite.orginalCode);
                        }
                        setCodeState(value);
                    }}
                />
            </Row>
            {formattedStatistics &&
                <Row className="ml-1 mt-0 mr-1">
                    <CodeMirror
                        value={formattedStatistics}
                        autoCursor={false}
                        autoScroll={true}
                        className="editor-border w-100"
                        options={{
                            mode: 'json',
                            lineNumbers: true,
                        }}
                    />
                </Row>
            }
        </Container>
    )
};
export default TestSuiteEditor;