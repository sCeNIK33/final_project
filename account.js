firebase.auth().onAuthStateChanged(async function (user) {
    if (user) {
      // Signed in
      console.log('signed in')

      let response = await fetch(`/.netlify/functions/get_icebreaker?userId=${user.uid}`)
      let icebreakers = await response.json()
      console.log(icebreakers)

      for (let i=0; i<icebreakers.length; i++) {
        let icebreaker = icebreakers[i]
        let icebreakerId = icebreaker.id
        let icebreakerText = icebreaker.text

        document.querySelector('.icebreaker').insertAdjacentHTML('beforeend', `
          <div class="icebreaker-${icebreakerId} py-4 text-xl border-b-2 border-purple-500 w-full">
            ${icebreakerText}
            <a href="#" class="like-button block text-center text-white bg-green-500 mt-4 px-4 py-2 rounded">Liked</a>
            <a href="#" class="used-button block text-center text-white bg-green-500 mt-4 px-4 py-2 rounded">Used</a>
          </div>
        `)
       
        // add opacity to like button if icebreaker is already liked
        let docRef1 = await db.collection('like').doc(`${icebreakerId}`).get()
        if (docRef1.data()) {
          document.querySelector(`.icebreaker-${icebreakerId} .w-full`).classList.add('opacity-20')
        }

        // add opacity to like button when clicked
        document.querySelector(`.icebreaker-${icebreakerId} .like-button`).addEventListener('click', async function(event) {
          event.preventDefault()
          document.querySelector(`.icebreaker-${icebreakerId}`).classList.add('opacity-20')
        
          // make fetch POST request to backend to delete a liked icebreaker
          await fetch('/.netlify/functions/like', {
            method: 'POST',
            body: JSON.stringify({
              icebreakerId: icebreaker.id
            })
          })  
        })
      

        // add opacity to used button if icebreaker is already used
        let docRef2 = await db.collection('used_icebreaker').doc(`${icebreakerId}`).get()
        if (docRef2.data()) {
          document.querySelector(`.icebreaker-${icebreakerId} .w-full`).classList.add('opacity-20')
        }

        // add opacity to used button when clicked
        document.querySelector(`.icebreaker-${icebreakerId} .used-button`).addEventListener('click', async function(event) {
          event.preventDefault()
          document.querySelector(`.icebreaker-${icebreakerId}`).classList.add('opacity-20')

          // make fetch POST request to backend to delete a used icebreaker
          await fetch('/.netlify/functions/used_icebreaker', {
            method: 'POST',
            body: JSON.stringify({
              icebreakerId: icebreaker.id
            })
          })
        })
      }

     





      //sign out button
      document.querySelector('.sign-in-or-sign-out').innerHTML = `
  <button class="text-pink-500 underline sign-out">Sign Out</button>
  `
      document.querySelector('.sign-in-or-sign-out').addEventListener('click', function (event) {
        console.log('sign out clicked')
        firebase.auth().signOut()
        document.location.href = 'account.html'
      })
  
    } else {
      // Signed out
      console.log('signed out')
  
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