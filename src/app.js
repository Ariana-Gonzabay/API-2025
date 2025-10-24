
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import clientesRoutes from "./routes/clientes.routes.js";
import pedidosRoutes from "./routes/pedidos.routes.js";
/* import pedidosDetalleRoutes from "./routes/pedidosDetalle.routes.js"; */
import usuariosRoutes from "./routes/usuarios.routes.js";
import productosRoutes from "./routes/productos.routes.js"

//definir los módulos de entrada
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

//definir los permisos
const corsOptions ={
  origin:"*",// direcciones de dominio que pueden usar
  methods: ["GET","POST","PUT","PATCH","DELETE"],
  credential:true
}

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para form-urlencoded
app.use("/uploads",express.static(path.join(__dirname,"../uploads")));



app.use("/api", clientesRoutes);
app.use("/api", pedidosRoutes);
/* app.use("/api", pedidosDetalleRoutes); */
app.use("/api", usuariosRoutes);
app.use("/api", productosRoutes);
app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint not found"  });
});

export default app;