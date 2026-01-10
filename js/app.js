const content = document.getElementById("content");

/* INITIAL RENDER */
renderHome(videos);

/* HOME SCREEN */
function renderHome(data) {
  content.innerHTML = "";

  const categories = {};

  data.forEach(item => {
    if (!categories[item.category]) categories[item.category] = [];
    categories[item.category].push(item);
  });

  for (let cat in categories) {
    const section = document.createElement("div");
    section.className = "category";
    section.innerHTML = `<h2>${cat}</h2>`;

    const row = document.createElement("div");
    row.className = "row";

    categories[cat].forEach(item => {
      createTile(row, item.name, item.thumb, () => {
        if (item.type === "series") {
          openSeries(item);
        } else {
          openPlayer(item.embed);
        }
      });
    });

    section.appendChild(row);
    content.appendChild(section);
  }
}

/* TILE */
function createTile(row, title, thumb, onClick) {
  const tile = document.createElement("div");
  tile.className = "tile";
  tile.innerHTML = `
    <img src="${thumb}">
    <div class="tile-info">
      <div class="tile-title">${title}</div>
    </div>
  `;
  tile.onclick = onClick;
  row.appendChild(tile);
}

/* PLAYER */
function openPlayer(link) {
  document.getElementById("modal").style.display = "block";
  document.getElementById("player").src = link + "?autoplay=1";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("player").src = "";
}

/* SERIES PANEL */
function openSeries(series) {
  document.getElementById("seriesTitle").textContent = series.name;
  document.getElementById("seriesPanel").style.display = "block";

  const list = document.getElementById("episodeList");
  list.innerHTML = "";

  series.episodes.forEach(ep => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.innerHTML = `
      <img src="${ep.thumb}">
      <div class="tile-info">
        <div class="tile-title">${ep.title}</div>
      </div>
    `;
    tile.onclick = () => {
      closeSeries();
      openPlayer(ep.embed);
    };
    list.appendChild(tile);
  });
}

function closeSeries() {
  document.getElementById("seriesPanel").style.display = "none";
}
