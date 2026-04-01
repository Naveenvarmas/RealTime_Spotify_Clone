import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import { createSong,deleteSong,createAlbum,deleteAlbum,checkAdmin} from "../controllers/admin.controller.js";
const router=Router();
  
// want to optmize code than router.use(protectRoute,requireAdmin) 

router.get("/check",protectRoute,requireAdmin,checkAdmin);

router.post("/songs",protectRoute,requireAdmin,createSong);
router.delete("/songs/:id",protectRoute,requireAdmin,deleteSong);

router.post("/albums",protectRoute,requireAdmin,createAlbum);
router.delete("/albums/:id",protectRoute,requireAdmin,deleteAlbum);
export default router;