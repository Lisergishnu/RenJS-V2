import RJSManager from './RJSManager';
import Transition from '../screen-effects/Transition';
import RJSGame from '../RJSGame';
import {StoryManagerInterface} from './StoryManager';
import {range} from '../utils/array';
import {RenJS} from '../to-migrate/RenJS';
import {TweenManagerInterface} from './TweenManager';

export interface CGSManagerInterface extends RJSManager {
    cgs: object
    current: object

    hideAll(transition: string)
    show(name: string, transition: () => any, props): any
}

export default class CGSManager implements CGSManagerInterface {

    cgs: object;
    current: object;
    private transition: Transition
    private game: RJSGame
    private storyManager: StoryManagerInterface
    private tweenManager: TweenManagerInterface

    constructor(game: RJSGame) {
        this.game = game
        this.transition = game.RJS.screenEffects.transition
        this.storyManager = game.RJS.managers.story
        this.tweenManager = game.RJS.managers.tween
    }

    async set(current) {
        await this.hideAll(Transition.CUT);
        this.current = current;
        for (const cg in this.current) {
            this.show(cg, this.transition.CUT, this.current[cg])
        }
    }

    async hideAll(transition: string) {
        if (!transition) transition = 'FADEOUT'
        const promises = []
        for (const cg in RenJS.cgsManager.cgs) {
            promises.push(RenJS.cgsManager.hide(cg,transition));
        }
        return Promise.all(promises)
    }

    show (name, transition, props) {
        const position = props.position ? props.position : {x: this.game.world.centerX, y: this.game.world.centerY};
        this.cgs[name] = this.storyManager.cgsSprites.create(position.x, position.y, name);
        this.cgs[name].anchor.set(0.5);
        this.cgs[name].alpha = 0;
        if (props.zoom) {
            this.cgs[name].scale.set(props.zoom);
        }
        if (props.angle) {
            this.cgs[name].angle = props.angle;
        }
        if (this.game.RJS.setup.cgs[name].animations) {
            for (const key in this.game.RJS.setup.cgs[name].animations) {
                const str = this.game.RJS.setup.cgs[name].animations[key].split(' ');
                // range of animation
                const frames = range(parseInt(str[0]), parseInt(str[1]))
                let frameRate = 24;
                if (str.length > 2) {
                    frameRate = parseInt(str[2])
                }
                this.cgs[name].animations.add(key, frames, frameRate)
            }
        }
        this.current[name] = {name: name, position: position, zoom: props.zoom, angle: props.angle};
        return transition(null, this.cgs[name], position);
    }

    async animate (name, toAnimate, time) {
        const tweenables: {
            alpha?: number,
            angle?: number,
            x?: number,
            y?: number,
            height?: number
            width?: number
        } = {}

        if (toAnimate.alpha !== undefined && toAnimate.alpha !== null) {
            tweenables.alpha = toAnimate.alpha;
        }
        if (toAnimate.angle !== undefined && toAnimate.angle !== null) {
            tweenables.angle = toAnimate.angle;
        }
        if (toAnimate.position !== undefined && toAnimate.position !== null) {
            tweenables.x = toAnimate.position.x;
            tweenables.y = toAnimate.position.y;
        }
        if (toAnimate.zoom !== undefined && toAnimate.zoom !== null) {
            if (!this.cgs[name].originalScale) {
                this.cgs[name].originalScale = {width: this.cgs[name].width, height: this.cgs[name].height}
            }
            tweenables.height = this.cgs[name].originalScale.height * toAnimate.zoom;
            tweenables.width = this.cgs[name].originalScale.width * toAnimate.zoom;
        }
        this.current[name] = {...this.current[name], ...toAnimate};
        let resolveFunction = null
        if (toAnimate.spritesheet) {
            if (toAnimate.spritesheet == 'stop') {
                this.cgs[name].animations.stop();
                this.cgs[name].frame = 0;
            } else {
                const str = toAnimate.spritesheet.split(' ');
                // let added
                let animName = str[0];
                // let added
                let looped = str.length > 1 && str[1] == 'looped';
                this.cgs[name].animations.play(animName, null, looped);
                resolveFunction = () => {
                    RenJS.cgsManager.cgs[name].animations.stop();
                    RenJS.cgsManager.cgs[name].frame = 0;
                }
            }
        }
        if (!time) {
            // stopping animation or looped animation
            return;
        }

        this.tweenManager.tween(this.cgs[name], tweenables, resolveFunction, time, true);
    }

    async hide (name, transition) {
        await transition(this.cgs[name], null)
        this.cgs[name].destroy();
        delete this.cgs[name];
        delete this.current[name];
    }

    isCGS (actor) {
        return actor in this.cgs;
    }
}