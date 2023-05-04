require('dotenv').config()
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs")

const fastify = require('fastify')({
  logger: false
})

const { Voter } = require('./model');

fastify.get("/login/ping", async (request, reply) => {
  reply.send("pong")
})

// Declare a route
fastify.post('/login', async (request, reply) => {
  if (!request.body || !request.body.password || !request.body.nic) {
    reply.statusCode = 400
    reply.send({ message: "Parameters missing" })
  }
  const { password, nic } = request.body
  // ============= Validations/Verifications Start============
  const existingVoter = await Voter.findOne({ nic }).exec();
  if (!existingVoter) {
    reply.statusCode = 400
    return reply.send({ message: "Voter is not registered" })
  }
  // ============= Validations/Verifications End============

  const matches = await bcrypt.compare(password, existingVoter.password);
  if (!matches) {
    reply.statusCode = 403
    return reply.send({ message: "Credentials are incorrect" })
  }


  const token = jwt.sign({
    name: existingVoter.name,
    nic: existingVoter.nic,
    phoneNumber: existingVoter.phoneNumber,
    status: existingVoter.status
  }, process.env.JWT_SECRET);

  console.log("Logged in successfully")
  reply.statusCode = 200
  return reply.send({ message: "Logged in successfully", token })
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