import React from 'react';
import {
    AppRegistry,
    asset,
    Pano,
    Text,
    View,
    Model,
    Animated,
} from 'react-vr';


const AnimatedModel = Animated.createAnimatedComponent(Model);

class CreatureInfo extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        return(

            <Text className="creatureInfo">
                {this.props.name} says {this.props.sound}.
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
                rabbit: {
                    sound: "REEEEEEEEEEEEEEEEEE",
                    name: "Rabbit",
                    rotX: new Animated.Value(0),
                    rotY: new Animated.Value(0),
                    rotZ: new Animated.Value(0),
                    posX: new Animated.Value(-1.0),
                    posY: new Animated.Value(-0.7),
                    posZ: new Animated.Value(0),
                    jumpUp: false,
                    poem: [
                        "Fox says bork.\n Rabbit says REEEE.",
                        "Little Rabbit.\n Just wants to be free.",
                        "Run and run.\n Leave him be.",
                        "He wants to live.\n Can't you see?"
                    ]
                },
                fox: {
                    sound: "bork",
                    name: "Fox",
                    rotX: new Animated.Value(0),
                    rotY: new Animated.Value(0),
                    rotZ: new Animated.Value(0),
                    posX: new Animated.Value(1.0),
                    posY: new Animated.Value(-1.0),
                    posZ: new Animated.Value(0),
                    jumpUp: true,
                    poem: [
                        "Fox says bork.\n Rabbit says REEEE.",
                        "Little Rabbit.\n Just wants to be free.",
                        "Run and run.\n Leave him be.",
                        "He wants to live.\n Can't you see?"
                    ]
                }
            }
        };
    }

    /*START ANIMATIONS*/

    componentDidMount (){
        let fox = this.state.creatures.fox;
        let rabbit = this.state.creatures.rabbit;
        this.run(fox, 4000);
        this.run(rabbit, 4000);
        this.bounce(rabbit, 0.7);
        this.bounce(fox, 0.9);
    }

    /*ANIMATIONS*/
    run = (creature, timing) => {
        creature.rotY.setValue(0);
        Animated.timing(
            creature.rotY,
            {
                toValue: -360,
                duration: timing, //in millis
            }
        ).start(() => this.run(creature, timing));
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

    /*RENDER SCENE*/
    render() {
        let creatures = this.state.creatures;
        return (
            <View>
                <Pano source={asset('outside.jpg')}/>
                <AnimatedModel style={{
                    transform: [
                        {rotateY: creatures.fox.rotY},
                        {rotateZ: creatures.fox.rotZ},
                        {translate: [creatures.fox.posX, creatures.fox.posY, creatures.fox.posZ]},
                        {rotateX: creatures.fox.rotX},
                        {scale: 0.005}]}}
                       source={{obj: asset('./beasts/fox.obj'), mtl:asset('./beasts/fox.mtl')}}
                />
                <AnimatedModel style={{
                    transform: [
                        {rotateY: creatures.rabbit.rotY},
                        {rotateZ: creatures.rabbit.rotZ},
                        {translate: [creatures.rabbit.posX, creatures.rabbit.posY, creatures.rabbit.posZ]},
                        {rotateX: creatures.rabbit.rotX},
                        {scale: 0.1}]}}
                       source={{obj: asset('./beasts/rabbit.obj'), mtl:asset('./beasts/rabbit.mtl')}}
                />
                <InfoBox creatures={creatures}/>
            </View>
        );
    }

}

AppRegistry.registerComponent('RabbitChase', () => RabbitChase);
