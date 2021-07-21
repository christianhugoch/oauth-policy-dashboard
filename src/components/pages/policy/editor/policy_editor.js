import { getAuthenticatedUser } from '../../../../util/auth_module';
import { GETPolicy, POSTPolicy, PUTPolicy } from '../../../../util/http_utils';
import InfoBox from '../../../common/info_box/info_box';

import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
    Button,
    Container,
    Row,
    Label,
    Input,
} from 'reactstrap';
import { UnControlled as CodeMirror } from 'react-codemirror2'
import classNames from 'classnames/bind';

import 'codemirror/lib/codemirror.css';

let qs = require('qs');


const PolicyEditor = ({ setTobbarLabel, label, setIsLoading }) => {
    const [alertText, setAlertText] = useState(null);
    const [parsingError, setParsingError] = useState(null);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [policy, setPolicy] = useState(null);
    const [policyName, setPolicyName] = useState('');
    const [codeState, setCodeState] = useState('');

    const history = useHistory();
    const location = useLocation();


    useEffect(() => {
        init();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    async function init() {
        setIsLoading(true);
        setTobbarLabel(label);
        let policyId = getPolicyIdFromURL();
        if (policyId !== undefined) {
            try {
                await load(policyId);
            }
            catch (error) {
                setAlertText(error.message);
            }
        }
        setIsLoading(false);
    }


    async function load(policyId) {
        let authUser = await getAuthenticatedUser();
        let policyFromServer = await GETPolicy(authUser.id_token, policyId);
        setPolicy(policyFromServer);
        setCodeState(policyFromServer.code);
        setPolicyName(policyFromServer.name);
    }


    async function save() {
        setIsLoading(true);
        setAlertText(null);
        try {
            let authUser = await getAuthenticatedUser();
            let updatedPolicy = policy !== null ?
                await PUTPolicy(
                    authUser.id_token, policyName, policy._id, codeState
                ) :
                await POSTPolicy(
                    authUser.id_token, policyName, codeState
                );
            setPolicy(updatedPolicy);
            setAlertText('The policy was saved successfully.');
            setParsingError(null);
            setUnsavedChanges(false);
        }
        catch (error) {
            setParsingError(error.message);
        }
        setIsLoading(false);
    }


    function close() {
        let locationDescriptor = {
            pathname: "policies",
        }
        history.push(locationDescriptor);
    }


    function getPolicyIdFromURL() {
        if (location.search !== undefined && location.search.length > 0) {
            let queryParams = qs.parse(location.search.substring(1));
            if (queryParams.policyId !== undefined) {
                return queryParams.policyId;
            }
        }
        return undefined;
    }


    function onNameChanged(event) {
        let newName = event.target.value;
        setPolicyName(newName);
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
                            for="policyName"
                            className="mr-2"
                        >
                            name:
                                </Label>
                        <Input
                            type="text"
                            id="policyName"
                            defaultValue={policy !== null ? policy.name : ''}
                            readOnly={false}
                            onChange={onNameChanged}
                        />

                    </div>
                    <div className=
                        {`ml-1 ${classNames({ 'd-none': !unsavedChanges })}`}
                    >
                        *
                    </div>
                </div>

                <div>
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
                        lineNumbers: true,
                    }}
                    onChange={(editor, data, value) => {
                        if (policy) {
                            setUnsavedChanges(value !== policy.code);
                        }
                        setCodeState(value);
                    }}
                />
            </Row>

            {parsingError &&
                <Row className="ml-1 mt-0 mr-1">
                    <CodeMirror
                        value={parsingError}
                        autoCursor={false}
                        autoScroll={true}
                        className='editor-border w-100'
                        options={{
                            lineNumbers: true,
                            autofocus: true,
                        }}
                        onFocus={(editor, event) => {
                            editor.setCursor(0, 0);
                        }}
                    />
                </Row>
            }
        </Container>
    )
}
export default PolicyEditor;