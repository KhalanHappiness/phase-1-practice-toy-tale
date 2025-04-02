let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection")
  const form = document.querySelector(".add-toy-form")
  

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });


  function fetchAllToys(){

    fetch('http://localhost:3000/toys')
  .then(resp => resp.json())
  .then(toys => {

    toyCollection.innerHTML = ''

    toys.forEach(toy =>{ renderToys(toy)}) 

  })

  }

  function renderToys(toy){

    let toycard = document.createElement("card")
      toycard.classList.add("card")

      toycard.innerHTML += `<p>${toy.name}</p> 
      <img src = ${toy.image} alt = "toy"  class = "toy-avatar">
      <p>${toy.likes} likes</p>
      <button class = "like-btn" data-id = "${toy.id}" >like</button>`
      

      toyCollection.appendChild(toycard)

       // Add event listener to like button
    const likeBtn = toycard.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => {
      const toyId = likeBtn.dataset.id;
      like(toyId, toy, toycard);
    });



  }

  function like(id, toy, cardElement) {
    const newLikes = toy.likes + 1;
    
    fetch(`http://localhost:3000/toys/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ likes: newLikes })
    })
    .then(resp => resp.json())
    .then(updatedToy => {
      // Update the likes display in the card
      const likesDisplay = cardElement.querySelector('p:nth-of-type(2)');
      likesDisplay.textContent = `${updatedToy.likes} likes`;
      // Update our local toy object
      toy.likes = updatedToy.likes;
    })
    .catch(error => {
      console.error('Error updating likes:', error);
    });
  }


  function addNewToy(){

    form.addEventListener('submit', function(e){

      e.preventDefault()

      const toyName = document.getElementById("name").value.trim()
      const toyImage = document.getElementById("toyImage").value.trim()

      // Validation
      if (!toyName || !toyImage) {
        alert("Please fill in all fields");
        return;
      }

       // Create toy object with proper property names
       const newToy = {
        name: toyName,
        image: toyImage,
        likes: 0
      };


      fetch('http://localhost:3000/toys', {

        method : "POST",
        headers:{
          "Content-Type" : "application/json"

        },

        body: JSON.stringify(newToy)
      })
      .then(resp => resp.json())
      .then(toy => {
        //render the new toy
        renderToys(toy)

        // Reset form
        form.reset();
        
        // Hide form after submission
        addToy = false;
        toyFormContainer.style.display = "none";
      })







    })




  }

  

  










fetchAllToys()
addNewToy()




});
