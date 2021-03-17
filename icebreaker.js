firebase.auth().onAuthStateChanged(async function(user) {
  if (user) {
    // Signed in
    console.log('signed in')


    document.querySelector('.sign-in-or-sign-out').innerHTML = `
      <button class="text-pink-500 underline sign-out">Sign Out</button>
    `
    document.querySelector('.sign-in-or-sign-out').addEventListener('click', function(event) {
      console.log('sign out clicked')
      firebase.auth().signOut()
      document.location.href = 'index.html'
    })

      let db = firebase.firestore()
       // Ensure the signed-in user is in the users collection
       db.collection('users').doc(user.uid).set({
        name: user.displayName,
        email: user.email
      })
      
    document.querySelector('form').addEventListener('submit', async function(event) {
      event.preventDefault()

      let icebreakerText = document.querySelector('#icebreaker').value
     

      if (icebreakerText.length > 0) {
        // make fetch POST request to backend to create a new icebreaker
        let response = await fetch(`/.netlify/functions/create_icebreaker`, {
          method: 'POST',
          body: JSON.stringify({
            text: icebreakerText,
            userId: user.uid
          })
        })
        let icebreaker = await response.json()
        let icebreakerId = response.id

        document.querySelector('.icebreakers').insertAdjacentHTML('afterend', `
          <div class="icebreaker-${icebreakerId} py-4 text-xl border-b-2 border-purple-500 w-full">
          <div>  
          <a href="#" class="like-button bg-purple-500 p-2 text-sm text-white font-bold">Like</a>
            ${icebreakerText}
            </div>
          
          </div>
          
        `)

        document.querySelector(`.icebreaker-${icebreaker.id} .like-button`).addEventListener('click', async function(event) {
          event.preventDefault()
          document.querySelector(`.icebreaker-${icebreaker.id}`).classList.add('opacity-20')
          
          let currentUserId = firebase.auth().currentUser.uid

          let querySnapshot = await db.collection(`likes`).where(`icebreakerId`,`==`,icebreakerId)
                          .where(`userId`,`==`, currentUserId).get()
          if (querySnapshot.size ==0) {
            await db.collection(`likes`).add({
              icebreakerId: icebreakerId,
              userId: currentUserId
            })
          }
          

          // make fetch POST request to backend to delete a unliked icebreaker
          // await fetch('/.netlify/functions/used_icebreaker', {
          //   method: 'POST',
          //   body: JSON.stringify({
          //     icebreakerId: icebreaker.id
          //   })
          // })
        })

        document.querySelector('#icebreaker').value = ''
      }
    })
 
    // Show icebreakers
    let response = await fetch(`/.netlify/functions/get_icebreaker?userId=${user.uid}`)
    let icebreakers = await response.json()
    console.log(icebreakers)

    for (let i=0; i<icebreakers.length; i++) {
      let icebreaker = icebreakers[i]
      let icebreakerId = icebreaker.id
      let icebreakerText = icebreaker.text
      

      document.querySelector('.icebreakers').insertAdjacentHTML('afterend', `
        <div class="icebreaker-${icebreakerId} py-4 text-xl border-b-2 border-purple-500 w-full">
          <a href="#" class="like-button bg-purple-500 p-2 text-sm text-white font-bold">Like</a>
          ${icebreakerText}
        </div>
      `)

      document.querySelector(`.icebreaker-${icebreakerId} .like-button`).addEventListener('click', async function(event) {
        event.preventDefault()
        document.querySelector(`.icebreaker-${icebreakerId}`).classList.add('opacity-20')
        let currentUserId = firebase.auth().currentUser.uid

        let querySnapshot = await db.collection(`likes`).where(`icebreakerId`,`==`,icebreakerId)
                        .where(`userId`,`==`, currentUserId).get()
        if (querySnapshot.size ==0) {
          await db.collection(`likes`).add({
            icebreakerId: icebreakerId,
            userId: currentUserId
          })
          
        }


        // make fetch POST request to backend to delete a completed todo
        // await fetch('/.netlify/functions/used_icebreaker', {
        //   method: 'POST',
        //   body: JSON.stringify({
        //     icebreakerId: icebreaker.id
        //   })
        // })
      })
    }
    


    //sign out button
    
  } else {
    // Signed out
  
    console.log('signed out')
    document.querySelector('form').classList.add('hidden')


    document.querySelector('.image').insertAdjacentHTML('afterend', `
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
      signInSuccessUrl: 'index.html'
    }

    // Starts FirebaseUI Auth
    ui.start('.sign-in-or-sign-out', authUIConfig)
  }
})
