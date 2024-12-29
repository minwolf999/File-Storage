import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Save from './components/Save';
import Get from './components/Get';
import Delete from './components/Delete';
import Update from './components/Update';

export default function App() {
  const [selectOption, setSelectOption] = useState('')
  const handleChange = (itemValue, itemIndex) => {
    setSelectOption(itemValue)
  }

  return (
    <View style={styles.parentDiv}>
      <StatusBar hidden/>
      <Text style={styles.label1}>What do you want to do ?</Text>
      <Picker 
        selectedValue={selectOption}
        onValueChange={handleChange}
        style={styles.picker}
      >
        <Picker.Item label="Select an option" value="" />
        <Picker.Item label="Save" value="Save" />
        <Picker.Item label="Get" value="Get" />
        <Picker.Item label="Update" value="Update" />
        <Picker.Item label="Delete" value="Delete" />
      </Picker>

      {selectOption === 'Save' && <Save/>}
      {selectOption === 'Get' && <Get/>}
      {selectOption === 'Update' && <Update/>}
      {selectOption === 'Delete' && <Delete/>}
    </View>
  );
}

const styles = StyleSheet.create({
  parentDiv: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: '6',
    backgroundColor: 'rgb(31 41 55)',
    minHeight: '100%',
    color: '#fff',
  },

  label1: {
    marginTop: '10%',
    marginBottom: '16',
    color: '#fff',
    fontSize: 20,
    lineHeight: '28',
    fontWeight: '600',
    textAlign: 'center',
  },

  picker: {
    color: '#fff',
    marginBottom: '24',
    width: '140',
    paddingVertical: '12',
    paddingHorizontal: '16',
    borderRadius: 8,
    backgroundColor: 'rgb(55 65 81)',
  },
});
