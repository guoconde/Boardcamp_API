import sqlstring from "sqlstring"

let setOffset
let setLimit

function offsetLimit(offset, limit) {

    setOffset = ''
    setLimit = ''

    if (offset) setOffset = `OFFSET ${sqlstring.escape(offset)}`

    if (limit) setLimit = `LIMIT ${sqlstring.escape(limit)}`
}

export {
    offsetLimit,
    setOffset,
    setLimit
}