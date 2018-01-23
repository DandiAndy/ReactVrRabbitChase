import React from 'react';
import {
    AppRegistry,
    asset,
    Pano,
    Text,
    View,
    Model,

} from 'react-vr';


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
        return <CreatureInfo id={id} name={creature.name} sound={creature.sound}/>
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
    constructor(props){
        super(props);
        this.state = {
            creatures: {
                rabbit: {
                    sound: "REEEEEEEEEEEEEEEEEE",
                    name: "Rabbit",
                    rotX: 0.0,
                    rotY: 0.0,
                    rotZ: 0.0,
                    posX: -1.0,
                    posY: -0.7,
                    posZ: 0.0,
                    jumpUp: false,
                },
                fox: {
                    sound: "bork",
                    name: "Fox",
                    rotX: 0.0,
                    rotY: 0.0,
                    rotZ: 0.0,
                    posX: 1.0,
                    posY: -1.0,
                    posZ: 0.0,
                    jumpUp: true,
                }
            }
        }
    }

    walk(){
        let fox = this.state.creatures.fox;
        let rabbit = this.state.creatures.rabbit;
        fox.rotY = this.state.creatures.fox.rotY - 2;
        rabbit.rotY = this.state.creatures.rabbit.rotY - 2;
        this.setState({fox, rabbit});
    }

    bounce(creature, boundIntensity){
        if(creature.jumpUp){
            creature.posY = creature.posY + 0.01;
            creature.rotX = creature.rotX - boundIntensity;
            this.setState({creature});
            if(creature.posY >= -0.7){
                creature.jumpUp = false;
                this.setState({creature});
            }
        }else{
            creature.posY = creature.posY - 0.01;
            creature.rotX = creature.rotX + boundIntensity;
            this.setState({creature});
            if(creature.posY <= -1){
                creature.jumpUp = true;
                this.setState({creature});
            }
        }
    }


    componentDidMount(){
        this.walkInterval = setInterval(() => this.walk(), 10);
        let fox = this.state.creatures.fox;
        let rabbit = this.state.creatures.rabbit;
        this.foxBounceInterval = setInterval(() => this.bounce(fox, 0.25), 10);
        this.rabbitBounceInterval = setInterval(() => this.bounce(rabbit, 1), 10);
    }

    componentWillUnmount() {
        clearInterval(this.walkInterval);
        clearInterval(this.foxBounceInterval);
        clearInterval(this.rabbitBounceInterval);
    }

    render() {
        let creatures = this.state.creatures;
        return (
            <View>
                <Pano source={asset('outside.jpg')}/>
                <Model style={{
                    transform: [
                        {rotateY: creatures.fox.rotY},
                        {rotateZ: creatures.fox.rotZ},
                        {translate: [creatures.fox.posX, creatures.fox.posY, creatures.fox.posZ]},
                        {rotateX: creatures.fox.rotX},
                        {scale: 0.005}]}}
                       source={{obj: asset('./beasts/fox.obj'), mtl:asset('./beasts/fox.mtl')}}
                />
                <Model style={{
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
