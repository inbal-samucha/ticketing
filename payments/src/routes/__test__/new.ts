import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@inbaltickets/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

jest.mock('../../stripe');

it('it return a 404 when purchasing an order that does not exist', async () => {
 await request(app)
  .post('/api/payments')
  .set('Cookie', global.signin())
  .send({
    token: 'dsad',
    orderId: new mongoose.Types.ObjectId().toHexString()
  })
  .expect(404);
});

it('it return a 404 when purchasing an order that does not belong to the user', async () => {
 const order = Order.build({
  id: new mongoose.Types.ObjectId().toHexString(),
  userId: new mongoose.Types.ObjectId().toHexString(),
  version: 0,
  price: 20,
  status: OrderStatus.Created
 });
 await order.save();

await request(app)
 .post('/api/payments')
 .set('Cookie', global.signin())
 .send({
   token: 'dsad',
   orderId: order.id
 })
 .expect(404);

});

it('it return a 400 when purchasing a cancelled order', async () => {
 const userId = new mongoose.Types.ObjectId().toHexString();

 const order = Order.build({
  id: new mongoose.Types.ObjectId().toHexString(),
  userId: userId,
  version: 0,
  price: 20,
  status: OrderStatus.Created
 });
 await order.save();

 await request(app)
 .post('/api/payments')
 .set('Cookie', global.signin(userId))
 .send({
   token: 'dsad',
   orderId: order.id
 })
 .expect(400);

});

it('it return a 201 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
 
  const order = Order.build({
   id: new mongoose.Types.ObjectId().toHexString(),
   userId: userId,
   version: 0,
   price: 20,
   status: OrderStatus.Created
  });
  await order.save();
 
  await request(app)
  .post('/api/payments')
  .set('Cookie', global.signin(userId))
  .send({
    token: 'tok_visa',
    orderId: order.id
  })
  .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual('usd');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: chargeOptions.id
  });

  expect(payment).not.toBeNull();
 });

