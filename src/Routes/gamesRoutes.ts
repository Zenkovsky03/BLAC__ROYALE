import { Router } from 'express';
import { protect } from '../Middleware/authMiddleware.ts';
import { getGames} from "../Controllers/gamesController.ts";
import  { PlayRoulette } from '../Controllers/rouleteController.ts';

const GamesRouter = Router();

GamesRouter.get("/getGames" , protect , getGames)
GamesRouter.get("/" , protect , PlayRoulette)

export default GamesRouter;