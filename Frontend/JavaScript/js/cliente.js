'use strict';

const URL = 'http://localhost:3000/clientes/';

let form, id, nombre, ubicacion, tbody;

window.addEventListener('DOMContentLoaded', async function() {
    form = document.querySelector('form');

    id = document.querySelector('#id');
    nombre = document.querySelector('#nombre');
    ubicacion = document.querySelector('#ubicacion');

    form.style.display = 'none';

    tbody = document.querySelector('tbody');

    await listado();

    form.addEventListener('submit', async function(evento) {
        evento.preventDefault();

        const cliente = {
            nombre: nombre.value,
            ubicacion: ubicacion.value
        };

        if(id.value) {
            cliente.id = id.value;
            
            const respuesta = await fetch(URL + id.value, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cliente)
            });
        } else {
            const respuesta = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cliente)
            });
        }

        await listado();

        form.style.display = 'none';

    });

    
});

async function listado() {
    const respuesta = await fetch(URL);
    const clientes = await respuesta.json();

    console.log(clientes);

    tbody.innerHTML = '';

    for (const cliente of clientes) {
        console.log(cliente);

        const tr = document.createElement('tr');

        tr.dataset.id =cliente.id;

        tr.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.ubicacion}</td>
            <td>
                <a href="javascript:formulario('${cliente.id}')">Editar</a>
                <a href="javascript:borrar('${cliente.id}')">Borrar</a>
            </td>
        `;

        tbody.appendChild(tr);
    }
}


async function formulario(idRecibido) {
    form.style.display = 'block';

    if(idRecibido) {
        id.value = idRecibido;

        const respuesta = await fetch(URL + idRecibido);
        const cliente = await respuesta.json();

        nombre.value = cliente.nombre;
        ubicacion.value = cliente.ubicacion;
    } else {
        form.reset();
    }
}

async function borrar(id) {
    const respuesta = await fetch(URL + id, {
        method: 'DELETE'
    });

    if(respuesta.ok) {
        document.querySelector(`tr[data-id="${id}"]`).remove();
    }
}


