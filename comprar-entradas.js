// Nos traemos este codigo para poder ver el user logeado en la pagina de compra!

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

const errorToast = ()=> {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "error",
        title: "Ha habido un error al cargar la pelicula"
      });
}

// Nos llevamos los datos de la pelicula seleccionada...

document.addEventListener("DOMContentLoaded", () => {
    // Obtiene el nombre de la película desde la URL
    const params = new URLSearchParams(window.location.search);
    const peliculaNombre = params.get('pelicula');

    if (peliculaNombre) {
        // Llama a la API para obtener la información de la película
        const url = `https://api.themoviedb.org/3/search/movie?api_key=dd5064131984f134c4d33ef1f121a774&language=es-ES&query=${encodeURIComponent(peliculaNombre)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const peliculas = data.results;
                if (peliculas.length > 0) {
                    const pelicula = peliculas[0];
                    const postUrl = `https://image.tmdb.org/t/p/w500${pelicula.poster_path}`;
                    const peliName = pelicula.title
                    const peliDescrip = pelicula.overview

                    const img = document.createElement("img");
                    img.src = postUrl;
                    img.alt = pelicula.title;
                    img.width = 602; 
                    img.height = 802; 

                    document.getElementById("poster").appendChild(img); // Muestra la imagen

                    document.getElementById("filmTitle").innerText = peliName;

                    document.getElementById("filmDescription").innerText = peliDescrip;
                }
            })
            .catch(error => errorToast());
    }
});

// Funcionalidad de Comprar las Entradas...

const submit = document.getElementById("submit");

submit.addEventListener("click", (evento)=> {
    evento.preventDefault();
    
    const day = document.getElementById("day").value;
    const formato = document.getElementById("format").value;
    const cantidad = document.getElementById("cant").value;

    if (cantidad >= 51 || cantidad <= 0) {
        Swal.fire("El máximo de entradas es de 50 y el minimo de 1!!")
    } else if (cantidad === "") {
        Swal.fire("Debe ingresar una cantidad de entradas valida")
    } else {
        Swal.fire({
            title: `Esta seguro que quiere comprar ${cantidad} entradas para el día ${day} en ${formato}?`,
            showDenyButton: true,
            confirmButtonText: "SÍ",
            denyButtonText: "NO"
          }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: `${cantidad} entradas compradas con éxito para el día ${day} en ${formato} <br> <br> Muchas gracias por confiar en Cines Nico`,
                    icon: "success",
                    showCloseButton: true,
                    confirmButtonText: `Aceptar`
                  });
            } else if (result.isDenied) {
              Swal.fire("No se han comprado las entradas, si quiere puede cambiar de pelicula en la cartelera, Gracias!");
            }
          });
    }
})