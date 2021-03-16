// /.netlify/functions/create_comment
let firebase = require('./firebase')

exports.handler = async function (event) {
  let db = firebase.firestore()
  let body = JSON.parse(event.body)
  let icebreakerText= body.text
  let userId = body.userId

  let newIcebreaker = {
      text: icebreakerText,
      userId: userId,
      // username: username,
      // created: firebase.firestore.FieldValue.serverTimestamp()
  }

//   newIcebreaker.timestamp = firebase.firestore.FieldValue.serverTimestamp()

  let docRef = await db.collection('icebreaker').add(newIcebreaker)
  console.log(`new icebreaker with ID ${docRef.id} created`)
  newIcebreaker.id = docRef.id
  newIcebreaker.likes = 0

  return {
    statusCode: 200,
    body: JSON.stringify(newIcebreaker)
  }
}