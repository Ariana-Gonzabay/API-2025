import { conmysql } from "../bd.js";

// ===============================
// LISTAR TODAS LAS CATEGORÍAS
// ===============================
export const getCategorias = async (req, res) => {
  try {
    const [result] = await conmysql.query("SELECT * FROM categorias ORDER BY cat_nombre ASC");

    res.json({
      cant: result.length,
      data: result
    });

  } catch (error) {
    console.error("Error en getCategorias:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};


// ===============================
// OBTENER CATEGORÍA POR ID
// ===============================
export const getCategoriaById = async (req, res) => {
  try {
    const [result] = await conmysql.query(
      "SELECT * FROM categorias WHERE cat_id = ?",
      [req.params.id]
    );

    if (result.length === 0)
      return res.status(404).json({
        cat_id: 0,
        message: "Categoría no encontrada"
      });

    res.json(result[0]);

  } catch (error) {
    console.error("Error en getCategoriaById:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};


// ===============================
// INSERTAR CATEGORÍA
// ===============================
export const postCategoria = async (req, res) => {
  try {
    const { cat_nombre, cat_descripcion } = req.body;

    const [result] = await conmysql.query(
      "INSERT INTO categorias(cat_nombre, cat_descripcion) VALUES (?, ?)",
      [cat_nombre, cat_descripcion]
    );

    res.json({
      id: result.insertId,
      message: "Categoría registrada correctamente"
    });

  } catch (error) {
    console.error("Error en postCategoria:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};


// ===============================
// UPDATE TOTAL (PUT)
// ===============================
export const putCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { cat_nombre, cat_descripcion } = req.body;

    const [result] = await conmysql.query(
      `UPDATE categorias 
       SET cat_nombre = ?, cat_descripcion = ?
       WHERE cat_id = ?`,
      [cat_nombre, cat_descripcion, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Categoría no encontrada" });

    const [row] = await conmysql.query("SELECT * FROM categorias WHERE cat_id = ?", [id]);
    res.json(row[0]);

  } catch (error) {
    console.error("Error en putCategoria:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};


// ===============================
// PATCH (ACTUALIZACIÓN PARCIAL)
// ===============================
export const patchCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { cat_nombre, cat_descripcion } = req.body;

    const [result] = await conmysql.query(
      `UPDATE categorias 
       SET 
         cat_nombre = IFNULL(?, cat_nombre),
         cat_descripcion = IFNULL(?, cat_descripcion)
       WHERE cat_id = ?`,
      [cat_nombre, cat_descripcion, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Categoría no encontrada" });

    const [row] = await conmysql.query("SELECT * FROM categorias WHERE cat_id = ?", [id]);
    res.json(row[0]);

  } catch (error) {
    console.error("Error en patchCategoria:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};


// ===============================
// DELETE
// ===============================
export const deleteCategoria = async (req, res) => {
  try {
    const [result] = await conmysql.query(
      "DELETE FROM categorias WHERE cat_id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Categoría no encontrada" });

    res.sendStatus(204);

  } catch (error) {
    console.error("Error en deleteCategoria:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

