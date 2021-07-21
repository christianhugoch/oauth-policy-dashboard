import PoliciesTable from './table/policies_table'
import InfoBox from '../../common/info_box/info_box';
import TableButtonBox from '../../common/table_button_box/button_box';
import TablePagination from '../../common/table_pagination/pagination';
import { getAuthenticatedUser } from '../../../util/auth_module';
import { GETPolicies } from '../../../util/http_utils'

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Container,
    Row,
    Col,
} from 'reactstrap';


const PolicyPage = ({ setTobbarLabel, label, setIsLoading }) => {
    const [allPolicies, setAllPolicies] = useState([]);
    const [policiesToShow, setPoliciesToShow] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [alertText, setAlertText] = useState(null);

    let pageSize = 10;
    const [pagesCount, setPagesCount] = useState(0);

    const history = useHistory();


    useEffect(() => {
        init();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    async function init() {
        setIsLoading(true);
        setTobbarLabel(label);
        let authUer = await getAuthenticatedUser();
        let policiesFromServer = await GETPolicies(authUer.id_token);
        if (policiesFromServer !== null) {
            setAllPolicies(policiesFromServer);
            setPoliciesToShow(policiesFromServer);
            setPagesCount(Math.ceil(policiesFromServer.length / pageSize));
        }
        setIsLoading(false);
    }


    function doSearch(searchValue) {
        if (allPolicies !== null) {
            let filteredPolicies = allPolicies.filter(current => current.name.includes(searchValue));
            setPoliciesToShow(filteredPolicies);
            setPagesCount(Math.ceil(filteredPolicies.length / pageSize));
        }
    }


    function openEditor() {
        let locationDescriptor = {
            pathname: '/policy_editor',
        }
        history.push(locationDescriptor);
    }


    return (
        <div>
            <Container >
                {alertText &&
                    <Row className="mb-0">
                        <InfoBox alertText={alertText} setAlertText={setAlertText} />
                    </Row>
                }
                <Row className="mr-0 ml-0 mt-1 mb-2">
                    <TableButtonBox
                        searchCallback={doSearch}
                        openCallback={openEditor} />
                </Row>
                <Row>
                    <Col>
                        <PoliciesTable
                            currentPage={currentPage}
                            pageSize={pageSize}
                            policiesToShow={policiesToShow}
                            setPoliciesToShow={setPoliciesToShow}
                            setAlertText={setAlertText}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <TablePagination
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            pagesCount={pagesCount}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
export default PolicyPage;