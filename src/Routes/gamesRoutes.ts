import { Router } from 'express';
import { protect } from '../Middleware/authMiddleware.ts';
import { getGames , PlayRoulette} from "../Controllers/gamesController.ts";

const GamesRouter = Router();

GamesRouter.get("/getGames" , protect , getGames)
GamesRouter.get("/" , protect , PlayRoulette)

export default GamesRouter;