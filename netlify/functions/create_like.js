// /.netlify/functions/create_comment
let firebase = require('./firebase')

exports.handler = async function (event) {



  await db.collection('likes').doc(`${icebreakerId}-${user.uid}`).set({})
          
  let currentUserId = firebase.auth().currentUser.uid

  let querySnapshot = await db.collection(`likes`).where(`icebreakerId`,`==`,icebreakerId)
                  .where(`userId`,`==`, currentUserId).get()
  if (querySnapshot.size ==0) {
    await db.collection(`likes`).add({
      icebreakerId: icebreakerId,
      userId: currentUserId,
      text: icebreakerText
    })

    return {
        statusCode: 200,
        body: JSON.stringify(newIcebreaker)
    }
  }
}