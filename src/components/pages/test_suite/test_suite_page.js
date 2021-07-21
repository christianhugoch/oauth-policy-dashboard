import TestsTable from './table/tests_table';
import InfoBox from '../../common/info_box/info_box';
import TableButtonBox from '../../common/table_button_box/button_box';
import TablePagination from '../../common/table_pagination/pagination';
import { getAuthenticatedUser } from '../../../util/auth_module';
import { GETPolicyTestSuites } from '../../../util/http_utils';

import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Container,
    Row,
    Col
} from 'reactstrap';


const TestSuitePage = ({ setTobbarLabel, label, setIsLoading }) => {
    const [testSuites, setTestSuites] = useState([]);
    const [testSuitesToShow, setTestSuitesToShow] = useState([]);
    const [alertText, setAlertText] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);

    const history = useHistory();
    const [pagesCount, setPagesCount] = useState(0);
    let pageSize = 10;


    useEffect(() => {
        init();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    async function init() {
        setIsLoading(true);
        setTobbarLabel(label);
        try {
            let authUer = await getAuthenticatedUser();
            let suitesFromServer = await GETPolicyTestSuites(authUer.id_token);
            setTestSuites(suitesFromServer);
            setTestSuitesToShow(suitesFromServer);
            setPagesCount(Math.ceil(suitesFromServer.length / pageSize));

        }
        catch (error) {
            console.log('ERROR while loading suites');
        }
        setIsLoading(false);
    }


    function doSearch(searchValue) {
        if (testSuites !== null) {
            let filtered = testSuites.filter(current => current.name.includes(searchValue));
            setTestSuitesToShow(filtered);
            setPagesCount(Math.ceil(filtered.length / pageSize));
        }
    }

    function openEditor() {
        let locationDescriptor = {
            pathname: '/test_suite_editor',
        }
        history.push(locationDescriptor);
    }

    return (
        <div>
            <Container>
                {alertText &&
                    <Row className="mb-0">
                        <InfoBox alertText={alertText} setAlertText={setAlertText} />
                    </Row>
                }
                <Row className="mr-0 ml-0 mt-1 mb-2">
                    <TableButtonBox
                        searchCallback={doSearch}
                        openCallback={openEditor}
                    />
                </Row>
                <Row>
                    <Col>
                        <TestsTable
                            currentPage={currentPage}
                            pageSize={pageSize}
                            testSuites={testSuitesToShow}
                            setTestSuites={setTestSuitesToShow}
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
export default TestSuitePage;