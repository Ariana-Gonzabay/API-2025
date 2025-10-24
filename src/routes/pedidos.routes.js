import { authenticateJWT } from '../auth.js';
import { Router } from "express";
import {
  getPedidos,
  getPedidoById,
  postPedido,
  putPedido,
  patchPedido,
  deletePedido,
} from "../controladores/pedidosCtrl.js";

const router = Router();
router.use(authenticateJWT);
router.get("/pedidos", getPedidos);
router.get("/pedidos/:id", getPedidoById);
router.post("/pedidos", postPedido);
router.put("/pedidos/:id", putPedido);
router.patch("/pedidos/:id", patchPedido);
router.delete("/pedidos/:id", deletePedido);
export default router;