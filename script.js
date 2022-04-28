let searchbtn = document.getElementById("searchbtn");
let input = document.getElementById("input");
let resultDisplay = document.getElementById("result");
let popup = document.getElementById("popup");
let close = document.getElementById("close");
let filter = document.getElementById("filter");
let title = document.getElementById("title");
let year = document.getElementById("year");
let description = document.getElementById("description");
let picture = document.getElementById("bigposter")
let value;
let page = 1;
let i = 0;
let b = 0;
var max = 0;



const textTransform = (element) =>{
  let transform = element.split(' ');
  transform = transform.filter(word => word.length > 0);
  transform = transform.join("+");

  return transform;
};


["click", "keypress"].forEach(ev =>{
  window.addEventListener(ev, function(e){
    if(e.target.id === "searchbtn" || e.key === "Enter"){
      resultDisplay.scrollTo(0, 0);
      page = 1;
      i = 0;
      resultDisplay.innerHTML = " ";
      value = textTransform(input.value);
      showmovie();


      function showmovie(){
        fetch(`http://www.omdbapi.com/?s=${value}&page=${page}&apikey=${key}`)
          .then((response) => {
            console.log("step1");
            return response.json();
          })
          .then((response) => {
            console.log("step2")
            console.log(response)
            max = response.totalResults;
            if(response.Response === "False"){
              resultDisplay.innerHTML = " ";
              resultDisplay.insertAdjacentHTML("beforeend", `
            <div>
              <p style="display:block; text-align:center; margin-top:50px">Merci de mieux présicer votre recherche.</p>
          </div>
          
          `);
            } else {
              b = 0;
              response.Search.forEach(movie => { 
                i ++;
                if(movie.Poster === "N/A"){
                  resultDisplay.insertAdjacentHTML("beforeend", `
                  <div class="resultmovie">
                    <div>
                      <img src="https://www.reelviews.net/resources/img/default_poster.jpg" class="poster">
                    </div>
                    <div class="info">
                      <h3>${movie.Title}</h3>
                      <p>${movie.Year}</p>
                      <button id="${movie.imdbID}" class="read">Read More</button>
                    </div>
                  </div>
                  `);
                } else {
                  resultDisplay.insertAdjacentHTML("beforeend", `
                  <div class="resultmovie">
                    <div>
                      <img src="${movie.Poster}" class="poster">
                    </div>
                    <div class="info">
                      <h3>${movie.Title}</h3>
                      <p>${movie.Year}</p>
                      <button id="${movie.imdbID}" class="read">Read More</button>
                    </div>
                  </div>
                  `);
                }
              });
              resultDisplay.insertAdjacentHTML("beforeend", `
                <div id="end">
                <img src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" id="load">
                </div>
                `);
              page ++;
              document.querySelectorAll(".resultmovie").forEach(movie => {
                observer.observe(movie);
              });  
              let end = document.getElementById('end');
              const endPage = new IntersectionObserver(
                entries => {
                  entries.forEach(entry => {
                    console.log(entry);
                    if(entry.isIntersecting && i < Number(max) && b === 0){
                      setTimeout(function(){
                        end.remove();
                        showmovie(page);
                      },500);
                    } else if(entry.isIntersecting && i === Number(max) && b === 0){
                      b = 1;
                      page = 1;
                      i = 0;
                      end.remove();
                      resultDisplay.insertAdjacentHTML("beforeend", `
                      <div>
                        <p style="display:block; text-align:center; margin:50px 0">Fin de la recherche, ${max} recherches en tout trouvées.</p>
                      </div>`);
                    }
                  })
                },
                {
                  threshold: 0.5,
                }
              );
              endPage.observe(end);            
            }

          })
          .catch((error) => {
            console.error('Response error:', error.message);
          });
      };
    
    
        
      }


  });  
});







window.addEventListener("load", function(e){
  input.value = "";
})

/*Intersection Observer*/

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("show");
      }
    })
  },
  {
    threshold: 0.5,
  }
);


window.addEventListener("click", function(e){
  if(e.target.localName === "button"){
    fetch(`http://www.omdbapi.com/?i=${e.target.id}&apikey=${key}`)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (response.Poster === "N/A"){
        picture.style.display = "none";
      } else {
        picture.style.display = "block";
        picture.src = `${response.Poster}`;
      }
      title.textContent = `${response.Title}`;
      year.textContent = `${response.Released}`;
      description.textContent = `${response.Plot}`;

      popup.style.display = "flex";
      popup.style.animation = "fadein 0.5s ease";
      filter.style.display = "block";
      filter.style.animation = "fadeinfilter 0.3s ease"; 
    });   
  }
  if(e.target.id === "filter" || e.target.id === "close"){
    popup.style.animation = "fadeout 0.5s ease";
    filter.style.animation = "fadeoutfilter 0.5s ease"; 

    this.setTimeout(function(){
      filter.style.display = "none";
      popup.style.display = "none";
    },500);
  }
})