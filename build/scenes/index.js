import { Scenes } from 'telegraf';
import { trackCreateScene } from './trackCreateScene.js';
import { guestScene } from './guestScene.js';
import { userScene } from './userScene.js';
import { trackUpdateCodeScene, trackUpdateDescScene, } from './trackUpdatesScenes.js';
export const wizardStage = new Scenes.Stage([
    guestScene,
    userScene,
    trackCreateScene,
    trackUpdateDescScene,
    trackUpdateCodeScene,
], { ttl: 10 });
