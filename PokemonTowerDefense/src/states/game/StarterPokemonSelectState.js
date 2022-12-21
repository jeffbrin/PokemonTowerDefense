import Vector from '../../../lib/Vector.js';
import ImageName from '../../enums/ImageName.js';
import { canvas, CANVAS_WIDTH, getUsername, playBackgroundMusic, pokemonFactory, sounds, stateStack } from '../../globals.js';
import CutScenePerson from '../../objects/CutScenePerson.js';
import Background from '../../user-interface/Background.js';
import Panel from '../../user-interface/Panel.js';
import StateThatSaves from '../StateThatSaves.js';
import CutSceneState from './CutSceneState.js';
import DialogueBoxState from './DialogBoxState.js';
import PlayState from './play/PlayState.js';
import TransitionState from './TransitionState.js';
import TweeningState from './TweeningState.js';
import Inventory from '../../objects/Inventory.js';
import PokemonFactory from '../../services/PokemonFactory.js';
import LevelSelectState from './LevelSelectState.js';
import SoundName from '../../enums/SoundName.js';
import SelectState from './SelectState.js';
import PokedexNumber from '../../enums/PokedexNumber.js';
export default class StarterPokemonSelectState extends StateThatSaves
{
    constructor()
    {
        super();
        this.background = new Background();

    }
    async enter()
    {


        const oak = new CutScenePerson(new Vector(canvas.width, 0), new Vector(CutScenePerson.OAK_SIZE.x, CutScenePerson.OAK_SIZE.y), ImageName.CutSceneOak);
        this.oak = oak;
        const nidoran = new CutScenePerson(new Vector(canvas.width, 0), new Vector(CutScenePerson.POKEMON_SIZE.x, CutScenePerson.POKEMON_SIZE.y), ImageName.Nidoran);
        this.nidoran = nidoran;
        const squirtle = new CutScenePerson(new Vector(CANVAS_WIDTH, 10), new Vector(CutScenePerson.POKEMON_SIZE.x / 2, CutScenePerson.POKEMON_SIZE.y / 2), ImageName.Squirtle);
        const bulbasaur = new CutScenePerson(new Vector(-200, 100), new Vector(CutScenePerson.POKEMON_SIZE.x / 2, CutScenePerson.POKEMON_SIZE.y / 2), ImageName.Bulbasaur);
        const charmander = new CutScenePerson(new Vector(CANVAS_WIDTH, 0), new Vector(CutScenePerson.POKEMON_SIZE.x / 2, CutScenePerson.POKEMON_SIZE.y / 2), ImageName.Charmander);
        //look into maybe having a this.squirtle etc and then in the callback set a renderSquirtle bool to true and if true then render in the render() of StarterPokemonSelectState, do this for each starter

        const pokemonCutScene = [bulbasaur, charmander, squirtle];
        let indexOfSelectedPokemon;
        // Create the playstate to push later in the cutscene.
        const playState = await PlayState.createPlaystate(1, Inventory.getInstance(), true);
        stateStack.push(new CutSceneState(
            [
                (callback) => stateStack.push(new DialogueBoxState(`Hey there ${getUsername()}!`, Panel.BOTTOM_DIALOGUE, callback)),
                (callback) => stateStack.push(new TweeningState([oak], [oak.position], [['x']], [[0]], [1], "Welcome to the world of Pokémon. My Name is Professor Oak.", callback)),
                (callback) => stateStack.push(new TweeningState([oak], [oak.dimensions], [['x', 'y']], [[CutScenePerson.OAK_SIZE.x / 2, CutScenePerson.OAK_SIZE.y / 2]], [1], "This world is inhabited far and wide by creatures called pokémon.", callback)),
                (callback) => stateStack.push(new TweeningState([nidoran, oak], [nidoran.position, oak.position], [['x'], ['y']], [[125], [oak.position.x]], [1, 1], "Here is one example, this little guy is called Nidoran", callback)),
                (callback) => stateStack.push(new TweeningState([nidoran, nidoran, oak], [nidoran.position, nidoran.dimensions, oak.position], [['x', 'y'], ['x', 'y'], ['x']], [[oak.position.x + oak.dimensions.x + 5, 100], [100, 100], [oak.position.x]], [1, 1, 1], "Let's Get Started!", callback)),
                (callback) =>
                {
                    TransitionState.fade(() =>
                    {
                        stateStack.push(playState);
                        playBackgroundMusic(SoundName.GeneralBackground);
                        playState.level.pause();
                        playState.removeEventListeners();
                        callback();
                    });
                },
                (callback) => stateStack.push(new DialogueBoxState("To Start Off Your Journey You'll have the Option Between 3 Pokemon", Panel.BOTTOM_DIALOGUE, callback)),
                (callback) => {setTimeout(() => {sounds.play(`Pokemon${PokedexNumber.Squirtle}`)}, 1000); stateStack.push(new TweeningState([squirtle], [squirtle.position], [['x', 'y']], [[100, 50]], [1], "First there is the Mighty Squirtle!", callback))},
                (callback) => {setTimeout(() => {sounds.play(`Pokemon${PokedexNumber.Bulbasaur}`)}, 1000); stateStack.push(new TweeningState([bulbasaur, squirtle], [bulbasaur.position, squirtle.position], [['x', 'y'], ['x']], [[100, 150], [squirtle.position.x]], [1, 1], "Second, the Fierce Bulbasaur!", callback))},
                (callback) => {setTimeout(() => {sounds.play(`Pokemon${PokedexNumber.Charmander}`)}, 1000); stateStack.push(new TweeningState([charmander, squirtle, bulbasaur], [charmander.position, squirtle.position, bulbasaur.position], [['x', 'y'], ['x'], ['x']], [[200, 100], [squirtle.position.x], [bulbasaur.position.x]], [1, 1, 1], "Last but not least, the Scorching Hot Charmander!", callback))},
                (callback) => stateStack.push(new TweeningState([charmander, squirtle, bulbasaur], [charmander.position, squirtle.position, bulbasaur.position], [['x', 'y'], ['x'], ['x']], [[200, 100], [squirtle.position.x], [bulbasaur.position.x]], [1, 1, 1], "Select Your Pokémon!", callback)),
                (callback) =>
                {
                    stateStack.push(new SelectState(pokemonCutScene, callback));
                },
                (callback) =>
                {
                    // Pop the playstate and this state off the statestack and add the playstate back
                    stateStack.pop();
                    stateStack.pop();
                    stateStack.pop();
                    const levelSelectState = new LevelSelectState();
                    stateStack.push(levelSelectState);
                    levelSelectState.removeEventListeners();
                    stateStack.push(playState);
                    // playState.level.unpause();
                    callback();
                }
            ]));

    }
    exit()
    {
        super.exit();
    }
    update(dt)
    {

    }
    render()
    {
        this.background.render();
        this.oak.render();
        this.nidoran.render();
    }
}