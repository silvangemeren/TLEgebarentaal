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

const v1 = express.Router()

// Files die geen authorisatie en accept json nodig hebben
v1.use('/videos', videos);
v1.use('/gifs', gifs);
v1.use('/handshapes', handshapes);
v1.use('/mouthshapes', mouthshapes);

// Authentication routes
v1.use('/auth', authRoutes);

// Middleware voor authenticatie
v1.use(authenticateUser);
v1.use(validateApiKey);

// **Routes met autorisatie**
v1.use('/apikeys', authorize('admin'), apiKeysRouter); // Alleen admin toegang
v1.use('/signs', authorize('teacher', 'admin', 'student'), signs);
v1.use('/wordgroups', authorize('teacher', 'admin', 'student'), wordgroups);
v1.use('/about', authorize('teacher', 'admin', 'student'), aboutRoutes);
v1.use('/theorybook', authorize('teacher', 'admin', 'student'), theorybook);
v1.use('/playlist', authorize('teacher', 'admin', 'student'), customplaylist);
v1.use('/users', authorize('teacher', 'admin'), users);
v1.use('/logincodes', authorize('teacher', 'admin'), loginCodes);

export default v1;