import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

const $ = (id) => document.getElementById(id);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "login.html";
    return;
  }

  $("user").textContent = user.email || "Administrator";

  const statsRef = ref(db, "stats");

  onValue(
    statsRef,
    (snapshot) => {
      const stats = snapshot.val() || {};
      $("registered").textContent = Number(stats.registered || 0);
      $("allocated").textContent = Number(stats.allocated || 0);
      $("completed").textContent = Number(stats.completed || 0);
      $("eligible").textContent = Number(stats.eligible || 0);
    },
    (error) => {
      console.error("Firebase stats read failed:", error);
      $("registered").textContent = "—";
      $("allocated").textContent = "—";
      $("completed").textContent = "—";
      $("eligible").textContent = "—";
      const note = document.createElement("div");
      note.className = "error";
      note.textContent =
        "Dashboard statistics are unavailable. Publish the supplied Firebase Realtime Database rules, then refresh.";
      document.querySelector(".admin-main").prepend(note);
    }
  );
});

$("logout").onclick = async () => {
  await signOut(auth);
  location.href = "login.html";
};
