// /.netlify/functions/like
let firebase = require('./firebase')

exports.handler = async function(event) {
  let queryStringUserId = event.queryStringParameters.userId

  let likesData = []
  let db = firebase.firestore()
  let querySnapshot = await db.collection('likes')
                              .where('userId', '==', queryStringUserId)
                              .get()

  let likes = querySnapshot.docs

  for (let i = 0; i < likes.length; i++) {
    let likeId = likes[i].id
    let like = likes[i].data()

    likesData.push({
      id: likeId,
      text: like.text
    })
  }

  // console.log(icebreakerId)

  return {
    statusCode: 200,
    body: JSON.stringify(likesData)
  }
}

