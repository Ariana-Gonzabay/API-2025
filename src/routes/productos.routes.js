import { Router } from "express";
import { authenticateJWT } from '../auth.js';
import multer from "multer";
import { deleteProductosxid, getProductos, getProductoxid, patchProductos, postProductos, putProductos } from "../controladores/productosCtrl.js";

const storage= multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads");
    },
    filename:(req,file,cb)=>{
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

const uploads = multer({storage});

const router=Router();
router.use(authenticateJWT); // A partir de aqui, las demas rutas necesitan autentiacion
router.get('/productos',getProductos)
router.get('/productos/:id',getProductoxid)
router.post('/productos',uploads.single("prod_imagen"),postProductos)
router.put('/productos/:id',putProductos)
router.patch('/productos/:id',patchProductos)
router.delete('/productos/:id',deleteProductosxid)

export default router