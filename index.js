const cors = require('cors')
const express = require('express')
const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [
    'comida-kafka-0.comida-kafka-headless.itzel2-itzelll.svc.cluster.local:9092'
    //    'localhost:9092',
    //	  'my-kafka-0.my-kafka-headless.kafka-adsoftsito.svc.cluster.local:9092'
  ]
});

const producer = kafka.producer()

const app = express();
app.use(cors());
app.options('*', cors());

const port = 8080;

app.get('/', (req, res, next) => {
  res.send('kafka api - itzelll');
});

const run = async (username) => {

  await producer.connect()
  //    await producer.send()
  await producer.send({
    topic: 'test',
    messages: [
      {
        'value': `{"name": "${username}" }`
      }
    ],
  })
  await producer.disconnect()
}

app.get('/like', (req, res, next) => {
  const username = req.query.name;
  res.send({ 'name': username });
  run(username).catch(e => console.error(`[example/producer] ${e.message}`, e))

});

//node - topic reaction 
const reaction = async (uId, oId, rId) => {
  await producer.connect()
  await producer.send({
    topic: 'reactions',
    messages: [
      {
        'value': `{"userId": "${uId}", "objectId": "${oId}", "reaction": "${rId}"}`
      }
    ],
  })
  await producer.disconnect()
}

app.get('/reaction', (req, res, next) => {
  const uId = req.query.userId;
  const oId = req.query.objectId;
  const rId = req.query.reactionId;
  res.send({ 'userId': uId, 'objectId': oId, 'reactionId': rId });
  reaction(uId, oId, rId).catch(e => console.error(`[example/producer] ${e.message}`, e))

});

//node - topic comments    uId, oId, message
const comments = async (uId, oId, comment) => {
  await producer.connect()
  await producer.send({
    topic: 'comments',
    messages: [
      {
        'value': `{"userId": "${uId}", "objectId": "${oId}", "comment": "${comment}"}`
      }
    ],
  })
  await producer.disconnect()
}

app.get('/comments', (req, res, next) => {
  const uId = req.query.userId;
  const oId = req.query.objectId;
  const comment = req.query.comment;
  res.send({ 'userId': uId, 'objectId': oId, 'comment': comment });
  reaction(uId, oId, comment).catch(e => console.error(`[example/producer] ${e.message}`, e))

});

app.listen(port, () =>
  console.log('listening on port ' + port
  ));