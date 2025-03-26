document.addEventListener("DOMContentLoaded", () => {
    fetchProperties();

    document.getElementById("filter-btn").addEventListener("click", applyFilters);
});

function fetchProperties() {
    fetch("http://localhost:3000/properties")
        .then(response => response.json())
        .then(properties => displayRentals(properties))
        .catch(error => console.error("Error fetching properties:", error));
}

function displayRentals(properties) {
    const propertiesContainer = document.getElementById("properties-container");
    propertiesContainer.innerHTML = ""; 

    properties.forEach(property => {
        const propertyCard = document.createElement("div");
        propertyCard.classList.add("property-card");

        propertyCard.innerHTML = `
            <img src="${property.image}" alt="${property.name}">
            <h3>${property.name}</h3>
            <p><strong>Location:</strong> ${property.location}</p>
            <p><strong>Price:</strong> KSH ${property.price}</p>
            <button class="details-btn" data-id="${property.id}">View Details</button>
        `;

        propertiesContainer.appendChild(propertyCard);
    });

    document.querySelectorAll(".details-btn").forEach(button => {
        button.addEventListener("click", event => {
            const propertyId = event.target.getAttribute("data-id");
            showPropertyDetails(propertyId, properties);
        });
    });
}

function showPropertyDetails(id, properties) {
    const selectedProperty = properties.find(property => property.id == id);
    const modal = document.getElementById("property-modal");
    const modalContent = document.querySelector(".modal-content");

    if (selectedProperty) {
        modalContent.innerHTML = `
            <h2>${selectedProperty.name}</h2>
            <img src="${selectedProperty.image}" alt="${selectedProperty.name}">
            <p><strong>Location:</strong> ${selectedProperty.location}</p>
            <p><strong>Price:</strong> KSH ${selectedProperty.price}</p>
            <p>${selectedProperty.description}</p>
            <button id="close-modal">Close</button>
        `;

        modal.style.display = "block";
        document.getElementById("close-modal").addEventListener("click", () => {
            modal.style.display = "none";
        });
    }
}

function applyFilters() {
    const searchValue = document.getElementById("search").value.toLowerCase();
    const typeValue = document.getElementById("property-type").value;
    const priceValue = document.getElementById("price-range").value;

    fetch("http://localhost:3000/properties")
        .then(response => response.json())
        .then(properties => {
            let filtered = properties;

            if (searchValue) {
                filtered = filtered.filter(property => property.location.toLowerCase().includes(searchValue));
            }
            if (typeValue !== "all") {
                filtered = filtered.filter(property => property.category.toLowerCase() === typeValue);
            }
            if (priceValue !== "all") {
                filtered = filtered.filter(property => property.price <= Number(priceValue));
            }

            displayRentals(filtered);
        });
}

function displayRentals(properties) {
    document.getElementById("studio-list").innerHTML = "";
    document.getElementById("one-bedroom-list").innerHTML = "";
    document.getElementById("two-bedroom-list").innerHTML = "";

    const groupedProperties = {
        "studio": [],
        "one-bedroom": [],
        "two-bedroom": []
    };

    properties.forEach(property => {
        if (groupedProperties[property.category]) {
            groupedProperties[property.category].push(property);
        }
    });

    function createPropertyCard(property) {
        return `
            <div class="property-card">
                <img src="${property.image}" alt="${property.name}" class="property-image">
                <div class="property-info">
                    <h3>${property.name}</h3>
                    <p><strong>Location:</strong> ${property.location}</p>
                    <p><strong>Price:</strong> KSH ${property.price}</p>
                    <button class="details-btn" data-id="${property.id}">View Details</button>
                </div>
            </div>
        `;
    }

    Object.keys(groupedProperties).forEach(category => {
        let container = document.getElementById(`${category}-list`);
        groupedProperties[category].forEach(property => {
            container.innerHTML += createPropertyCard(property);
        });
    });

    document.querySelectorAll(".details-btn").forEach(button => {
        button.addEventListener("click", event => {
            const propertyId = event.target.getAttribute("data-id");
            showPropertyDetails(propertyId, properties);
        });
    });
}
