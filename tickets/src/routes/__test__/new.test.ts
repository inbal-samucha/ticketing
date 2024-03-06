import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for post request', async () =>{
  const response = await request(app)
    .post('/api/tickets')
    .send({});
  
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () =>{
  await request(app)
    .post('/api/tickets')
    .send({}) 
    .expect(401)
});

it('returns a status other then 401 is the user is sign in', async () =>{
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({}) 
  
  expect(response.status).not.toEqual(401);
});

it('returns an error if invalid title is provided', async () =>{
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10
    })
    .expect(400); 
});

it('returns an error if invalid price is provided', async () =>{
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'title',
      price: -10
    })
    .expect(400); 
});

it('create a ticket with valid inputes', async () =>{
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0); //because after each test we delete all th collection in db
  
  const title = 'title';

  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: title,
    price: 20
  })
  .expect(201); 

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual(title);
});

it('published an event', async () => {
  const title = 'title';

  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: title,
    price: 20
  })
  .expect(201); 

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});