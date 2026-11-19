import React, { useEffect, useState } from "react";
import NewPlantForm from "./NewPlantForm";
import PlantList from "./PlantList";
import Search from "./Search";

function PlantPage() {
  const [plants, setPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Load the collection once when the plant page mounts.
    fetch("http://localhost:6001/plants")
      .then((response) => response.json())
      .then(setPlants);
  }, []);

  function addPlant(plant) {
    return fetch("http://localhost:6001/plants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(plant),
    })
      .then((response) => response.json())
      .then((newPlant) => setPlants((currentPlants) => [...currentPlants, newPlant]));
  }

  function toggleStock(plantId) {
    // Stock status is only held in client state, not sent to the API.
    setPlants((currentPlants) =>
      currentPlants.map((plant) =>
        plant.id === plantId
          ? { ...plant, inStock: plant.inStock === false }
          : plant,
      ),
    );
  }

  const visiblePlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <main>
      <NewPlantForm onAddPlant={addPlant} />
      <Search searchTerm={searchTerm} onSearch={setSearchTerm} />
      <PlantList plants={visiblePlants} onToggleStock={toggleStock} />
    </main>
  );
}

export default PlantPage;
