const {client} = require('./client')
// code to build and initialize DB goes here
const {
  createUser,
  createProduct
  } = require('./index');

async function buildTables() {
  try {
    client.connect();
    console.log('tables are being dropped')
    // drop tables in correct order
    await client.query(`

    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    `);
    console.log('tables are being built')
    // build tables in correct order
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY key,
        "firstName" VARCHAR(255) NOT NULL,
        "lastName" TEXT NOT NULL,
        email VARCHAR(320) UNIQUE NOT NULL,
        "imageURL" TEXT default 'images/user-images/muffins.jpg',
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        "isAdmin" BOOLEAN DEFAULT false NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        "imageURL" text default 'images/30215.jpg',
        category VARCHAR(255) NOT NULL
      );
    `);

    console.log('the tables have been built')
  } catch (error) {
    throw error;
  }
}

async function populateInitialData() {
  console.log('creating users...');
  try {
    const usersToCreate = [
      { firstName: 'crystal', lastName: 'joyce', email: 'crystaljoyce@me.com', imageURL: '', username: 'crystal', password: 'password1', isAdmin: true},
      { firstName: 'walter', lastName: 'white', email: 'ilovescience@me.com', imageURL: '', username: 'bagsomoney', password: 'password2', isAdmin: false },
      { firstName: 'fred', lastName: 'flinstone', email: 'dinoman@me.com', imageURL: '', username: 'rocksrule', password: 'password3', isAdmin: false},
      { firstName: 'Amadeo', lastName: 'R.', email: 'starwebdeveloper@yahoo.com', imageURL: '', username: 'amadeo', password: 'password123', isAdmin: true},
      { firstName: 'Dolfo', lastName: 'lastname goes here', email: 'dolfo@aol.com', imageURL: '', username: 'dolfo', password: 'password123', isAdmin: true },
      { firstName: 'Samantha', lastName: 'Runyan', email: 'person@gmail.com', imageURL: '', username: 'username23', password: 'password123', isAdmin: true}
    ]
    const users = await Promise.all(usersToCreate.map(createUser));
    console.log('users created: ');
    console.log(users);
    console.log('finshed creating users');


    console.log('creating products')
    const productsToCreate = [
      { name: 'Spanish', description: 'Learn to speak Spanish', price: '75', imageURL: '', category: 'Online' },
      { name: 'French', description: 'Learn to speak French', price: '75', imageURL: '', category: 'Streaming' },
      { name: 'German', description: 'Learn to speak German', price: '75', imageURL: '', category: 'Video Call' },
      { name: 'Mandarin', description: 'Learn to speak Mandarin', price: '75', imageURL: '', category: 'Online' },
      { name: 'Italian', description: 'Learn to speak Italian', price: '75', imageURL: '', category: 'Streaming' },
      { name: 'Taglog', description: 'Learn to speak Taglog', price: '75', imageURL: '', category: 'Video Call' }

    ]
    const products = await Promise.all(productsToCreate.map(createProduct));
    console.log('products created: ');
    console.log(products);
    console.log('finsihed creating products');

  } catch (error) {
    console.log('error creating intital data');
    throw error;
  }
}

const buildDB = async () => {
  await buildTables()
    .then(populateInitialData)
    .catch(console.error);
}

module.exports = {buildDB};
