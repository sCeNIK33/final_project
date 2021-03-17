firebase.auth().onAuthStateChanged(async function (user) {
  if (user) {
    // Signed in
    console.log('signed in')

    //sign out button
    document.querySelector('.sign-in-or-sign-out').innerHTML = `
      <button class="text-pink-500 underline sign-out">Sign Out</button>
    `
    document.querySelector('.sign-in-or-sign-out').addEventListener('click', function (event) {
      console.log('sign out clicked')
      firebase.auth().signOut()
      document.location.href = 'account.html'
    })

    let db = firebase.firestore()
       // Ensure the signed-in user is in the users collection
       db.collection('likes').doc(user.uid).get({
      })

   
    let response = await fetch(`/.netlify/functions/like?userId=${user.uid}`)
    let icebreakers = await response.json()
    console.log(icebreakers)

    for (let i=0; i<icebreakers.length; i++) {
      let icebreaker = icebreakers[i]
      let icebreakerId = icebreaker.id
      let icebreakerText = icebreaker.text

      document.querySelector('.icebreaker').insertAdjacentHTML('afterend', `
        <div class="icebreaker-${icebreakerId} py-4 text-xl border-b-2 border-purple-500 w-full">
          <a href="#" class="like-button bg-purple-500 p-2 text-sm text-white font-bold">Remove</a>
          ${icebreakerText}
        </div>
      `)
      
      // add opacity to like button if icebreaker is already liked
      let docRef = await db.collection('likes').doc(`${icebreakerId}`).get()
      if (docRef.data()) {
        document.querySelector(`.icebreaker-${icebreakerId} .w-full`).classList.add('opacity-20')
      }

      // add opacity to like button when clicked
      document.querySelector(`.icebreaker-${icebreakerId} .like-button`).addEventListener('click', async function(event) {
        event.preventDefault()
        document.querySelector(`.icebreaker-${icebreakerId}`).classList.add('opacity-20')
      
        // make fetch POST request to backend to delete a liked icebreaker
        await fetch('/.netlify/functions/removeLike', {
          method: 'POST',
          body: JSON.stringify({
            icebreakerId: icebreaker.id
          })
        })  
      })
    }



  } else {
    // Signed out
    console.log('signed out')

  document.querySelector('.liked').insertAdjacentHTML('afterend', `
  <div>
    <p class= "text-center text-4xl text-red-500"> Please join our community to take part in our fantastic icebreakers! Please sign in or create an account above!
  </p>
    </div>`)

    // Initializes FirebaseUI Auth
    let ui = new firebaseui.auth.AuthUI(firebase.auth())

    // FirebaseUI configuration
    let authUIConfig = {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: 'account.html'
    }

    // Starts FirebaseUI Auth
    ui.start('.sign-in-or-sign-out', authUIConfig)
  }
})