import sqlstring from "sqlstring"

let setOrder

function sortItems(order, desc, sortByFilters) {

    setOrder = ''

    if (order) setOrder = `ORDER BY ${sqlstring.escape(sortByFilters[order])}`

    if (desc === 'true' && order) setOrder = `ORDER BY ${sqlstring.escape(sortByFilters[order])} DESC`
}

export {
    sortItems,
    setOrder
}