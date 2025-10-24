import { conmysql } from "../bd.js";

const buildImageUrl = (req, filePath) =>
  filePath ? `${req.protocol}://${req.get('host')}${filePath}` : null;

const deleteFile = (filePath) => {
  const diskPath = path.join(__dirname, filePath);
  fs.unlink(diskPath, (err) => {
    if (err) console.error('Error al borrar archivo:', err);
  });
};
//import { conmysql } from "../bd.js";
export const obtenerProductos=(req,res,)=>{
    res.send('Lista de productos');
}




//funcion para insertar un producto
export const postProductos = async (req, res) => {
  try {
    const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;
    const prod_imagen = req.file ? `/uploads/${req.file.filename}` : null;

    // Verificar si ya existe un producto con el mismo código
    const [fila] = await conmysql.query(
      'SELECT * FROM productos WHERE prod_codigo = ?',
      [prod_codigo]
    );

    if (fila.length > 0) {
      return res.status(409).json({
        id: 0,
        message: `Producto con código ${prod_codigo} ya existe.`,
      });
    }

    // Insertar nuevo producto
    const [result] = await conmysql.query(
      `INSERT INTO productos 
        (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen]
    );

    // Responder con el ID insertado
    res.status(201).json({
      id: result.insertId,
      message: "Producto creado exitosamente.",
    });

    // (Opcional) Logging para depuración
    console.log("Datos:", req.body);
    console.log("Archivo:", req.file);
    
  } catch (error) {
    console.error("Error en postProductos:", error);
    return res.status(500).json({
      message: "Error en el servidor",
      error: error.message,
    });
  }
};






// GET by ID
export const getProductoxid = async (req, res) => {
  try {
    const [rows] = await conmysql.query(
      'SELECT * FROM productos WHERE prod_id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    const producto = rows[0];
    producto.prod_imagen = buildImageUrl(req, producto.prod_imagen);
    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// GET all
export const getProductos = async (req, res) => {
  try {
    const [rows] = await conmysql.query('SELECT * FROM productos');
    rows.forEach(p => {
      p.prod_imagen = buildImageUrl(req, p.prod_imagen);
    });
    res.json({ cant: rows.length, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// PUT completo
export const putProductos = async (req, res) => {
  try {
    const { id } = req.params;
    const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;
    // Si viene archivo, usamos su ruta; si no, mantenemos la anterior
    let prod_imagen;
    if (req.file) {
      prod_imagen = `/uploads/${req.file.filename}`;
      // borrar vieja imagen
      const [[old]] = await conmysql.query('SELECT prod_imagen FROM productos WHERE prod_id = ?', [id]);
      if (old && old.prod_imagen) deleteFile(old.prod_imagen);
    } else {
      prod_imagen = req.body.prod_imagen || null;
    }

    const [result] = await conmysql.query(
      `UPDATE productos 
         SET prod_codigo = ?, prod_nombre = ?, prod_stock = ?, prod_precio = ?, prod_activo = ?, prod_imagen = ? 
       WHERE prod_id = ?`,
      [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const [[updated]] = await conmysql.query('SELECT * FROM productos WHERE prod_id = ?', [id]);
    updated.prod_imagen = buildImageUrl(req, updated.prod_imagen);
    res.json(updated);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// PATCH parcial
export const patchProductos = async (req, res) => {
  try {
    const { id } = req.params;
    const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;

    // Nueva imagen si subieron archivo
    let prod_imagen = null;
    if (req.file) {
      prod_imagen = `/uploads/${req.file.filename}`;
      // borramos imagen vieja
      const [[old]] = await conmysql.query('SELECT prod_imagen FROM productos WHERE prod_id = ?', [id]);
      if (old && old.prod_imagen) deleteFile(old.prod_imagen);
    }

    const [result] = await conmysql.query(
      `UPDATE productos
         SET 
           prod_codigo = IFNULL(?, prod_codigo),
           prod_nombre = IFNULL(?, prod_nombre),
           prod_stock  = IFNULL(?, prod_stock),
           prod_precio = IFNULL(?, prod_precio),
           prod_activo = IFNULL(?, prod_activo),
           ${ prod_imagen !== null ? 'prod_imagen = ?,' : '' }
           prod_actualizado = NOW()
       WHERE prod_id = ?`,
      prod_imagen !== null
        ? [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id]
        : [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const [[updated]] = await conmysql.query('SELECT * FROM productos WHERE prod_id = ?', [id]);
    updated.prod_imagen = buildImageUrl(req, updated.prod_imagen);
    res.json(updated);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// DELETE
export const deleteProductosxid = async (req, res) => {
  try {
    const { id } = req.params;
    // obtenemos la ruta de la imagen
    const [[old]] = await conmysql.query('SELECT prod_imagen FROM productos WHERE prod_id = ?', [id]);
    if (!old) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    // borramos el registro
    const [result] = await conmysql.query('DELETE FROM productos WHERE prod_id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    // borramos archivo de imagen
    if (old.prod_imagen) deleteFile(old.prod_imagen);
    res.sendStatus(204);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};