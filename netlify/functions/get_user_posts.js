// /.netlify/functions/get_posts
let firebase = require('./firebase')

function filter(icebreaker) {
  let filter
  if (iceBreakerData = XXXXXX) {           // Need logic here to identify the logged in users saved posts
    filter = 'Saved'              
  } else if (iceBreakerData = XXXXXX) {     // Need logic here to identify the logged in users submitted posts
    filter = 'Submitted'
  } else if (iceBreakerData = XXXXXX) {     // Need logic here to identify the logged in users liked posts
    filter = 'Liked'
  } else {
    filter = 'Random'
  }
  return filter
}

function renderIceBreakers(icebreakersArray) {
  for (let i=0; i<icebreaker.length; i++) {
    let icebreakerId = icebreaker[i].id                                // the ID for the given post
    let icebreaker = icebreaker[i].data()                          // the rest of the post data
    let icebreakerLikesQuery = await db.collection('icebreakerLikes')           // likes from Firestore
                              .where('icebreakerId', '==', icebreakerId) // for the given postId
                              .get()

    document.querySelector('.icebreakers').insertAdjacentHTML('beforeend', `
      <h1 class="inline-block mt-8 px-4 py-2 rounded-xl text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
        <i class="fas fa-car-side"></i>
        <span>${filter(icebreaker)}</span>
      </h1>
    `)


    for (let i = 0; i < icebreaker.length; i++) {
      let leg = ride[i]

      document.querySelector('.icebreaker').insertAdjacentHTML('beforeend', `
        <div class="border-4 p-4 my-4 text-left">
          <div class="flex">
            <div class="w-1/2">
              <h2 class="text-2xl py-1">${leg.passengerDetails.first} ${leg.passengerDetails.last}</h2>
              <p class="font-bold text-gray-600">${leg.passengerDetails.phoneNumber}</p>
            </div>
            <div class="w-1/2 text-right">
              <span class="rounded-xl text-white p-2">
                ${icebreakerLikesQuery} likes
              </span>
            </div>
          </div>
          <div class="mt-4 flex">
            <div class="w-1/2">
              <div class="text-sm font-bold text-gray-600">PICKUP</div>
              <p>${leg.pickupLocation.address}</p>
              <p>${leg.pickupLocation.city}, ${leg.pickupLocation.state} ${leg.pickupLocation.zip}</p>
            </div>
            <div class="w-1/2">
              <div class="text-sm font-bold text-gray-600">DROPOFF</div>
              <p>${leg.dropoffLocation.address}</p>
              <p>${leg.dropoffLocation.city}, ${leg.dropoffLocation.state} ${leg.dropoffLocation.zip}</p>
            </div>
          </div>
        </div>
      `)
    }
  }
}


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





