export const SortOrder = {
    ASCENDING: 1,
    DESCENDING: 2,
};
export const SortColumn = {
    NAME: 'name',
    CREATED_AT: 'created',
    LAST_MODIFIED: 'modified',
};


export function getNameSorter(sortOrder) {
    return (suiteA, suiteB) => {
        let upperA = suiteA.name.toUpperCase(),
            upperB = suiteB.name.toUpperCase();;
        return sortOrder === SortOrder.ASCENDING ?
            upperA.localeCompare(upperB) : upperB.localeCompare(upperA);
    }
}


export function getDateSorter(sortOrder, sortColumn) {
    let propertyName = sortColumn === SortColumn.CREATED_AT ?
        'createdAt' : 'lastModified';
    return (suiteA, suiteB) => {
        let dateA = suiteA[propertyName];
        let dateB = suiteB[propertyName];
        let timeA = dateA !== undefined ? Date.parse(suiteA[propertyName]) : 0,
            timeB = dateB !== undefined ? Date.parse(suiteB[propertyName]) : 0;
        return sortOrder === SortOrder.ASCENDING ?
            timeA - timeB :
            timeB - timeA;
    }
}


export function getSortCb(sortColumn, sortOrder) {
    if (sortColumn === SortColumn.NAME) {
        return getNameSorter(sortOrder);
    }
    else {
        return getDateSorter(sortOrder, sortColumn);
    }
}