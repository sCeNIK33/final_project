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
    let likesQuery = await db.collection('likes')           
                             .where('icebreakerId', '==', icebreakerId) 
                             .get()

 

    // add a new Object of our own creation to the postsData Array
    icebreakerData.push({
      id: icebreakerId,                                           // the post ID
      text: icebreaker.text,                          // the image URL
      username: icebreakerData.username,                          // the username
      likes: likesQuery.size,                               // number of likes                                // an Array of comments
    })
  }
  
  // return an Object in the format that a Netlify lambda function expects
  return {
    statusCode: 200,
    body: JSON.stringify(icebreakerData)
  }
}