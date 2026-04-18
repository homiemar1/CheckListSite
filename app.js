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

function renderCard(cardData, cardId) {
    const card = document.createElement('div');
    card.className = 'checklist-card';
    
    // Nos aseguramos de que siempre haya un array de tareas, aunque esté vacío
    const items = cardData.items || [];

    // Estructura HTML inyectada
    card.innerHTML = `
        <h2 class="card-title" contenteditable="true">${cardData.title || "Nueva Lista ✨"}</h2>
        
        <ul class="task-list">
            ${items.map((item, index) => `
                <li class="task-item ${item.completed ? 'completed' : ''}">
                    <input type="checkbox" class="task-checkbox" data-index="${index}" ${item.completed ? 'checked' : ''}>
                    <span class="task-text">${item.text}</span>
                    <button class="delete-task-btn" data-index="${index}">🗑️</button>
                </li>
            `).join('')}
        </ul>
        
        <div class="add-task-container">
            <input type="text" placeholder="Añadir tarea..." class="new-task-input">
            <button class="add-task-btn">+</button>
        </div>
        
        <button class="delete-card-btn">Borrar esta ventana</button>
    `;

    // --- DELEGACIÓN DE EVENTOS (Evita que los botones dejen de funcionar) ---
    
    // 1. Detectar CLICS (Borrar ventana, borrar tarea, añadir tarea)
    card.addEventListener('click', async (e) => {
        // Borrar ventana completa
        if (e.target.classList.contains('delete-card-btn')) {
            if (confirm("¿Seguro que quieres borrar toda esta ventana?")) {
                await deleteDoc(doc(db, "checklists", cardId));
            }
        }
        
        // Borrar una tarea suelta
        if (e.target.classList.contains('delete-task-btn')) {
            const index = e.target.getAttribute('data-index');
            const newItems = [...items];
            newItems.splice(index, 1);
            await updateDoc(doc(db, "checklists", cardId), { items: newItems });
        }
        
        // Añadir una nueva tarea al checklist
        if (e.target.classList.contains('add-task-btn')) {
            const input = card.querySelector('.new-task-input');
            if (input.value.trim() === "") return; // Evita guardar tareas vacías
            const newItems = [...items, { text: input.value.trim(), completed: false }];
            await updateDoc(doc(db, "checklists", cardId), { items: newItems });
        }
    });

    // 2. Detectar CHECKBOX (Marcar/Desmarcar y tachar)
    card.addEventListener('change', async (e) => {
        if (e.target.classList.contains('task-checkbox')) {
            const index = e.target.getAttribute('data-index');
            const newItems = [...items];
            newItems[index].completed = e.target.checked;
            await updateDoc(doc(db, "checklists", cardId), { items: newItems });
        }
    });

    // 3. Detectar TÍTULO (Guarda al hacer clic fuera del título)
    card.addEventListener('focusout', async (e) => {
        if (e.target.classList.contains('card-title')) {
            const newTitle = e.target.innerText.trim();
            // Solo guarda en la base de datos si el título realmente ha cambiado
            if (newTitle !== cardData.title) {
                await updateDoc(doc(db, "checklists", cardId), { title: newTitle });
            }
        }
    });

    board.appendChild(card);
}

// Sincronización en tiempo real
onSnapshot(collection(db, "checklists"), (snapshot) => {
    board.innerHTML = '';
    snapshot.forEach((doc) => renderCard(doc.data(), doc.id));
});

// Botón principal de la cabecera
addCardBtn.addEventListener('click', async () => {
    await addDoc(collection(db, "checklists"), {
        title: "Nueva Lista",
        items: []
    });
});
