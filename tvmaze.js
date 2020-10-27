async function searchShows(query) {
  const showURL = 'http://api.tvmaze.com/search/shows';
  const response = await axios.get(showURL, {params: {q: query}});
  const shows = response.data;
  showsArray = [];
  for(let show of shows){
      showsArray.push(show.show);
  }
  return showsArray;
}

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3" data-show-id="${show.id}">
           <div class="card Show" data-show-id="${show.id}">
             <div class="card-body">
               <h5 class="card-title">${show.name}</h5>
               <p class="card-text">${show.summary}</p>
             </div>
           </div>
         </div>
        `
    );
    $showsList.append($item);
  }
}

function populateEpisodes(episodes){
    const $episodesList = $('#episodes-list');
    $episodesList.empty();
    for(let episode of episodes){
        $episodeCard = $(
            `<div class="col-md-6 col-lg-3 Episode">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Season ${episode.season} - Episode: ${episode.number}, ${episode.name}</h5>
                        <p class="card-text">${episode.summary}</p>
                    </div>
                </div>
            </div>`
        );
        $episodesList.append($episodeCard);
    }
}

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

$('#shows-list').on('click', async function handleEpisodeSearch(evt){
    const showID = $(evt.target).closest('.Show').data('show-id');
    const episodes = await getEpisodes(showID);
    populateEpisodes(episodes);
    $('#episodes-area').show();
});

async function getEpisodes(id) {
  const response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  return response.data;
}
