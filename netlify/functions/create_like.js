// /.netlify/functions/create_comment
let firebase = require('./firebase')

exports.handler = async function (event) {
  let db = firebase.firestore()
  let body = JSON.parse(event.body)
  console.log(body)
  let icebreakerId = body.icebreakerId
  let userId = body.userId
  let icebreakerText = body.text

  let newLike = {
    icebreakerId: icebreakerId,
    userId: userId,
    text: icebreakerText
  }
console.log('create like')
console.log(newLike)

  let docRef = await db.collection('likes').add(newLike)
  // let docRef = await db.collection('likes').doc(`${icebreakerId}-${userId}`).set(newLike)

  newLike.id = docRef.id

  // await db.collection('likes').doc(`${icebreakerId}-${user.uid}`).set({})
          
  // // let currentUserId = firebase.auth().currentUser.uid

  // let querySnapshot = await db.collection(`likes`).where(`icebreakerId`,`==`,icebreakerId)
  //                 .where(`userId`,`==`, currentUserId).get()
  // if (querySnapshot.size ==0) {
  //   await db.collection(`likes`).add({
  //     icebreakerId: icebreakerId,
  //     userId: userId,
  //     text: icebreakerText
  //   })

    return {
        statusCode: 200,
        body: JSON.stringify(newLike)
    }
  
}