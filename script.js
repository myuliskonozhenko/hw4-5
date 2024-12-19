document.getElementById('search-button').addEventListener('click', fetchRandomPokemon);

async function fetchPokemonData(pokemonNameOrId) {
    const title = document.getElementById('pokemon-title');
    const image = document.getElementById('pokemon-image');
    const type = document.getElementById('pokemon-type');
    const height = document.getElementById('pokemon-height');
    const weight = document.getElementById('pokemon-weight');
    const statsTable = document.getElementById('pokemon-stats');

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`);
        if (!response.ok) {
            throw new Error('Pokemon not found');
        }

        const data = await response.json();

        title.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);
        image.src = data.sprites.front_default;
        image.alt = data.name;
        image.style.display = 'block';

        type.textContent = data.types.map(type => type.type.name).join(', ');
        height.textContent = `${data.height / 10} m`;
        weight.textContent = `${data.weight / 10} kg`;
        statsTable.style.display = 'table';

        // Store the Pokemon name for feedback
        image.dataset.pokemonName = data.name;
    } catch (error) {
        title.textContent = 'Pokemon not found.';
        image.style.display = 'none';
        statsTable.style.display = 'none';
    }
}

async function fetchRandomPokemon() {
    const randomId = Math.floor(Math.random() * 1010) + 1; // PokeAPI has 1010 Pokemon as of now
    fetchPokemonData(randomId);
}

async function sendFeedback(feedback) {
    const image = document.getElementById('pokemon-image');
    const pokemonName = image.dataset.pokemonName || 'unknown';

    const payload = {
        pokemon: pokemonName,
        feedback: feedback
    };

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const result = await response.json();
            alert(`Feedback sent!\nPokemon: ${result.pokemon}\nFeedback: ${result.feedback}`);
        } else {
            throw new Error('Failed to send feedback');
        }
    } catch (error) {
        alert('Error sending feedback: ' + error.message);
    }
}

// Event listeners for feedback buttons
document.getElementById('cool-button').addEventListener('click', () => sendFeedback('cool'));
document.getElementById('tacky-button').addEventListener('click', () => sendFeedback('tacky'));

// Fetch a random Pokemon on page load
window.addEventListener('load', fetchRandomPokemon);

