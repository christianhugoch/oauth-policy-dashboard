import { getSortCb, SortColumn, SortOrder } from '../../../../util/table_sort_util';
import { getAuthenticatedUser } from '../../../../util/auth_module';
import { DELETETestSuite } from '../../../../util/http_utils';

import { useState } from 'react';
import { FaSearch, FaPencilAlt, FaTrash, FaSort } from 'react-icons/fa';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { Table, Button } from 'reactstrap';


const TestsTable = (props) => {
    const { currentPage, pageSize,
        testSuites, setTestSuites, setAlertText } = props;

    const [sortOrders, setSortOrders] = useState(
        new Map([
            [SortColumn.NAME, SortOrder.ASCENDING],
            [SortColumn.CREATED_AT, SortOrder.ASCENDING],
            [SortColumn.LAST_MODIFIED, SortOrder.ASCENDING]
        ])
    );
    const [currentSortColumn, setSortColumn] = useState(SortColumn.NAME);


    function sortClicked(event) {
        let sortColumn = event.target.id;
        let sortOrder = getSortOrder(sortColumn);
        doSort(getSortCb(sortColumn, sortOrder));
        updateSortState(sortColumn, sortOrder);
    }


    function getSortOrder(columnId) {
        let oldOrder = sortOrders.get(columnId);
        if (oldOrder === undefined) {
            setAlertText('unable to sort');
            return;
        }
        if (columnId !== currentSortColumn) {
            return oldOrder;
        }
        return oldOrder === SortOrder.ASCENDING ?
            SortOrder.DESCENDING : SortOrder.ASCENDING;
    }


    function doSort(sortCb) {
        setTestSuites([...testSuites].sort(sortCb));
    }


    function updateSortState(sortColumn, sortOrder) {
        sortOrders.set(sortColumn, sortOrder);
        setSortOrders(new Map(sortOrders));
        setSortColumn(sortColumn);
    }


    async function handleDelete(suite) {
        try {
            let user = await getAuthenticatedUser();
            await DELETETestSuite(suite._id, user.id_token);
            let copy = testSuites.filter(
                current => current._id !== suite._id);
            setTestSuites(copy);
        }
        catch (error) {
            setAlertText(error.message);
        }
    }


    return (
        <Table striped className="table-border">
            <thead>
                <tr>
                    <th>#</th>
                    <th
                        id={SortColumn.NAME}
                        onClick={sortClicked}
                        className="text-center"
                    >
                        Policy<FaSort className="pl-2" />
                    </th>
                    <th
                        id={SortColumn.CREATED_AT}
                        onClick={sortClicked}
                        className="text-center"
                    >
                        Created at<FaSort className="pl-2" />
                    </th>
                    <th
                        id={SortColumn.LAST_MODIFIED}
                        onClick={sortClicked}
                        className="text-center"
                    >
                        Last edit<FaSort className="pl-2" />
                    </th>
                    <th>Show</th>
                    <th>Edit</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {testSuites.slice(
                    currentPage * pageSize,
                    (currentPage + 1) * pageSize
                )
                    .map((suite, index) => {
                        return (
                            <tr className="hover-row">
                                <th
                                    className="text-center align-middle p-1"
                                    scope="row"
                                >
                                    {index}
                                </th>
                                <td className="text-center align-middle p-1">
                                    {suite.name}
                                </td>
                                <td className="text-center align-middle p-1">
                                    <Moment format="YYYY/MM/DD hh:mm:ss">
                                        {suite.createdAt}
                                    </Moment>
                                </td>
                                <td className="text-center align-middle p-1">
                                    {suite.lastModified ?
                                        <Moment format="YYYY/MM/DD hh:mm:ss">
                                            {suite.lastModified}
                                        </Moment>
                                        :
                                        <div>-</div>}
                                </td>
                                <td className="text-center align-middle p-1">
                                    <Link
                                        className="btn btn-default"
                                        to={`/test_suite_editor?test_suite_id=${suite._id}`}
                                    >
                                        <FaSearch aria-hidden="true" />
                                    </Link>
                                </td>
                                <td className="text-center align-middle p-1">
                                    <Link
                                        className="btn btn-default"
                                        to={`/test_suite_editor?test_suite_id=${suite._id}`}
                                    >
                                        <FaPencilAlt />
                                    </Link>
                                </td>
                                <td className="text-center align-middle p-1">
                                    <Button
                                        onClick={() => { handleDelete(suite) }}
                                    >
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        )
                    })}
            </tbody>
        </Table>
    )
}
export default TestsTable;