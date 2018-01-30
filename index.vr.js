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


const AnimatedModel = Animated.createAnimatedComponent(Model);

class CreatureInfo extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        return(

            <Text className="creatureInfo">
                {this.props.sound} says {this.props.name}.
            </Text>

        );
    }
}


class InfoBox extends React.Component{
    constructor(props){
        super(props);
    }

    renderCreatureInfo(c, id){
        //console.log("Rendered " + c);
        let creature = this.props.creatures[c];
        return <CreatureInfo key={id} name={creature.name} sound={creature.sound}/>
    }

    render(){
        let creatures = this.props.creatures;
        let InfoDOM = [];
        Object.keys(creatures).forEach((c, index) => {InfoDOM.push(this.renderCreatureInfo(c, index))});
        return (
            <View className="infoBox" style={{
                transform: [{translate: [0, 0, -3]}],
                layoutOrigin: [0.5, 0.5],
                padding: 0.1,
                borderRadius: 0.1,
                backgroundColor: '#f4b342',}}>
                {InfoDOM}
            </View>
        );
    }
}

class RabbitChase extends React.Component {

    /*CONSTRUCTOR FOR ENTIRE SCENE*/

    constructor(props) {
        super(props);
        this.state = {
            creatures: {
                fox: {
                    sound: "Bork",
                    name: "fox",
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
                rabbit: {
                    sound: "Snort",
                    name: "rabbit",
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
                rat: {
                    sound: "Squeak",
                    name: "rat",
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
                goat: {
                    sound: "Bleat",
                    name: "goat",
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
                deer: {
                    sound: "Squee",
                    name: "deer",
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
                cow: {
                    sound: "Moo",
                    name: "cow",
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
            }
        };
    }

    /*START ANIMATIONS*/

    componentDidMount (){
        let creatures = this.state.creatures;

        Object.keys(creatures).forEach((c) => {
            this.run(creatures[c], 7000, creatures[c].rotY._value);
            this.bounce(creatures[c], 0.7);
        });

        //this.run(fox, 4000, fox.rotY._value);
        //this.run(rabbit, 4000, rabbit.rotY._value);
        //this.bounce(rabbit, 0.7);
        //this.bounce(fox, 0.9);
    }

    /*ANIMATIONS*/
    run = (creature, timing, rotation) => {
        creature.rotY.setValue(rotation);
        Animated.timing(
            creature.rotY,
            {
                toValue: rotation+360,
                duration: timing, //in millis
            }
        ).start(() => this.run(creature, timing, rotation));
    };

    bounce = (creature, bounciness) => { 
        Animated.sequence([
            //UP
            Animated.parallel([
                Animated.timing(
                    creature.posY,
                    {
                        toValue: -1*bounciness, //bounces higher with lower bounce number (range of 0-1).
                        duration: 500,
                    }
                ),
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
                Animated.timing(
                    creature.posY,
                    {
                        toValue: -1,
                        duration: 500,
                    }
                ),
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

    renderCreature(c, id, rotation){
        let creature = this.state.creatures[c];
        creature.rotY.setValue(rotation);
        return (
            <AnimatedModel key={id} style={{
            transform: [
                {rotateY: creature.rotY},
                {rotateZ: creature.rotZ},
                {translate: [creature.posX, creature.posY, creature.posZ]},
                {rotateX: creature.rotX},
                {scale: creature.scale}]}}
                       source={{obj: asset(creature.obj), mtl:asset(creature.mtl)}}/>
        );
    }

    /*RENDER SCENE*/
    render() {
        let creatures = this.state.creatures;
        let creatureModels = [];
        let count = Object.keys(this.state.creatures).length;
        let rotation = 0;
        Object.keys(creatures).forEach((c, index) => {
            creatureModels.push(this.renderCreature(c, index, rotation));
            rotation = rotation + (360/count);  //position is based on the number of beasts.
        });
        return (
            <View>
                <AmbientLight intensity={100} style={{color: '#ff7f50'}}/>
                <Pano source={asset('outside.jpg')}/>
                {creatureModels}
                <InfoBox creatures={creatures}/>
            </View>
        );
    }

}

AppRegistry.registerComponent('RabbitChase', () => RabbitChase);
