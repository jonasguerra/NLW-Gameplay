import React from "react";
import { 
    View, 
    Text, 
    Alert
} from 'react-native'
import { styles } from "./styles";
import { Avatar } from '../Avatar'
import { UseAuth } from "../../hooks/auth";
import { RectButton } from "react-native-gesture-handler";

export function Profile(){
    
    const { user, signOut } = UseAuth();

    function handleSignOut(){
        Alert.alert('Logout', 'Deseja sair do gameplay?', [
            {
                text: 'Não',
                style: 'cancel',
            },
            {
                text: 'Sim',
                onPress: () => signOut()
            }
        ])
    }

    return(

        <View style={styles.container}>

            <RectButton
                onPress={handleSignOut}
            >
                <Avatar urlImage={user.avatar}/>
            </RectButton>

            <View>
                <View style={styles.user}>
                    <Text style={styles.greeting}>
                        Olá,
                    </Text>
                    <Text style={styles.username}>
                        { user.firstName }
                    </Text>
                </View>
                <Text style={styles.message}>
                    Hoje é dia de vitória
                </Text>
            </View>
        </View>
    );
}