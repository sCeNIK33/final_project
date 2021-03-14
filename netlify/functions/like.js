// /.netlify/functions/like
let firebase = require('./firebase')

exports.handler = async function(event) {
  let db = firebase.firestore()
  let body = JSON.parse(event.body)
  let icebreakerId = body.icebreakerId
  let userId = body.userId
  
  console.log(`post: ${icebreakerId}`)
  console.log(`user: ${userId}`)

  let querySnapshot = await db.collection('likes')
                              .where('postId', '==', postId)
                              .where('userId', '==', userId)
                              .get()
  let numberOfLikes = querySnapshot.size

  if (numberOfLikes == 0) {
    await db.collection('likes').add({
      icebreakerId: icebreakerId,
      userId: userId
    })
    return { statusCode: 200 }
  } else {
    return { statusCode: 403 }
  }

}