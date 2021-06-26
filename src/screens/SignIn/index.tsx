import React from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    ActivityIndicator
} from 'react-native';

import Ilustration from '../../assets/illustration.png'
import { ButtonIcon } from '../../components/ButtonIcon';
import { styles } from './styles'
import { useNavigation } from '@react-navigation/native'
import { Background } from '../../components/Background';

import { UseAuth } from '../../hooks/auth';
import { theme } from '../../global/styles/theme';

export function SignIn() {

    const { loading, signIn } = UseAuth();

    async function handleSignIn() {
        try {
            await signIn();
        } catch (error) {
            Alert.alert(error)
        }
    }

    return (
        <Background>
            <View style={styles.container}>
                <Image
                    source={Ilustration}
                    style={styles.image}
                    resizeMode='stretch'
                />
                <View style={styles.content}>
                    <Text style={styles.title}>
                        Conecte-se {'\n'}
                        e organize {'\n'}
                        suas jogatinas
                    </Text>
                    <Text style={styles.subtitle}>
                        Crie grupos para jogar seus games {'\n'}
                        favoritos com seus amigos
                    </Text>

                    {
                        loading ? 
                        <ActivityIndicator color={theme.colors.primary} /> 
                        :
                        <ButtonIcon
                            title='Entrar com discord'
                            onPress={handleSignIn}
                        />
                    }
                </View>
            </View>
        </Background>
    );
}
