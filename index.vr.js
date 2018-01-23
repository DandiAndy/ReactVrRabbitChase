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
        Object.keys(creatures).forEach((c) => {InfoDOM.push(this.renderCreatureInfo(c))});
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

    constructor(props){
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
                }
            }
        }
    }

    /*START ANIMATIONS*/

    componentDidMount(){
        this.foxRun();
        this.foxBounce();
        this.rabbitRun();
        this.rabbitBounce();
    }

    /*ANIMATIONS*/

    foxRun = () => {
        let fox = this.state.creatures.fox;
        fox.rotY.setValue(0);
        Animated.timing(
            fox.rotY,
            {
                toValue: -360,
                duration: 4000, //in millis
            }
        ).start(this.foxRun);
    };

    rabbitRun = () => {
        let rabbit = this.state.creatures.rabbit;
        rabbit.rotY.setValue(0);
        Animated.timing(
            rabbit.rotY,
            {
                toValue: -360,
                duration: 4000, //in millis
            }
        ).start(this.rabbitRun);
    };

    foxBounce = () => {
        let fox = this.state.creatures.fox;
        Animated.sequence([
            //UP
            Animated.parallel([
                Animated.timing(
                    fox.posY,
                    {
                        toValue: -0.9,
                        duration: 500,
                    }
                ),
                Animated.timing(
                    fox.rotX,
                    {
                        toValue: -15,
                        duration: 500,
                    }
                )
            ]),
            //DOWN
            Animated.parallel([
                Animated.timing(
                    fox.posY,
                    {
                        toValue: -1,
                        duration: 500,
                    }
                ),
                Animated.timing(
                    fox.rotX,
                    {
                        toValue: 0,
                        duration: 500,
                    }
                )
            ])
        ]).start(this.foxBounce);
    };

    rabbitBounce = () => {
        let rabbit = this.state.creatures.rabbit;
        Animated.sequence([
            //UP
            Animated.parallel([
                Animated.timing(
                    rabbit.posY,
                    {
                        toValue: -0.8,
                        duration: 500,
                    }
                ),
                Animated.timing(
                    rabbit.rotX,
                    {
                        toValue: 20,
                        duration: 500,
                    }
                )
            ]),
            //DOWN
            Animated.parallel([
                Animated.timing(
                    rabbit.posY,
                    {
                        toValue: -1,
                        duration: 500,
                    }
                ),
                Animated.timing(
                    rabbit.rotX,
                    {
                        toValue: 0,
                        duration: 500,
                    }
                )
            ])
        ]).start(this.rabbitBounce);
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
