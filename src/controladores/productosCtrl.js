import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { conmysql } from "../bd.js";

// Necesario porque estás usando módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🧹 Función para eliminar archivos antiguos (imágenes reemplazadas)
const deleteFile = (filePath) => {
  try {
    if (!filePath) return;

    // Elimina la barra inicial y crea la ruta absoluta (desde la raíz del proyecto)
    const diskPath = path.join(process.cwd(), filePath.replace(/^\//, ''));

    if (fs.existsSync(diskPath)) {
      fs.unlinkSync(diskPath);
      console.log('🗑️ Imagen borrada:', diskPath);
    }
  } catch (err) {
    console.error('Error al borrar archivo:', err);
  }
};

// 🔗 Construye URL completa de imagen
const buildImageUrl = (req, filePath) => {
  if (!filePath) return null;
  const prefix = filePath.startsWith('/') ? '' : '/';
  return `${req.protocol}://${req.get('host')}${prefix}${filePath}`;
};

// 📦 Obtener todos los productos
export const getProductos = async (req, res) => {
  try {
    const [productos] = await conmysql.query("SELECT * FROM productos");
    const data = productos.map((prod) => ({
      ...prod,
      prod_imagen_url: buildImageUrl(req, prod.prod_imagen)
    }));
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error: error.message });
  }
};

// 📦 Obtener producto por ID
export const getProductoById = async (req, res) => {
  try {
    const [producto] = await conmysql.query("SELECT * FROM productos WHERE prod_id = ?", [req.params.id]);
    if (producto.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const prod = producto[0];
    prod.prod_imagen_url = buildImageUrl(req, prod.prod_imagen);
    res.json(prod);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener producto", error: error.message });
  }
};

// ➕ Agregar nuevo producto
export const postProductos = async (req, res) => {
  try {
    const { prod_nombre, prod_descripcion, prod_precio, prod_stock, prod_categoria } = req.body;
    const prod_imagen = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await conmysql.query(
      "INSERT INTO productos (prod_nombre, prod_descripcion, prod_precio, prod_stock, prod_categoria, prod_imagen) VALUES (?, ?, ?, ?, ?, ?)",
      [prod_nombre, prod_descripcion, prod_precio, prod_stock, prod_categoria, prod_imagen]
    );

    res.status(201).json({
      message: "Producto agregado correctamente",
      prod_id: result.insertId,
      prod_imagen_url: buildImageUrl(req, prod_imagen)
    });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar producto", error: error.message });
  }
};

// ✏️ Actualizar producto
export const patchProductos = async (req, res) => {
  try {
    const { id } = req.params;
    const [[productoActual]] = await conmysql.query("SELECT * FROM productos WHERE prod_id = ?", [id]);

    if (!productoActual) return res.status(404).json({ message: "Producto no encontrado" });

    // Mantiene valores antiguos si no se envían nuevos
    const prod_nombre = req.body.prod_nombre ?? productoActual.prod_nombre;
    const prod_descripcion = req.body.prod_descripcion ?? productoActual.prod_descripcion;
    const prod_precio = req.body.prod_precio ?? productoActual.prod_precio;
    const prod_stock = req.body.prod_stock ?? productoActual.prod_stock;
    const prod_categoria = req.body.prod_categoria ?? productoActual.prod_categoria;

    // Imagen (opcional)
    let prod_imagen = productoActual.prod_imagen;
    if (req.file) {
      prod_imagen = `/uploads/${req.file.filename}`;
      if (productoActual.prod_imagen) deleteFile(productoActual.prod_imagen);
    }

    await conmysql.query(
      "UPDATE productos SET prod_nombre=?, prod_descripcion=?, prod_precio=?, prod_stock=?, prod_categoria=?, prod_imagen=? WHERE prod_id=?",
      [prod_nombre, prod_descripcion, prod_precio, prod_stock, prod_categoria, prod_imagen, id]
    );

    res.json({
      message: "Producto actualizado correctamente",
      prod_imagen_url: buildImageUrl(req, prod_imagen)
    });
  } catch (error) {
    console.error("Error en patchProductos:", error);
    res.status(500).json({ message: "Error al actualizar producto", error: error.message });
  }
};

// 🗑️ Eliminar producto
export const deleteProductos = async (req, res) => {
  try {
    const { id } = req.params;
    const [[productoActual]] = await conmysql.query("SELECT * FROM productos WHERE prod_id = ?", [id]);

    if (!productoActual) return res.status(404).json({ message: "Producto no encontrado" });

    if (productoActual.prod_imagen) deleteFile(productoActual.prod_imagen);

    await conmysql.query("DELETE FROM productos WHERE prod_id = ?", [id]);
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto", error: error.message });
  }
};

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
