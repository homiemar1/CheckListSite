// 1. IMPORTACIONES DE FIREBASE (Vía enlaces web)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 2. TU CONFIGURACIÓN EXACTA
const firebaseConfig = {
  apiKey: "AIzaSyBsQ7_U4zdG8l-_x3rG5Jarw2PWqw8w9Ag",
  authDomain: "timmymarusite.firebaseapp.com",
  databaseURL: "https://timmymarusite-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "timmymarusite",
  storageBucket: "timmymarusite.firebasestorage.app",
  messagingSenderId: "59774405576",
  appId: "1:59774405576:web:597997f0be910ca82b0efd"
};

// 3. INICIALIZAR BASE DE DATOS
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referencias a los elementos principales del HTML
const board = document.getElementById('board');
const addCardBtn = document.getElementById('add-card-btn');

// --- FUNCIÓN PARA DIBUJAR UNA VENTANA ---
function renderCard(cardData, cardId) {
    const card = document.createElement('div');
    card.className = 'checklist-card';
    
    // Generamos el HTML interno de la tarjeta
    card.innerHTML = `
        <button class="delete-card-btn" data-id="${cardId}">borrar ventana</button>
        <h2 class="card-title">${cardData.title}</h2>
        <ul class="task-list">
            ${cardData.items.map((item, index) => `
                <li class="task-item">
                    <label>
                        <input type="checkbox" class="task-checkbox" data-index="${index}" ${item.completed ? 'checked' : ''}>
                        <span style="${item.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${item.text}</span>
                    </label>
                    <button class="delete-task" data-index="${index}">x</button>
                </li>
            `).join('')}
        </ul>
        <div class="add-task-container">
            <input type="text" placeholder="Nueva tarea..." class="new-task-input">
            <button class="add-task-btn" data-id="${cardId}">+</button>
        </div>
    `;

    // EVENTO: Añadir una nueva tarea a esta ventana
    card.querySelector('.add-task-btn').onclick = async () => {
        const input = card.querySelector('.new-task-input');
        if (!input.value.trim()) return; // No añade tareas vacías
        
        const newItems = [...cardData.items, { text: input.value, completed: false }];
        await updateDoc(doc(db, "checklists", cardId), { items: newItems });
    };

    // EVENTOS: Marcar checkbox o eliminar tarea específica
    const checkboxes = card.querySelectorAll('.task-checkbox');
    const deleteBtns = card.querySelectorAll('.delete-task');

    checkboxes.forEach(checkbox => {
        checkbox.onchange = async (e) => {
            const index = e.target.getAttribute('data-index');
            const newItems = [...cardData.items];
            newItems[index].completed = e.target.checked;
            await updateDoc(doc(db, "checklists", cardId), { items: newItems });
        };
    });

    deleteBtns.forEach(btn => {
        btn.onclick = async (e) => {
            const index = e.target.getAttribute('data-index');
            const newItems = [...cardData.items];
            newItems.splice(index, 1); // Elimina 1 elemento en la posición index
            await updateDoc(doc(db, "checklists", cardId), { items: newItems });
        };
    });

    // EVENTO: Borrar la ventana completa
    card.querySelector('.delete-card-btn').onclick = async () => {
        if(confirm("¿Seguro que quieres borrar toda esta lista?")) {
            await deleteDoc(doc(db, "checklists", cardId));
        }
    };

    board.appendChild(card);
}

// --- ESCUCHAR LA BASE DE DATOS EN TIEMPO REAL ---
onSnapshot(collection(db, "checklists"), (snapshot) => {
    board.innerHTML = ''; // Limpiamos la pantalla
    snapshot.forEach((doc) => {
        renderCard(doc.data(), doc.id); // Dibujamos cada ventana
    });
});

// --- CREAR NUEVA VENTANA ---
addCardBtn.onclick = async () => {
    await addDoc(collection(db, "checklists"), {
        title: "Nueva Lista ✨",
        items: []
    });
};
