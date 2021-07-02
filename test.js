const { saveVarible } = require('./index');
const page = 10;
saveVarible(`${__dirname}/test.json`, page);

const userArr = [
  {
    name: 'xiaoming',
    age: 18,
    girlFriend: {
      name: 'azhen'
    }
  },
  {
    name: 'xiaohong',
    age: 18,
    books: ['book1', 'book2']
  }
];
saveVarible(`${__dirname}/test1.json`, userArr);

const user = {
  name: 'xiaoming',
  hobby: ['Basketball', 'Football'],
  address: {
    beijing: {
      road: 'fengqiao'
    }
  },
  age: 18
};
saveVarible(`${__dirname}/test2.json`, user);