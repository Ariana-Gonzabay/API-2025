import { Router } from "express";
import { authenticateJWT } from '../auth.js';

import {
  getCategorias,
  getCategoriaById,
  postCategoria,
  putCategoria,
  patchCategoria,
  deleteCategoria
} from "../controladores/categoriasCtrl.js";

const router = Router();

router.use('/categorias', authenticateJWT); // Todas requieren token

router.get("/categorias", getCategorias);
router.get("/categorias/:id", getCategoriaById);
router.post("/categorias", postCategoria);
router.put("/categorias/:id", putCategoria);
router.patch("/categorias/:id", patchCategoria);
router.delete("/categorias/:id", deleteCategoria);

export default router;
