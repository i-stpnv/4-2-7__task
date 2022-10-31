// DOM elements
const searchLine = document.querySelector(".search-line");
const select = document.querySelector(".select");
const addedRepos = document.querySelector(".added-repos");

// getRepos
const reposURL = "https://api.github.com/search/repositories";
async function getRepos(userInput) {
    clearRepos();
    if (userInput) {
        try {
            return await fetch(`${reposURL}?q=${userInput}&sort=stars&order=desc&per_page=5`)
                .then(response => {
                    if (response.ok) {
                        response.json().then(response => {
                            if (response.items.length > 0) {
                                response.items.forEach(repo => showRepo(repo));
                            } else {
                                select.textContent = "Nothing found...";
                            }
                        });
                    }
                });
        } catch (e) { console.log("Unfortunately, an error occurred. " + e); }
    }
}

// debounce
const debounce = (fn, debounceTime) => {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), debounceTime);
    };
};

// showRepo
function showRepo(repo) {
    const shownRepo = document.createElement("li");

    // addRepo
    shownRepo.addEventListener("click", () => {
        clearRepos();
        searchLine.value = "";
        const addedRepo = document.createElement("li");
        addedRepo.classList.add("added-repo");
        const [name, owner, stars] = [repo.name, repo.owner.login, repo.stargazers_count];
        addedRepo.innerHTML = `
        <p>Name: ${name}</p>
        <p>Owner: ${owner}</p>
        <p>Stars: ${stars}</p>
        <button class="remove-button">
            <svg width="46" height="42" viewBox="0 0 46 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 40.5L44 2" stroke="#FF0000" stroke-width="4"/>
                <path d="M44 40.5L2 2" stroke="#FF0000" stroke-width="4"/>
            </svg>
        </button>
        `;
        addedRepos.append(addedRepo);
    });

    shownRepo.classList.add("option");
    shownRepo.textContent = repo.name;
    select.append(shownRepo);
}

// clearRepos
function clearRepos() { select.innerHTML = ""; }

// main
searchLine.addEventListener("input", debounce(async () => {
    await getRepos(searchLine.value);
}, 500));
addedRepos.addEventListener("click", (e) => {
    if (e.target.closest(".remove-button")) {
        e.target.closest(".added-repo").remove();
    }
});
