document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector(".modal");
  const closeBtn = document.getElementById("closeModal");
  const moodButtons = document.querySelectorAll(".mood-btn");
  const trackItems = document.querySelectorAll(".playlist .track");
  const favList = document.querySelector(".favorites-list");
  const journalList = document.querySelector(".journal-list");
  const saveNoteBtn = document.getElementById("saveNote");
  const noteInput = document.querySelector(".journal textarea");

  // --- Modal Player ---
  if (modal && closeBtn) {
    trackItems.forEach(track => {
      track.addEventListener("click", () => {
        const src = track.dataset.src;
        modal.classList.add("show");
        modal.querySelector("iframe").src = src + "?autoplay=1";
      });
    });

    closeBtn.addEventListener("click", () => {
      modal.classList.remove("show");
      modal.querySelector("iframe").src = "";
    });

    window.addEventListener("click", e => {
      if (e.target === modal) {
        modal.classList.remove("show");
        modal.querySelector("iframe").src = "";
      }
    });
  }

  // --- Mood Filtering ---
  if (moodButtons.length) {
    moodButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        moodButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const mood = btn.dataset.mood;
        trackItems.forEach(track => {
          track.style.display = (track.dataset.mood === mood) ? "flex" : "none";
        });
      });
    });
  }

  // --- Favorites ---
  function loadFavorites() {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    favList.innerHTML = "";
    favs.forEach((fav, i) => {
      const li = document.createElement("div");
      li.className = "fav-item";

      const title = document.createElement("span");
      title.textContent = fav.title;
      title.style.cursor = "pointer";
      title.addEventListener("click", () => {
        modal.classList.add("show");
        modal.querySelector("iframe").src = fav.src + "?autoplay=1";
      });

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "❌";
      removeBtn.className = "remove-btn";
      removeBtn.addEventListener("click", () => {
        favs.splice(i, 1);
        localStorage.setItem("favorites", JSON.stringify(favs));
        loadFavorites();
      });

      li.appendChild(title);
      li.appendChild(removeBtn);
      favList.appendChild(li);
    });
  }

  function toggleFavorite(track) {
    const title = track.querySelector(".title").textContent;
    const src = track.dataset.src;
    let favs = JSON.parse(localStorage.getItem("favorites") || "[]");

    const exists = favs.find(f => f.title === title);
    if (exists) {
      favs = favs.filter(f => f.title !== title);
    } else {
      favs.push({ title, src });
    }

    localStorage.setItem("favorites", JSON.stringify(favs));
    loadFavorites();
  }

  document.querySelectorAll(".fav-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const track = btn.closest(".track");
      toggleFavorite(track);
    });
  });

  // --- Journal ---
  function loadJournal() {
    const notes = JSON.parse(localStorage.getItem("journal") || "[]");
    journalList.innerHTML = "";
    notes.forEach((note, i) => {
      const li = document.createElement("div");
      li.className = "note-item";

      const text = document.createElement("span");
      text.textContent = note.text;

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "❌";
      removeBtn.className = "remove-btn";
      removeBtn.addEventListener("click", () => {
        notes.splice(i, 1);
        localStorage.setItem("journal", JSON.stringify(notes));
        loadJournal();
      });

      li.appendChild(text);
      li.appendChild(removeBtn);
      journalList.appendChild(li);
    });
  }

  saveNoteBtn.addEventListener("click", () => {
    const text = noteInput.value.trim();
    if (!text) return;
    let notes = JSON.parse(localStorage.getItem("journal") || "[]");
    notes.push({ text, date: new Date().toLocaleString() });
    localStorage.setItem("journal", JSON.stringify(notes));
    noteInput.value = "";
    loadJournal();
  });

  // Initial loads
  loadFavorites();
  loadJournal();
});
