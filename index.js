const COHORT = "2309-FTB-ET-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  events: [],
};

const eventList = document.querySelector("#events");

const addEventForm = document.querySelector("#addEvent");
addEventForm.addEventListener("submit", addEvent);

async function render() {
  await getEvents();
  renderEvents();
}
render();

async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const event = await response.json();
    state.events = event.data;
  } catch (error) {
    console.error(error);
  }
}

function renderEvents() {
  if (!state.events.length) {
    eventList.innerHTML = "<li>No events.</li>";
    return;
  }

  const eventCards = state.events.map((event) => {
    const li = document.createElement("li");
    const deleteButton = document.createElement("button");
    const date = new Date(event.date).toLocaleDateString("en-US");
    const time = new Date(event.date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    li.innerHTML = `
      <h2>${event.name}</h2>
      <h3>${event.location}<br>
      ${time + " " + date}</h3>
      <p>${event.description}</p>
    `;
    deleteButton.addEventListener("click", () => {
      deleteEvent(event.id);
    });
    deleteButton.textContent = "Delete Event";
    li.append(deleteButton);
    return li;
  });

  eventList.replaceChildren(...eventCards);
}

async function addEvent(event) {
  event.preventDefault();
  try {
    const isoDate = new Date(
      new Date(addEventForm.date.value).toLocaleString("en-US", {
        timeZone: "America/Chicago",
      })
    ).toISOString();
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addEventForm.name.value,
        description: addEventForm.description.value,
        date: isoDate,
        location: addEventForm.location.value,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to create event");
    }
    render();
  } catch (error) {
    console.error(error);
  }
}

async function deleteEvent(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Recipe could not be deleted.");
    }

    render();
  } catch (error) {
    console.log(error);
  }
}
