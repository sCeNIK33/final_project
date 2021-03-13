// /.netlify/functions/get_posts
let firebase = require('./firebase')

exports.handler = async function(event) {
  let db = firebase.firestore()                             // define a variable so we can use Firestore
  let icebreakerData = []                                        // an empty Array
  
  let icebreakerQuery = await db.collection('icebreaker')             // posts from Firestore
                           .orderBy('created')              // ordered by created
                           .get()
  let icebreaker = icebreakerQuery.docs                               // the post documents themselves
  
  // loop through the post documents
  for (let i=0; i<icebreaker.length; i++) {
    let icebreakerId = icebreaker[i].id                                // the ID for the given post
    let icebreakerData = icebreaker[i].data()                          // the rest of the post data
    let likesQuery = await db.collection('likes')           // likes from Firestore
                             .where('postId', '==', postId) // for the given postId
                             .get()

 

    // add a new Object of our own creation to the postsData Array
    icebreakerData.push({
      id: postId,                                           // the post ID
      text: icebreakerData.text,                          // the image URL
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