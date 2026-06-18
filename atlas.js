const countriesList = document.getElementById("countries-list");
const continent = document.getElementById("continent");
const modalBody = document.getElementById("modal-body-content");
const modalTitle = document.getElementsByClassName("modal-title")[0];
const modal = new bootstrap.Modal(document.getElementById("one-country"));

function loadCountries(region) {
    countriesList.innerHTML = "";

    fetch(`https://restcountries.com/v5/region/${region}`,
         { headers: { 'Authorization': 'Bearer rc_live_e7b1037bc85b4e1dad6100e0db58d1ca' } })
        .then(res => res.json())
        .then(data => {
            data.forEach(country => {
                let blockCountry = `
                <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-4">
                    <div class="card h-100 shadow-lg border-0 rounded-4">
                        <img class="card-img-top" src="${country.flags.png}" alt="Vlajka ${country.name.common}">
                        <div class="card-body text-center">
                            <h5 class="card-title text-primary fw-bold">
                                ${country.translations.ces.common}
                            </h5>
                            <p class="card-text">
                                <b>${country.capital?.[0] || "Neuvedeno"}</b>
                            </p>
                            <button class="btn btn-outline-primary w-100" data-name="${country.name.common}">
                                Informace
                            </button>
                        </div>
                    </div>
                </div>`;

                countriesList.innerHTML += blockCountry;
            });

            document.querySelectorAll("button[data-name]").forEach(button => {
                button.addEventListener("click", () => {
                    const countryName = button.getAttribute("data-name");

                    modal.show();

                    fetch(`https://restcountries.com/v5/name/${countryName}?fullText=true`,
                         { headers: { 'Authorization': 'Bearer rc_live_e7b1037bc85b4e1dad6100e0db58d1ca' } }))
                        .then(res => res.json())
                        .then(data => {
                            const country = data[0];

                            modalTitle.innerHTML = country.translations.ces.common;

                            const currencies = country.currencies
                                ? Object.values(country.currencies).map(c => c.name).join(", ")
                                : "Neuvedeno";

                            const languages = country.languages
                                ? Object.values(country.languages).join(", ")
                                : "Neuvedeno";

                            modalBody.innerHTML = `
                            <div class="text-center">
                                <img src="${country.flags.png}" alt="${country.name.common}" class="img-fluid rounded shadow mb-3" style="max-width: 250px;">
                                <div class="alert alert-primary">
                                    <h4 class="mb-0">${country.name.official}</h4>
                                </div>
                            </div>
                            <div class="list-group shadow-sm">
                                <div class="list-group-item">
                                    <strong>Hlavní město:</strong> ${country.capital?.[0] || "Neuvedeno"}
                                </div>
                                <div class="list-group-item">
                                    <strong>Počet obyvatel:</strong> ${country.population.toLocaleString("cs-CZ")}
                                </div>
                                <div class="list-group-item">
                                    <strong>Rozloha:</strong> ${country.area.toLocaleString("cs-CZ")} km²
                                </div>
                                <div class="list-group-item">
                                    <strong>Region:</strong> ${country.region}
                                </div>
                                <div class="list-group-item">
                                    <strong>Měna:</strong> ${currencies}
                                </div>
                                <div class="list-group-item">
                                    <strong>Jazyky:</strong> ${languages}
                                </div>
                            </div>
                            <div class="text-center mt-4">
                                <a href="${country.maps.googleMaps}" target="_blank" class="btn btn-success btn-lg w-100">
                                    Otevřít v Google Maps
                                </a>
                            </div>`;
                        })
                        .catch(error => {
                            console.log("Chyba při načítání detailu:", error);
                        });
                });
            });
        })
        .catch(error => {
            console.log("Chyba při načítání regionu:", error);
        });
}

// Výchozí načtení
loadCountries("europe");

// Změna regionu podle selectu
continent.addEventListener("change", function (event) {
    loadCountries(event.target.value);
});
