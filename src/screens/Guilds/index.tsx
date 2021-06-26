import React from 'react'
import { useState } from 'react';
import { View, FlatList } from 'react-native'
import { Guild, GuildProps } from '../../components/Guild';
import { Loading } from '../../components/Loading';
import { ListDivider } from '../../components/ListDivider';

import { styles } from './styles';
import { api } from '../../services/api';
import { useEffect } from 'react';

type Props = {
    handleGuildSelect: (guild: GuildProps) => void
}

export function Guilds({ handleGuildSelect }: Props) {

    const [guilds, setGuilds] = useState<GuildProps[]>([])
    const [loading, setLoading] = useState(true);

    async function fetchGuilds(){
        const response = await api.get('/users/@me/guilds')

        setGuilds(response.data);
        setLoading(false);
    }

    //este hook sempre é chamado no momento em que a tela é renderizada
    //e na forma como foi definido, não possui nenhuma dependencia para ser executado
    useEffect(() => {
        fetchGuilds();
    }, []);

    return (
        <View style={styles.container}>
            {
                loading ? <Loading /> :
                <FlatList
                    data={guilds}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <Guild
                            data={item}
                            onPress={() => handleGuildSelect(item)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 68, paddingTop: 103 }}
                    ItemSeparatorComponent={() => <ListDivider isCentered />}
                    ListHeaderComponent={() => <ListDivider isCentered />}
                    style={styles.guilds}
                >
                </FlatList>
            }
        </View>
    );
}