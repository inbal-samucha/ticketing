import request from 'supertest';
import { app } from '../../app';

it('response with details about the current-user', async () =>{
const signupResponse = await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'password'
  })
  .expect(201);

// const cookie = await (globalThis as any).signin()


//in test there is no functionality included to manage cookie
const cookie = signupResponse.get('Set-Cookie');

const response = await request(app)
  .get('/api/users/currentuser')
  .set('Cookie', cookie)
  .send()
  .expect(200);

expect(response.body.currentUser.email).toEqual('test@test.com');
});


it('response with null if not authentication', async () =>{
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);
  
  expect(response.body.currentUser).toEqual(null);
  });