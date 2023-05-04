require('dotenv').config()

const fastify = require('fastify')({
  logger: false
})

const { Voter } = require('./model');

fastify.get("/ping", async (request, reply) => {
  reply.send("pong")
})

// Declare a route
fastify.get('/voters/:nic/status', async (request, reply) => {
  const { nic } = request.params;

  const voter = await Voter.findOne({ nic }).exec()

  console.log(voter)

  if (!voter) {
    reply.statusCode = 404
    return reply.send({ message: "Voter is not registered" })
  }




  console.log('Successfully fetched voter status');
  reply.statusCode = 200
  return reply.send({ message: "Successfully fetched voter status", data: { status: voter.status }  })
})

// Run the server!
fastify.listen({ port: process.env.PORT }, function (err, address) {

  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`Server running on : ${address}`)
  // Server is now listening on ${address}
})