require('dotenv').config()
const namor = require("namor")
const bcrypt = require("bcryptjs")

const fastify = require('fastify')({
  logger: false
})

const { Voter } = require('./model');

fastify.get("/ping", async (request, reply) => {
  reply.send("pong")
})

// Declare a route
fastify.post('/register', async (request, reply) => {
  if (!request.body || !request.body.password || !request.body.nic || !request.body.phoneNumber) {
    reply.statusCode = 400
    return reply.send({ message: "Parameters missing" })
  }
  const { password, nic, phoneNumber } = request.body
  // ============= Validations/Verifications Start============
  // Example : ensure password is strong
  // Verify if the phone number is  registered under the nic by accessing external APIs
  // If verifcation/validations aren't satisfactory throw an error

  const existingVoter = await Voter.findOne({ nic }).exec();
  if (existingVoter) {
    reply.statusCode = 403
    return reply.send({ message: "Voter already registered" })
  }
  // ============= Validations/Verifications End============


  // Assume name comes from nic service after validation
  const nameFromNicService = namor.generate({
    words: 2,
    separator: " ",
    saltLength: 0
  })



  const hashedPw = await bcrypt.hash(password, 12);

  const voterData = {
    name: nameFromNicService,
    password: hashedPw,
    nic: nic,
    phoneNumber: phoneNumber,
    // Some logic should be done during validation/ verification process to know if this person is eligible or not
    status: "eligible" 
  }
  const voter = new Voter(voterData);


  await voter.save()
  console.log('Registered successfully');
  reply.statusCode = 201
  return reply.send({ message: "Registered successfully" })
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