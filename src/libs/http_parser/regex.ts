export const HTTP_METHOD = /^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS|CONNECT|TRACE|LOCK|UNLOCK|PROPFIND|PROPPATCH|COPY|MOVE|MKCOL|MKCALENDAR|ACL|SEARCH)\s+/;
export const END_BLOCK = /###*/;
export const REQUEST_NAME_BLOCK = /^\/\/\s@name\s+/;
export const TEST_START = /^\/\/\s@test\sstart\s+/;
export const TEST_DESC = /^\/\/\s@test\sdesc\s+/;
export const TEST_END = /^\/\/\s@test\send\s+/
export const TEST_CONTENT = /^expect\(*/;
