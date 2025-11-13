import { pool } from "../bd.js";

export const registrarCategoria = async (req, res) => {
  try {
    const { cat_nombre, cat_descripcion } = req.body;

    if (!cat_nombre) {
      return res.status(400).json({
        message: "El nombre de la categoría es obligatorio",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO categorias (cat_nombre, cat_descripcion)
       VALUES (?, ?)`,
      [cat_nombre, cat_descripcion || null]
    );

    res.json({
      message: "Categoría registrada correctamente",
      cat_id: result.insertId,
    });
  } catch (error) {
    console.log("Error en registrarCategoria:", error);
    res.status(500).json({ message: "Error al registrar categoría" });
  }
};

export const listarCategorias = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM categorias ORDER BY cat_nombre`
    );
    res.json(rows);
  } catch (error) {
    console.log("Error en listarCategorias:", error);
    res.status(500).json({ message: "Error al obtener categorías" });
  }
};
