import React, { useState } from 'react';
import { 
    Text, 
    View, 
    ImageBackground,
    FlatList,
    Alert,
    Share,
    Platform
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as Linking from 'expo-linking'

import { Background } from '../../components/Background';
import { Header } from '../../components/Header';
import { ListHeader } from '../../components/ListHeader';
import { Member, MemberProps } from '../../components/Member';
import { ListDivider } from '../../components/ListDivider';
import { ButtonIcon } from '../../components/ButtonIcon';
import { AppointmentProps } from '../../components/Appointment';
import { Loading } from '../../components/Loading';

import { BorderlessButton } from 'react-native-gesture-handler';
import { Fontisto } from '@expo/vector-icons';
import BannerImg from '../../assets/banner.png';

import { styles } from './styles';

import { api } from '../../services/api';
import { useEffect } from 'react';

type Params = {
    guildSelected: AppointmentProps
}

type GuildWidget = {
    id: string;
    name: string;
    instant_invite: string;
    members: MemberProps[];
    presence_count: number
}

export function AppointmentDetails(){

    const [widget, setWidget] = useState<GuildWidget>({} as GuildWidget);
    const [hasWidgetActivate, setHaswidgetActivate] = useState(false)
    const [loading, setLoading] = useState(true);

    //utilizado para obter os parâmetros que foram passados na chamada. 
    //VER handleAppointmentDetails em screens/home
    const route = useRoute();
    const { guildSelected } = route.params as Params;

    async function fetchGuildWidget() {
        try {
            const response = await api.get(`/guilds/${guildSelected.guild.id}/widget.json`);
            setWidget(response.data);
            setHaswidgetActivate(true)
        } catch (error) {
            Alert.alert('Verifique as configurações do servidor. Será que o widget está habilitado?');
            setHaswidgetActivate(false)
        } finally {
            setLoading(false)
        }        
    }

    function handleShareInvitation(){
        if(hasWidgetActivate){
            const message = Platform.OS === 'ios'
            ? `Junte-se a ${guildSelected.guild.name}`
            : widget.instant_invite
    
            Share.share({
                message,
                url: widget.instant_invite
            })
        }else{
            Alert.alert('Verifique as configurações do servidor. Será que o widget está habilitado?')
        }
    }

    function handleOpenGuild(){
        Linking.openURL(widget.instant_invite)
    }

    useEffect(() => {
        fetchGuildWidget();
    }, []);

    return(
        <Background>
            <Header
                title='Detalhes'
                action={
                    guildSelected.guild.owner && 
                    hasWidgetActivate &&
                    <BorderlessButton
                        onPress={handleShareInvitation}
                    >
                        <Fontisto 
                            name='share'
                            style={styles.share}
                        />
                    </BorderlessButton>
                }
            />

            <ImageBackground
                source={BannerImg}
                style={styles.banner}
            >
                <View style={styles.bannerContent}>
                    <Text style={styles.title}>
                        { guildSelected.guild.name }
                    </Text>
                    <Text style={styles.subtitle}>
                        { guildSelected.description }
                    </Text>
                </View>
            </ImageBackground>

        {
            loading 
            ?
            <Loading /> 
            :
            <>
                {
                    hasWidgetActivate
                    ?
                    <>
                        <ListHeader
                            title='Jogadores'
                            subtitle={`Total ${widget.members.length}`}
                        />
        
                        <FlatList 
                            data={widget.members}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <Member data={item}/>
                            )}
                            ItemSeparatorComponent={() => <ListDivider isCentered/>}
                            style={styles.members}
                        />
                    </>
                    :
                    <View style={styles.widgetDisabled} />
                }
            </>
        }

        {
            guildSelected.guild.owner &&
            <View style={styles.footer}>
                <ButtonIcon 
                    title='Entrar na partida'
                    onPress={handleOpenGuild}
                />
            </View>
        }

        </Background>
    );
}