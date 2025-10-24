import { conmysql } from "../bd.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config.js";

export const login = async (req, res) => {
  const { usr_usuario, usr_clave } = req.body;
  const saltRounds = 10;
  try {
    const [rows] = await conmysql.query(
      "SELECT usr_id, usr_clave, usr_activo FROM usuarios WHERE usr_usuario = ?",
      [usr_usuario],
    );
    const user = rows[0];
    //si no existe el usuario
    if (!user) {
      const hashFalso = await bcrypt.hash("constraseña_falsa", saltRounds);
      await bcrypt.compare(usr_clave, hashFalso);
      return res.status(401).json({
        message: "Usuario o contraseña inválidos",
      });
    }
    //se compara la clave dada por el body con la recuperada del usuario
    const match = await bcrypt.compare(usr_clave, user.usr_clave);
    if (!match || !user.usr_activo) {
      //ya sea que el usuario no esté activo o la clave esté mal, se retirna error
      return res.status(401).json({
        message: "Usuario o contraseña inválidos",
      });
    }

    const payload = { sub: user.usr_id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({ token });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getUsuarios = async (req, res) => {
  try {
    const [result] = await conmysql.query("SELECT * FROM usuarios");
    res.json({ count: result.length, data: result });
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getUsuarioById = async (req, res) => {
  try {
    const [result] = await conmysql.query(
      "SELECT * FROM usuarios WHERE usr_id = ?",
      [req.params.id],
    );
    if (result.length <= 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const postUsuario = async (req, res) => {
  try {
    const {
      usr_usuario,
      usr_clave,
      usr_nombre,
      usr_telefono,
      usr_correo,
      usr_activo,
    } = req.body;

    // **Hash de la contraseña antes de guardar**
    const saltRounds = 10;
    const hashed = await bcrypt.hash(usr_clave, saltRounds);

    const [result] = await conmysql.query(
      `INSERT INTO usuarios (usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [usr_usuario, hashed, usr_nombre, usr_telefono, usr_correo, usr_activo],
    );
    res.status(201).json({
      id: result.insertId,
      message: "Creado correctamente",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const putUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      usr_usuario,
      usr_clave,
      usr_nombre,
      usr_telefono,
      usr_correo,
      usr_activo,
    } = req.body;
    const [result] = await conmysql.query(
      `UPDATE usuarios SET usr_usuario=?, usr_clave=?, usr_nombre=?, usr_telefono=?, usr_correo=?, usr_activo=? WHERE usr_id=?`,
      [
        usr_usuario,
        usr_clave,
        usr_nombre,
        usr_telefono,
        usr_correo,
        usr_activo,
        id,
      ],
    );
    if (result.affectedRows <= 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const [row] = await conmysql.query(
      "SELECT * FROM usuarios WHERE usr_id = ?",
      [id],
    );
    res.json(row[0]);
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const patchUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      usr_usuario,
      usr_clave,
      usr_nombre,
      usr_telefono,
      usr_correo,
      usr_activo,
    } = req.body;
    const [result] = await conmysql.query(
      `UPDATE usuarios SET
        usr_usuario=IFNULL(?, usr_usuario),
        usr_clave=IFNULL(?, usr_clave),
        usr_nombre=IFNULL(?, usr_nombre),
        usr_telefono=IFNULL(?, usr_telefono),
        usr_correo=IFNULL(?, usr_correo),
        usr_activo=IFNULL(?, usr_activo)
      WHERE usr_id=?`,
      [
        usr_usuario,
        usr_clave,
        usr_nombre,
        usr_telefono,
        usr_correo,
        usr_activo,
        id,
      ],
    );
    if (result.affectedRows <= 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const [row] = await conmysql.query(
      "SELECT * FROM usuarios WHERE usr_id = ?",
      [id],
    );
    res.json(row[0]);
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const [result] = await conmysql.query(
      "DELETE FROM usuarios WHERE usr_id = ?",
      [req.params.id],
    );
    if (result.affectedRows <= 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};