const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');
const deployURL = 'https://puppy-bowl-project.netlify.app'

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2023-acc-et-web-pt-c';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const allPlayersData = await fetch(`${APIURL}/players`)
        const data = await allPlayersData.json()
        return data.data
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const dataId = await fetch(`${APIURL}/players/${playerId}`)
        const response = await dataId.json()
        return response.data
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const data = await fetch(`${APIURL}/players`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({name: playerObj.name, breed: playerObj.breed, imageUrl: playerObj.imageUrl, status: playerObj.status})
        })
        const response = await data.json()
        if(response){
            location.reload()
        }
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        const remove = await fetch(`${APIURL}/players/${playerId}`,
        {
            method: 'DELETE'
        })
        const result = await remove.json()
        if(result.success){
            location.reload()
        }
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
    try {
        for(let players of playerList.players){
            const divEl = document.createElement('div')

            divEl.innerHTML = `<div>
            <h2>${players.name}</h2>
            <p>${players.breed}</p>
            <img src=${players.imageUrl}>
            <div>
            <button class='info-button'>More information</button>
            <button class='remove-button'>Remove</button>
            </div>
            </div>`

            const infoButton = divEl.querySelector('.info-button');
            const removeBtn = divEl.querySelector('.remove-button');
            infoButton.addEventListener('click', (e) => {
                e.preventDefault();
                const newUrl = `${deployURL}?id=` + players.id;
                window.location.href = newUrl;
            });
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault()
                removePlayer(players.id)
            })
            playerContainer.appendChild(divEl)

        }
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};


const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
}


// DETAILS DOG PAGE
const renderInfoPuppy = (puppyInfo) => {
    const detailsContainer = document.getElementById('main')
    console.log(puppyInfo)
    main.innerHTML = `<div>
    <a href="./index.html">
    <svg width="44px" height="64px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#0000ff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="F-Chevron"> <polyline fill="none" id="Left" points="15.5 5 8.5 12 15.5 19" stroke="#0000ff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polyline> </g> </g> </g></svg>
    </a>
    <h2>Name: ${puppyInfo.name}</h2>
    <p class='info-breed'><b>Breed:</b> ${puppyInfo.breed}</p>
    <div class='img-container'>
    <img src=${puppyInfo.imageUrl} class='info-img'>
    </div>
    <h3>Team</h3>
    <div class='team-container'></div>
    </div>`
    if(!puppyInfo.team) return
    for(let team of puppyInfo.team.players){
        const teamContainer = main.querySelector('.team-container')
        const divEl = document.createElement('div')
        teamContainer.appendChild(divEl)
        divEl.innerHTML = `
        <span class='team-search'>${team.name}</span>
        `
        const teamSearch = divEl.querySelector('.team-search')
        teamSearch.addEventListener('click', (e) => {
            e.preventDefault();
            const newUrl = 'http://127.0.0.1:5500/details.html?id=' + team.id;
            window.location.href = newUrl;
        })
    }
}

const urlParams = new URLSearchParams(window.location.search);
const playerId = urlParams.get('id');
const desireURL = deployURL
const currentUrl = window.location.href
const windowLocation = `${deployURL}?id=${playerId}`

if(desireURL === currentUrl || currentUrl != windowLocation){
    init();
}
if(windowLocation === currentUrl){
    const fetchSingle = async () => {
        const dataPuppy = await fetchSinglePlayer(playerId)
        renderInfoPuppy(dataPuppy.player)
    }
    fetchSingle()
}

// open modal and close modal

const openButton = document.querySelector('.create-puppy')
const closeButton = document.querySelector('.close')
const modal = document.querySelector('.modal')

openButton.addEventListener('click', () => {
    modal.classList.add('show')
})
closeButton.addEventListener('click', () => {
    modal.classList.remove('show')
})


// handle form submit
const submitPuppy = document.getElementById('submitPuppy')
const submitBtn = document.getElementById('submit-btn')
submitBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const formData = Object.fromEntries(new FormData(submitPuppy))
    addNewPlayer(formData)
})

