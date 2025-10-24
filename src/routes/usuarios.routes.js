import { Router } from "express";
import { authenticateJWT } from '../auth.js';
import {
  getUsuarios,
  getUsuarioById,
  postUsuario,
  putUsuario,
  patchUsuario,
  deleteUsuario,
  login,
} from "../controladores/usuariosCtrl.js";

const router = Router();
router.post('/login', login);
router.post("/usuarios", postUsuario);
router.use(authenticateJWT); // a partir de esta lineas, las demás urls necesitarán autenticación
router.get("/usuarios", getUsuarios);
router.get("/usuarios/:id", getUsuarioById);
router.put("/usuarios/:id", putUsuario);
router.patch("/usuarios/:id", patchUsuario);
router.delete("/usuarios/:id", deleteUsuario);
export default router;