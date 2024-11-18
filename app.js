document.addEventListener('DOMContentLoaded', () => {
    const lista = document.getElementById('lista');
    const crearForm = document.getElementById('crear');
  
    // Obtener todos los productos
    const getProductos = async () => {
      try {
        const response = await fetch('http://localhost:4000/productos');
        const productos = await response.json();
        console.log('Productos obtenidos:', productos); // Añade esta línea para depuración
        if (Array.isArray(productos)) {
          lista.innerHTML = '';
          productos.forEach(producto => {
            const li = document.createElement('li');
            li.innerHTML = `
              <strong>${producto.title}</strong> - ${producto.description} (Valor: $${producto.value})<br>
              <img src="${producto.images}" alt="${producto.title}" width="100"><br>
              <button onclick="editarProducto(${producto.id})">Editar</button>
              <button onclick="borrarProducto(${producto.id})">Borrar</button>
            `;
            lista.appendChild(li);
          });
        } else {
          console.error('La respuesta no es un arreglo:', productos);
        }
      } catch (error) {
        console.error('Error obteniendo productos:', error);
      }
    };
  
    // Crear un nuevo producto
    crearForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;
      const value = document.getElementById('value').value;
      const images = document.getElementById('images').value;
  
      try {
        await fetch('http://localhost:4000/productos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, description, value, images }),
        });
  
        crearForm.reset();
        getProductos();
      } catch (error) {
        console.error('Error creando producto:', error);
      }
    });
  
    // Editar un producto
    window.editarProducto = async (id) => {
      const title = prompt('Nuevo título:');
      const description = prompt('Nueva descripción:');
      const value = prompt('Nuevo valor:');
      const images = prompt('Nueva URL de la imagen:');
  
      if (title && description && value && images) {
        try {
          await fetch(`http://localhost:4000/productos/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description, value, images }),
          });
          getProductos();
        } catch (error) {
          console.error('Error actualizando producto:', error);
        }
      }
    };
  
    // Borrar un producto
    window.borrarProducto = async (id) => {
      if (confirm('¿Estás seguro de que quieres borrar este producto?')) {
        try {
          await fetch(`http://localhost:4000/productos/${id}`, {
            method: 'DELETE',
          });
          getProductos();
        } catch (error) {
          console.error('Error eliminando producto:', error);
        }
      }
    };
  
    // Inicializar lista de productos
    getProductos();
  });
      