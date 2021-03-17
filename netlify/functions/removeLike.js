// API url to this lambda funtion: /.netlify/functions/complete_todo
let firebase = require('./firebase')

exports.handler = async function(event) {
  let db = firebase.firestore()

  let body = JSON.parse(event.body)
  let likeId = body.likeId

  await db.collection('likes').doc(likeId).delete()
  console.log(`deleted like with ID ${likeId}`)

  return {
    statusCode: 200,
    body: JSON.stringify({success: true})
  }

}