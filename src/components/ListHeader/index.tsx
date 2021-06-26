import React from 'react';

import { styles } from './styles';
import { theme } from '../../global/styles/theme';
import { View, Text } from 'react-native';

type Props = {
    title: string,
    subtitle: string
}

export function ListHeader({
    title,
    subtitle
}: Props){

    return(
        <View style={styles.container}>
            <Text style={styles.title}>
                { title }
            </Text>
            <Text style={styles.subtitle}>
                { subtitle }
            </Text>
        </View>
    );
}