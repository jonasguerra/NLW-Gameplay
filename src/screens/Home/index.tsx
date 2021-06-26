import React, { useState, useCallback } from 'react';
import { View, Text, FlatList } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { ButtonAdd } from '../../components/ButtonAdd';
import { CategorySelect } from '../../components/CategorySelect';
import { Profile } from '../../components/Profile';
import { ListHeader } from '../../components/ListHeader';
import { Appointment, AppointmentProps } from '../../components/Appointment';
import { ListDivider } from '../../components/ListDivider';
import { Background } from '../../components/Background';

import { styles } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLLECTION_APPOINTMENTS } from '../../configs/database';
import { Loading } from '../../components/Loading';

export function Home(){
    const [category, setCategory] = useState('')
    const [appointments, setAppointment] = useState<AppointmentProps[]>([])
    const [loading, setLoading] = useState(true)

    const navigation = useNavigation();

    function handleCategorySelect(categoryId: string){
        categoryId === category ? setCategory('') : setCategory(categoryId);
    }

    function handleAppointmentDetails(guildSelected: AppointmentProps){
        navigation.navigate('AppointmentDetails', { guildSelected })
    }

    function handleAppointmentCreate(){
        navigation.navigate('AppointmentCreate')
    }

    async function loadAppointments(){
        const response = await AsyncStorage.getItem(COLLECTION_APPOINTMENTS);
        const storage: AppointmentProps[] = response ? JSON.parse(response) : []

        if(category){
            setAppointment(storage.filter(item => item.category === category))
        }else{
            setAppointment(storage)
        }

        setLoading(false)
    }

    //quando houver foco na tela home, a mesma será recarregada
    useFocusEffect(useCallback(() => {
        loadAppointments();
    }, [category]))

    return(
        <Background>
            <View style={styles.header}>
                <Profile />
                <ButtonAdd onPress={handleAppointmentCreate} />

            </View>
            <View>
                <CategorySelect 
                    categorySelected={category}
                    setCategory={handleCategorySelect}
                />
            </View>

        {
            loading 
            ? 
            <Loading /> 
            :
            <>
                <ListHeader
                    title="Partidas Agendadas"
                    subtitle={`Total ${appointments.length}`}
                />

                <FlatList
                    data={appointments}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <Appointment 
                            data={item}
                            onPress={() => handleAppointmentDetails(item)}
                        />
                    )}      
                    ItemSeparatorComponent={() =>  
                        <ListDivider />
                    }
                    contentContainerStyle={{ paddingBottom: 69}}
                    style={styles.matches}
                    showsVerticalScrollIndicator={false}
                />
            </>
        }

        </Background>
    );
}