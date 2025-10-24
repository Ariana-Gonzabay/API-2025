import { Router } from "express";
import { authenticateJWT } from '../auth.js';
import { getCliente,getClientexid,postClientes,putClientes,patchClientes ,deleteCliente} from "../controladores/clientesCtrl.js";
const router = Router();


//armar las rutas "URL"

router.use(authenticateJWT); // A partir de aqui, las demas rutas necesitan autentiacion
router.get("/clientes",getCliente);
router.get("/clientes/:id",getClientexid);
router.post("/clientes",postClientes);
router.put("/clientes/:id",putClientes)
router.patch("/clientes/:id",patchClientes)
router.delete("/clientes/:id",deleteCliente)
export default router;