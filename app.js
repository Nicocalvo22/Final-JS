class Usuario {
    constructor(nombre, usuario, password) {
        this.nombre = nombre;
        this.usuario = usuario;
        this.password = password;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Funcionalidad de Registro
    const submitRegistro = document.getElementById("submit");
    const messageDivRegistro = document.getElementById("message");

    if (submitRegistro) {
        submitRegistro.addEventListener("click", (event) => {
            event.preventDefault(); // Prevenir la recarga de la página
            // Limpiar mensajes anteriores
            messageDivRegistro.textContent = '';

            // Obtener valores de los inputs
            const nameInput = document.getElementById("name").value.trim();
            const userInput = document.getElementById("user").value.trim();
            const pwInput = document.getElementById("password").value.trim();

            // Verificar si alguno de los campos está vacío
            if (!nameInput || !userInput || !pwInput) {
                messageDivRegistro.textContent = "Todos los campos son obligatorios.";
                messageDivRegistro.style.color = "red";
                return;
            }

            // Obtener el array de usuarios de localStorage (si existe)
            let users = JSON.parse(localStorage.getItem("users")) || [];

            // Verificar si ya existe un usuario con el mismo nombre de usuario
            const userExists = users.some(user => user.usuario === userInput);

            if (userExists) {
                messageDivRegistro.textContent = "El nombre de usuario ya existe, elige otro.";
                messageDivRegistro.style.color = "red";
            } else {
                // Si el usuario no existe, crear un nuevo usuario y agregarlo al array
                const newUser = new Usuario(nameInput, userInput, pwInput);
                users.push(newUser);
                localStorage.setItem("users", JSON.stringify(users));

                messageDivRegistro.textContent = "Usuario Registrado Exitosamente";
                messageDivRegistro.style.color = "green";
            }
        });
    }

    // Funcionalidad de Inicio de Sesión
    const submitLogin = document.getElementById("submit2");
    const messageDivLogin = document.getElementById("message2");
    const welcomeUser = document.getElementById("userWelcome");
    const logoutButton = document.getElementById("logoutButton");

    // Verificar si hay un usuario logueado al cargar la página
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
        welcomeUser.textContent = `Bienvenido, ${loggedInUser}!`;
        logoutButton.style.display = 'block';
    } else {
        logoutButton.style.display = 'none';
    }

    if (submitLogin) {
        submitLogin.addEventListener("click", (event) => {
            event.preventDefault(); // Prevenir la recarga de la página
            messageDivLogin.textContent = ''; // Limpiar mensajes anteriores

            const userInput = document.getElementById("userIC").value.trim();
            const pwInput = document.getElementById("passwordIC").value.trim();

            // Verificar si ambos campos están llenos
            if (!userInput || !pwInput) {
                messageDivLogin.textContent = "Ambos campos son obligatorios.";
                messageDivLogin.style.color = "red";
                return;
            }

            // Obtener el array de usuarios de localStorage
            let users = JSON.parse(localStorage.getItem("users")) || [];

            // Verificar si el usuario existe
            const user = users.find(user => user.usuario === userInput && user.password === pwInput);

            if (user) {
                messageDivLogin.textContent = "Inicio de sesión exitoso.";
                messageDivLogin.style.color = "green";

                // Guardar el nombre de usuario en localStorage
                localStorage.setItem("loggedInUser", userInput);
                welcomeUser.textContent = `Bienvenido, ${userInput}`;
                logoutButton.style.display = 'block';
            } else {
                messageDivLogin.textContent = "Usuario o contraseña incorrectos.";
                messageDivLogin.style.color = "red";
            }
        });
    }

    // Funcionalidad de Cerrar Sesión
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("loggedInUser");
            welcomeUser.textContent = ''; // Limpiar mensaje de bienvenida
            messageDivLogin.textContent = "Has cerrado sesión.";
            messageDivLogin.style.color = "green";
            logoutButton.style.display = 'none';
        });
    }
});

// Codigo API cartelera

// Función para buscar la película
function buscarPelicula(peliculaNombre, contenedorId) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=dd5064131984f134c4d33ef1f121a774&language=es-ES&query=${encodeURIComponent(peliculaNombre)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const peliculas = data.results;
            if (peliculas.length > 0) {
                const pelicula = peliculas[0];
                const contenedor = document.getElementById(contenedorId);
                if (contenedor) {
                    const link = document.createElement("a");
                    link.href = `comprar-entradas.html?pelicula=${encodeURIComponent(pelicula.title)}`; // Redirige con el nombre de la película

                    const img = document.createElement("img");
                    const postUrl = `https://image.tmdb.org/t/p/w500${pelicula.poster_path}`;

                    img.src = postUrl;
                    img.alt = pelicula.title;
                    img.width = 500; // Ajusta el ancho a tu preferencia
                    img.height = 750; // Ajusta la altura a tu preferencia

                    link.appendChild(img);
                    contenedor.appendChild(link);
                }
            }
        })
        .catch(error => alert('Error al obtener la imagen de la pelicula:', error));
}

// Llamadas a la función para agregar películas
const peliculas = [
    "Deadpool & Wolverine",
    "Beetlejuice Beetlejuice",
    "El hoyo 2",
    "Despicable Me 4",
    "The Substance",
    "The Wild Robot",
    "Terrifier 3",
    "Inside Out 2",
    "탈출: 프로젝트 사일런스",
    "The Crow",
    "It Ends with Us",
    "The Bad Guys: Haunted Heist",
    "Speak No Evil",
    "Joker: Folie à Deux",
    "Kill 'em All 2",
    "Wolfs",
    "Bad Boys: Ride or Die",
    "Flow"
];

peliculas.forEach((nombre, index) => {
    buscarPelicula(nombre, `card${index + 1}`);
});