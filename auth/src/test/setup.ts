import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// declare global {
//   namespace NodeJS {
//     interface Global {
//       signin(): Promise<string[]>;
//     }
//   }
// }

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY='asaa';

  mongo = new MongoMemoryServer();
  await mongo.start();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});


//in test there is no functionality included to manage cookie
// (globalThis as any).signin = async () => {
//   const email = ' test@test.com';
//   const password = 'password';

//   const signupResponse = await request(app)
//     .post('/api/users/signup')
//     .send({email, password})
//     .expect(201);

//   const cookie = signupResponse.get('Set-Cookie');

//   return cookie;
// };
