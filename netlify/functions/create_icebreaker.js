// /.netlify/functions/create_comment
let firebase = require('./firebase')

exports.handler = async function (event) {
  let db = firebase.firestore()
  let newIcebreaker = JSON.parse(event.body)

  newIcebreaker.timestamp = firebase.firestore.FieldValue.serverTimestamp()

  let docRef = await db.collection('icebreaker').add(newIcebreaker)
  newIcebreaker.id = docRef.id

  return {
    statusCode: 200,
    body: JSON.stringify(newIcebreaker)
  }
}