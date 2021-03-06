// API url to this lambda funtion: /.netlify/functions/complete_todo
let firebase = require('./firebase')

exports.handler = async function(event) {
  let db = firebase.firestore()

  let body = JSON.parse(event.body)
  let icebreakerId = body.icebreakerId

  await db.collection('icebreakers').doc(icebreakerId).delete()
  console.log(`Used icebreaker with ID ${icebreakerId}`)

  return {
    statusCode: 200,
    body: JSON.stringify({success: true})
  }

}