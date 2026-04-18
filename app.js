import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBsQ7_U4zdG8l-_x3rG5Jarw2PWqw8w9Ag",
  authDomain: "timmymarusite.firebaseapp.com",
  projectId: "timmymarusite",
  storageBucket: "timmymarusite.firebasestorage.app",
  messagingSenderId: "59774405576",
  appId: "1:59774405576:web:597997f0be910ca82b0efd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const board = document.getElementById('board');
const addCardBtn = document.getElementById('add-card-btn');

// Función para pintar las tarjetas
function renderCard(cardData, cardId) {
    const card = document.createElement('div');
    card.className = 'checklist-card';
    card.innerHTML = `
        <h2 class="card-title" contenteditable="true">${cardData.title}</h2>
        <ul class="task-list">
            ${cardData.items.map((item, index) => `
                <li class="task-item">
                    <span>${item.text}</span>
                    <button class="delete-task" data-index="${index}">x</button>
                </li>
            `).join('')}
        </ul>
        <div class="add-task-container">
            <input type="text" placeholder="Nueva tarea..." class="new-task-input">
            <button class="add-task-btn">+</button>
        </div>
    `;

    // Lógica para añadir tarea
    card.querySelector('.add-task-btn').onclick = async () => {
        const input = card.querySelector('.new-task-input');
        if (input.value.trim() === "") return;
        const newItems = [...cardData.items, { text: input.value, completed: false }];
        await updateDoc(doc(db, "checklists", cardId), { items: newItems });
    };

    board.appendChild(card);
}

// Escuchar cambios en la base de datos
onSnapshot(collection(db, "checklists"), (snapshot) => {
    board.innerHTML = '';
    snapshot.forEach((doc) => renderCard(doc.data(), doc.id));
});

// FUNCIÓN DEL BOTÓN PRINCIPAL (CORREGIDA)
addCardBtn.addEventListener('click', async () => {
    console.log("Intentando crear ventana...");
    try {
        await addDoc(collection(db, "checklists"), {
            title: "Nueva Lista",
            items: []
        });
    } catch (error) {
        console.error("Error al añadir a Firebase:", error);
    }
});
