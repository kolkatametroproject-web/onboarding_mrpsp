import { db } from "./firebase-config.js";
import { ref, get, set, update } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";
import { getStorage, ref as sref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-storage.js";

const form = document.querySelector("#registerForm");
const msg = document.querySelector("#msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.className = "";
  msg.textContent = "Checking enrollment number...";

  const enrollment = document.querySelector("#enrollment").value.trim().toUpperCase();

  try {
    const existing = await get(ref(db, `candidates/${enrollment}`));

    if (existing.exists()) {
      msg.className = "error";
      msg.textContent = "This enrollment number is already registered.";
      return;
    }

    const data = {
      enrollmentNumber: enrollment,
      name: document.querySelector("#name").value.trim(),
      email: document.querySelector("#email").value.trim(),
      phone: document.querySelector("#phone").value.trim(),
      dob: document.querySelector("#dob").value,
      college: document.querySelector("#college").value.trim(),
      status: "Registered",
      createdAt: new Date().toISOString()
    };

    const file = document.querySelector("#photo").files[0];

    if (file) {
      const storage = getStorage();
      const photoRef = sref(storage, `candidate-photos/${enrollment}`);
      await uploadBytes(photoRef, file);
      data.photoUrl = await getDownloadURL(photoRef);
    }

    await set(ref(db, `candidates/${enrollment}`), data);

    // Maintain a small dashboard counter. For production, move this to trusted
    // server-side logic/Cloud Functions so candidates cannot alter statistics.
    const statsSnap = await get(ref(db, "stats"));
    const stats = statsSnap.exists() ? statsSnap.val() : {};
    await update(ref(db, "stats"), {
      registered: Number(stats.registered || 0) + 1,
      allocated: Number(stats.allocated || 0),
      completed: Number(stats.completed || 0),
      eligible: Number(stats.eligible || 0)
    });

    msg.className = "success";
    msg.innerHTML = `Registration successful. Your Registration Number is <b>${enrollment}</b>. Please save it.`;
    form.reset();
  } catch (err) {
    console.error(err);
    msg.className = "error";
    msg.textContent = "Registration failed. Check Firebase Realtime Database and Storage rules.";
  }
});
