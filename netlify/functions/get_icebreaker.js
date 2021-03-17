// /.netlify/functions/get_posts
let firebase = require('./firebase')


exports.handler = async function(event) {
    let queryStringUserId = event.queryStringParameters.userId

  let icebreakerData = []                                    
  let db = firebase.firestore()
  

  

  let querySnapshot = await db.collection('icebreaker').get()             // posts from Firestore
                          //  .where('userId', "==", queryStringUserId)     
                          //  .get()
  let icebreakers = querySnapshot.docs                               // the post documents themselves
  
  // loop through the icebreaker documents
  for (let i=0; i<icebreakers.length; i++) {
    let icebreakerId = icebreakers[i].id                         
    let icebreaker = icebreakers[i].data()
    console.log(icebreaker)
    // let liked = await db.collection(`likes`).doc(`${icebreakerId}-${user.uid}`).get()
    //   let opacityClass = ''
    //   if (liked) {
    //     opacityClass = 'opacity-20'
    //   }               
    
    // let likeDocRef = await db.collection('likes').doc(`${icebreakerId}-${user.uid}`).get()
    //   let liked = likeDocRef.data()
    //   let opacityClass = ''
    //   if (liked) {
    //     opacityClass = 'opacity-20'
    //   }                         
    // let likesQuery = await db.collection('likes')           
    //                          .where('icebreakerId', '==', icebreakerId) 
    //                          .get()

 

    // add a new Object of our own creation to the postsData Array
    icebreakerData.push({
      id: icebreakerId,                                           // the post ID
      text: icebreaker.text,                          
      // likes: likesQuery                               // number of likes                                // an Array of comments
    })
  }
  
  // return an Object in the format that a Netlify lambda function expects
  return {
    statusCode: 200,
    body: JSON.stringify(icebreakerData)
  }
}