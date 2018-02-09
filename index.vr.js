import React from 'react';
import {
    AppRegistry,
    asset,
    Pano,
    Text,
    View,
    Model,
    Animated,
    AmbientLight,
} from 'react-vr';

// set the Model component to work with the Animated API.
const AnimatedModel = Animated.createAnimatedComponent(Model);

class CreatureInfo extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        return(

            <Text className="creatureInfo">
                {this.props.name} fact: {this.props.fact}.
            </Text>

        );
    }
}


class InfoBox extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            bgColour: '#f2af3a',
        };
    }

    renderCreatureInfo(c, id){
        let creature = this.props.creatures[c];
        // create props to use in the CreatureInfo component.
        return <CreatureInfo key={id} name={creature.name} fact={creature.fact}/>
    }

    render(){
        let creatures = this.props.creatures;
        let InfoDOM = [];
        Object.keys(creatures).forEach((c, index) => {InfoDOM.push(this.renderCreatureInfo(c, index))});
        return (
            <View className="infoBox"
                  style={{
                    transform: [{translate: [0, 0, -3]}],
                    layoutOrigin: [0.5, 0.5],
                    padding: 0.1,
                    borderRadius: 0.1,
                    backgroundColor: this.state.bgColour,
                  }}
                  onEnter={() => this.setState({bgColour: '#fcbf55'})}
                  onExit={() => this.setState({bgColour: '#f2af3a'})}>
                {InfoDOM}
            </View>
        );
    }
}

class RabbitChase extends React.Component {

    /*CONSTRUCTOR FOR ENTIRE SCENE*/
    constructor(props) {
        super(props);

        // set the original state of the scene. Sets up all the creatures.
        // note that the creatures use Animated.Value instead of regular floats.
        this.state = {
            active_creatures: [
                {
                    fact: "A group of foxes is called a skulk.",
                    name: "Fox",
                    rotX: new Animated.Value(0),
                    rotY: new Animated.Value(0),
                    rotZ: new Animated.Value(0),
                    posX: new Animated.Value(2.0),
                    posY: new Animated.Value(-1.0),
                    posZ: new Animated.Value(0),
                    scale: 0.03,
                    jumpUp: true,
                    mtl: './beasts/fox.mtl',
                    obj: './beasts/fox.obj',
                },
                {
                    fact: "More than half of the world's rabbits live in North America.",
                    name: "Rabbit",
                    rotX: new Animated.Value(0),
                    rotY: new Animated.Value(0),
                    rotZ: new Animated.Value(0),
                    posX: new Animated.Value(2.0),
                    posY: new Animated.Value(-0.7),
                    posZ: new Animated.Value(0),
                    scale: 0.1,
                    jumpUp: false,
                    mtl: "./beasts/rabbit.mtl",
                    obj: './beasts/rabbit.obj',
                },
                {
                    fact: "Rats take care of injured and sick rats in their group.",
                    name: "Rat",
                    rotX: new Animated.Value(0),
                    rotY: new Animated.Value(0),
                    rotZ: new Animated.Value(0),
                    posX: new Animated.Value(2.0),
                    posY: new Animated.Value(-1.0),
                    posZ: new Animated.Value(0),
                    scale: 0.03,
                    jumpUp: true,
                    mtl: './beasts/rat.mtl',
                    obj: './beasts/rat.obj',
                },
                {
                    fact: "Goat meat is the most consumed meat per capita worldwide.",
                    name: "Goat",
                    rotX: new Animated.Value(0),
                    rotY: new Animated.Value(0),
                    rotZ: new Animated.Value(0),
                    posX: new Animated.Value(2.0),
                    posY: new Animated.Value(-1.0),
                    posZ: new Animated.Value(0),
                    scale: 0.03,
                    jumpUp: false,
                    mtl: './beasts/goat.mtl',
                    obj: './beasts/goat.obj',
                },
                {
                    fact: "Most deer are born with white spots but lose them within a year.",
                    name: "Deer",
                    rotX: new Animated.Value(0),
                    rotY: new Animated.Value(0),
                    rotZ: new Animated.Value(0),
                    posX: new Animated.Value(2.0),
                    posY: new Animated.Value(-1.0),
                    posZ: new Animated.Value(0),
                    scale: 0.03,
                    jumpUp: false,
                    mtl: './beasts/deer.mtl',
                    obj: './beasts/deer.obj',
                },
                {
                    fact: "Cows can hear lower and higher frequencies better than humans.",
                    name: "Cow",
                    rotX: new Animated.Value(0),
                    rotY: new Animated.Value(0),
                    rotZ: new Animated.Value(0),
                    posX: new Animated.Value(2.0),
                    posY: new Animated.Value(-1.0),
                    posZ: new Animated.Value(0),
                    scale: 0.035,
                    jumpUp: false,
                    mtl: './beasts/cow.mtl',
                    obj: './beasts/cow.obj',
                },
                {
                    fact: "Adult pigs have 44 teeth.",
                    name: "Pig",
                    rotX: new Animated.Value(0),
                    rotY: new Animated.Value(0),
                    rotZ: new Animated.Value(0),
                    posX: new Animated.Value(2.0),
                    posY: new Animated.Value(-1.0),
                    posZ: new Animated.Value(0),
                    scale: 0.09,
                    jumpUp: false,
                    mtl: './beasts/pig.mtl',
                    obj: './beasts/pig.obj',
                }
            ],

            disabled_creatures:[],
            active_creature_models:[],
        };
    }

    /*INIT*/
    componentDidMount (){
        let creatures = this.state.active_creatures;
        let count = creatures.length;
        let rotation = 0;
        let models = [];

        // setup creature models as components and set current rotation base on count.
        creatures.forEach((creature, index) => {
            models.push(this.renderCreature(creature, index, rotation));
            rotation = rotation + (360/count);  //position is based on the number of beasts.
        });

        // set the state to force a refresh of the scene.
        this.setState({
            active_creature_models: models,
        });

        // set the animation for each creature.
        creatures.forEach((creature) => {
            this.run(creature, 7000, creature.rotY._value);
            this.bounce(creature, 0.7);
        });
    }

    /*ANIMATIONS*/


    run = (creature, millis, rotation) => {     //run animation for each creature.
        // set rotation back to the original rotation
        creature.rotY.setValue(rotation);
        // animate to rotate around the center 360 degrees over the time defined in millis.
        Animated.timing(
            creature.rotY,
            {
                toValue: rotation+360,
                duration: millis, //in milliseconds
            }
        ).start(() => this.run(creature, millis, rotation));
        //.start(callback) will call on run again. Repeats infinitely.
    };

    bounce = (creature, bounciness) => {        //bounce animation for each creature.

        Animated.sequence([
            // UP
            // Animated.parallel allows each of the animation inside it to be run at the same time.
            Animated.parallel([
                // moves the creature up in the y-axis
                Animated.timing(
                    creature.posY,
                    {
                        toValue: -1*bounciness, //bounces higher with lower bounce number (range of 0-1).
                        duration: 500,
                    }
                ),
                // tips the creatures up on it's x-axis
                Animated.timing(
                    creature.rotX,
                    {
                        toValue: -15,
                        duration: 500,
                    }
                )
            ]),
            //DOWN
            Animated.parallel([
                // moves the creature down in the y-axis
                Animated.timing(
                    creature.posY,
                    {
                        toValue: -1,
                        duration: 500,
                    }
                ),
                // tips the creatures down on it's x-axis
                Animated.timing(
                    creature.rotX,
                    {
                        toValue: 0,
                        duration: 500,
                    }
                )
            ])
        ]).start(() => this.bounce(creature, bounciness));
    };

    /*FUNCTIONS*/
    // creates the creature component.
    renderCreature(creature, id, rotation){
        creature.rotY.setValue(rotation);
        return (
            /* note the ordering of the transformation. It occurs in order of bottom to top.
             * Hence the scaling happens first, then the rotateX, then ..., and finallly the rotY.
              * This is significant because the order of a transform is important the location in
              * the scene.*/
            // set creature as a prop of AnimatedModel
            <AnimatedModel key={id}
                           creature={creature}
                           lit={true}
                           style={{
                               transform: [
                                   {rotateY: creature.rotY},
                                   {rotateZ: creature.rotZ},
                                   {translate: [creature.posX, creature.posY, creature.posZ]},
                                   {rotateX: creature.rotX},
                                   {scale: creature.scale}]
                           }}
                           source={{obj: asset(creature.obj), mtl:asset(creature.mtl)}}/>
        );
    }

    /*RENDER SCENE*/
    render() {
        let creatures = this.state.active_creatures;
        // Pano is a panoramic picture wrapped around the scene.
        // AmbientLight sets the lighting of the scene.
        // InfoBox is a component that details what is animals will say.
        return (
            <View>
                <AmbientLight intensity={1}/>
                <Pano source={asset('outside.jpg')}/>
                {this.state.active_creature_models}
                <InfoBox creatures={creatures}/>
            </View>
        );
    }

}

AppRegistry.registerComponent('RabbitChase', () => RabbitChase);
