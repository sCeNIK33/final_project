// /.netlify/functions/get_posts
let firebase = require('./firebase')


//do we need to make this an if statement so user id pulls theirs but if not a user then pulls everything?
exports.handler = async function(event) {
    let queryStringUserId = event.queryStringParameters.userId

    let icebreakerData = []                                      
    let db = firebase.firestore()

    let querySnapshot = await db.collection('icebreaker')             // posts from Firestore
                            .where('userId', "==", queryStringUserId)              // ordered by created
                            .get()
    let icebreakers = querySnapshot.docs                               // the post documents themselves
    
    // loop through the post documents
    for (let i=0; i<icebreakers.length; i++) {
      let icebreakerId = icebreakers[i].id                         
      let icebreaker = icebreakers[i].data()                         
    
      icebreakerData.get({
        id: icebreakerId,
        text: icebreaker.text
      })
    }
  
  // return an Object in the format that a Netlify lambda function expects
  return {
    statusCode: 200,
    body: JSON.stringify(icebreakerData)
  }
}