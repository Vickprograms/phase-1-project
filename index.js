document.addEventListener("DOMContentLoaded", () => {
    fetchProperties(); // Fetch and display properties on page load
  });
  
  // Function to fetch properties from db.json
  function fetchProperties() {
    fetch("http://localhost:3000/properties")
      .then(response => response.json())
      .then(properties => displayRentals(properties)) // Calls function to display rentals
      .catch(error => console.error("Error fetching properties:", error));
  }
  
  // Function to display properties on the page
  function displayRentals(properties) {
    const propertiesContainer = document.getElementById("properties-container");
    propertiesContainer.innerHTML = ""; // Clear existing content
  
    properties.forEach(property => {
      const propertyCard = document.createElement("div");
      propertyCard.classList.add("property-card");
  
      propertyCard.innerHTML = `
        <img src="${property.image}" alt="${property.name}">
        <h3>${property.name}</h3>
        <p><strong>Location:</strong> ${property.location}</p>
        <p><strong>Price:</strong> KSH ${property.price}</p>
        <button class="details-btn" data-id="${property.id}">View Details</button>`;
  
      propertiesContainer.appendChild(propertyCard);
    });
  
    // Add event listeners for the "View Details" buttons
    document.querySelectorAll(".details-btn").forEach(button => {
      button.addEventListener("click", (event) => {
        const propertyId = event.target.getAttribute("data-id");
        showPropertyDetails(propertyId, properties);
      });
    });
  }
  
  // Function to show property details in a modal
  function showPropertyDetails(id, properties) {
    const selectedProperty = properties.find(property => property.id == id);
    const model = document.getElementById("property-model");
    const modelContent = document.getElementById("model-content");
  
    if (selectedProperty) {
      modelContent.innerHTML = `
        <h2>${selectedProperty.name}</h2>
        <img src="${selectedProperty.image}" alt="${selectedProperty.name}">
        <p><strong>Location:</strong> ${selectedProperty.location}</p>
        <p><strong>Price:</strong> KSH ${selectedProperty.price}</p>
        <p>${selectedProperty.description}</p>
        <button id="close-modal">Close</button>`;
  
      model.style.display = "block";
  
      // Close modal on button click
      document.getElementById("close-model").addEventListener("click", () => {
        model.style.display = "none";
      });
    }
  }
  