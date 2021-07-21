import {
    Pagination,
    PaginationItem,
    PaginationLink,
} from 'reactstrap';


const TablePagination = ({ currentPage, setCurrentPage, pagesCount }) => {
    return (
        <Pagination aria-label="Page navigation example">
            <PaginationItem>
                <PaginationLink first href="#" />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink previous href="#" />
            </PaginationItem>

            {[...Array(pagesCount)].map((page, i) =>
                <PaginationItem active={i === currentPage} key={i}>
                    <PaginationLink onClick={() => { setCurrentPage(i) }} href="#">
                        {i + 1}
                    </PaginationLink>
                </PaginationItem>
            )}

            <PaginationItem>
                <PaginationLink next href="#" />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink last href="#" />
            </PaginationItem>
        </Pagination>
    )
}
export default TablePagination;