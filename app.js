import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Tu configuración de Firebase
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

// --- FUNCIÓN PRINCIPAL PARA DIBUJAR CADA VENTANA ---
function renderCard(cardData, cardId) {
    const card = document.createElement('div');
    card.className = 'checklist-card';
    
    // Generamos el HTML. Nota que el <li> recibe la clase 'completed' si la tarea está lista
    card.innerHTML = `
        <h2 class="card-title" contenteditable="true" data-id="${cardId}">${cardData.title || "Nueva Lista"}</h2>
        <ul class="task-list">
            ${cardData.items ? cardData.items.map((item, index) => `
                <li class="task-item ${item.completed ? 'completed' : ''}">
                    <label style="display: flex; gap: 10px; align-items: center; cursor: pointer;">
                        <input type="checkbox" class="task-checkbox" data-index="${index}" ${item.completed ? 'checked' : ''}>
                        <span>${item.text}</span>
                    </label>
                    <button class="delete-task" data-index="${index}">x</button>
                </li>
            `).join('') : ''}
        </ul>
        <div class="add-task-container">
            <input type="text" placeholder="Añadir tarea..." class="new-task-input">
            <button class="add-task-btn">+</button>
        </div>
        <button class="delete-card-btn" style="margin-top: 15px;">Borrar ventana</button>
    `;

    // 1. EDITAR EL TÍTULO (Se guarda al hacer clic fuera del título)
    const titleEl = card.querySelector('.card-title');
    titleEl.addEventListener('blur', async (e) => {
        const newTitle = e.target.innerText.trim();
        if (newTitle !== cardData.title) {
            await updateDoc(doc(db, "checklists", cardId), { title: newTitle });
        }
    });

    // 2. AÑADIR NUEVA TAREA
    card.querySelector('.add-task-btn').onclick = async () => {
        const input = card.querySelector('.new-task-input');
        if (input.value.trim() === "") return;
        
        const currentItems = cardData.items || [];
        const newItems = [...currentItems, { text: input.value.trim(), completed: false }];
        await updateDoc(doc(db, "checklists", cardId), { items: newItems });
    };

    // 3. MARCAR COMO COMPLETADO (Tachar)
    const checkboxes = card.querySelectorAll('.task-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', async (e) => {
            const index = e.target.getAttribute('data-index');
            const currentItems = [...cardData.items];
            
            // Invertimos el estado (de completado a no completado, o viceversa)
            currentItems[index].completed = e.target.checked;
            
            // Guardamos en Firebase (esto disparará onSnapshot y redibujará la tarjeta con el tachado)
            await updateDoc(doc(db, "checklists", cardId), { items: currentItems });
        });
    });

    // 4. ELIMINAR UNA TAREA ESPECÍFICA
    const deleteBtns = card.querySelectorAll('.delete-task');
    deleteBtns.forEach(btn => {
        btn.onclick = async (e) => {
            const index = e.target.getAttribute('data-index');
            const currentItems = [...cardData.items];
            currentItems.splice(index, 1); // Borra 1 elemento
            await updateDoc(doc(db, "checklists", cardId), { items: currentItems });
        };
    });

    // 5. BORRAR LA VENTANA COMPLETA
    card.querySelector('.delete-card-btn').onclick = async () => {
        if(confirm("¿Seguro que quieres borrar esta checklist entera?")) {
            await deleteDoc(doc(db, "checklists", cardId));
        }
    };

    board.appendChild(card);
}

// --- ESCUCHAR LA BASE DE DATOS EN TIEMPO REAL ---
onSnapshot(collection(db, "checklists"), (snapshot) => {
    board.innerHTML = '';
    snapshot.forEach((doc) => renderCard(doc.data(), doc.id));
});

// --- CREAR NUEVA VENTANA ---
addCardBtn.addEventListener('click', async () => {
    await addDoc(collection(db, "checklists"), {
        title: "Lista Cozy ☕",
        items: []
    });
});
