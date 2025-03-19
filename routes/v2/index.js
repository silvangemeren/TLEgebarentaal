import express from 'express';
import signs from "./signs.js"
import videos from "./videos.js"
import gifs from "./gifs.js"
import handshapes from "./handshapes.js";
import mouthshapes from "./mouthshapes.js";
import customplaylist from "./customplaylist.js"
import theorybook from "./theorybook.js"
import users from "./users.js"
import wordgroups from "./wordgroups.js"
import apiKeysRouter from './apiKeys.js'
import aboutRoutes from "./about.js";
import authRoutes from "./auth.js";
import loginCodes from "./loginCodes.js";
import { authorize} from "../../Middlewares/auth.js";
import validateApiKey from "../../Middlewares/apiAuth.js";
import { authenticateUser } from '../../Middlewares/auth.js';

const v2 = express.Router()

// Files die geen authorisatie en accept json nodig hebben
v2.use('/videos', videos);
v2.use('/gifs', gifs);
v2.use('/handshapes', handshapes);
v2.use('/mouthshapes', mouthshapes);

// Authentication routes
v2.use('/auth', authRoutes);

// Middleware voor authenticatie
v2.use(authenticateUser);
v2.use(validateApiKey);

// **Routes met autorisatie**
v2.use('/apikeys', authorize('admin'), apiKeysRouter); // Alleen admin toegang
v2.use('/wordgroups', authorize('teacher', 'admin', 'student'), wordgroups);
v2.use('/about', authorize('teacher', 'admin', 'student'), aboutRoutes);
v2.use('/theorybook', authorize('teacher', 'admin', 'student'), theorybook);
v2.use('/playlist', authorize('teacher', 'admin', 'student'), customplaylist);
v2.use('/users', authorize('teacher', 'admin'), users);
v2.use('/logincodes', authorize('teacher', 'admin'), loginCodes);

export default v2;