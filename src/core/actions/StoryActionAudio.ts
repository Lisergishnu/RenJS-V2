import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionAudio extends StoryAction {

	protected params: {actor:string, looped: boolean, transition: string, actorType}

    constructor(params, game, private action) {
    	super(params,game)
    }

    execute(): void {
        if (this.action=='play'){
            if (this.params.actorType === 'bgm') {
                this.game.managers.audio.play(this.params.actor, 'bgm', this.params.looped, this.params.transition);
            } else {
                this.game.managers.audio.playSFX(this.params.actor);
            }
        } else {
            this.game.managers.audio.stop('bgm', this.params.transition);
        }
        this.resolve()
    }
}