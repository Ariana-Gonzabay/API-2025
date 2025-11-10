
import { authenticateJWT } from '../auth.js';
import { Router } from "express";
import {
  getDetalles,
  getDetalleById,
  postDetalle,
  putDetalle,
  patchDetalle,
  deleteDetalle,
} from "../controladores/pedidosDetalleCtrl.js";

const router = Router();
router.use(authenticateJWT); // A partir de aqui, las demas rutas necesitan autentiacion
router.get("/pedidos_detalle", getDetalles);
router.get("/pedidos_detalle/:id", getDetalleById);
router.post("/pedidos_detalle", postDetalle);
router.put("/pedidos_detalle/:id", putDetalle);
router.patch("/pedidos_detalle/:id", patchDetalle);
router.delete("/pedidos_detalle/:id", deleteDetalle);
export default router;
