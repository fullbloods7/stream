const content = document.getElementById("content");

/* TRACK SOURCE */
let fromSeries = false;

/* INITIAL RENDER */
renderHome(videos);

/* SEARCH FUNCTION */
function searchVideos() {
  const query = document.getElementById("search").value.toLowerCase().trim();

  if (!query) {
    renderHome(videos);
    return;
  }

  const filtered = videos.filter(item =>
    item.name.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query)
  );

  renderHome(filtered);
}

/* HOME SCREEN */
function renderHome(data) {
  content.innerHTML = "";

  if (!data.length) {
    content.innerHTML = `<p style="padding:16px">No results found</p>`;
    return;
  }

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
          fromSeries = false;
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
  const modal = document.getElementById("modal");
  const player = document.getElementById("player");

  modal.style.display = "block";
  player.src = link + "?autoplay=1";
}

function closeModal() {
  const modal = document.getElementById("modal");
  const player = document.getElementById("player");

  modal.style.display = "none";
  player.src = "";

  if (fromSeries) {
    document.getElementById("seriesPanel").style.display = "block";
    fromSeries = false;
  }
}

/* SERIES PANEL */
function openSeries(series) {
  const panel = document.getElementById("seriesPanel");
  panel.style.display = "block";
  document.getElementById("seriesTitle").textContent = series.name;

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
      fromSeries = true;
      panel.style.display = "none";
      openPlayer(ep.embed);
    };

    list.appendChild(tile);
  });
}

/* CLOSE SERIES PANEL */
function closeSeries() {
  document.getElementById("seriesPanel").style.display = "none";
}
