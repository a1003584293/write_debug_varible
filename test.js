const { saveVarible } = require('./index');
const page = 10
saveVarible(`${__dirname}/test.json`, page);
// saveVarible(`${__dirname}/test.json`, {});
saveVarible(`${__dirname}/test1.json`, { name: 'xiaoming' });