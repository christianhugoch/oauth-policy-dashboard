import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import {
    Button,
    Input,
    InputGroup,
} from 'reactstrap';

import './button_box.css'


const TableButtonBox = ({ searchCallback, openCallback }) => {
    const [searchValue, setSearchValue] = useState('');

    function searchValChanged(event) {
        setSearchValue(event.target.value);
    }

    return (
        <div className="button-box-dashboard p-2 flex-grow-1 d-flex justify-content-between">
            <Button onClick={() => {
                openCallback();
            }}
            >
                new
            </Button>
            <div className="d-inline-block">
                <InputGroup>
                    <Input
                        onChange={searchValChanged}
                        placeholder="search" />
                    <div className="input-group-append">
                        <Button
                            onClick={() => { searchCallback(searchValue) }}
                        >
                            <FaSearch />
                        </Button>
                    </div>
                </InputGroup>
            </div>
        </div>
    )
}
export default TableButtonBox;