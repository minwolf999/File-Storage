import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import * as FileSystem from 'expo-file-system';

export default function Get() {
    const [fileNames, setFileNames] = useState([])
    const [selectedFileName, setSelectedFileName] = useState('')

    const [fetchStatus, setFetchStatus] = useState('')
    const [fetchMessage, setFetchMessage] = useState('')
  
    useEffect(() => {
        fetch('http://192.168.1.3:8001/getFileNames', {
            method: 'POST'
        }).then(async response => {
            if (response.ok) {
                const result = await response.json()
                setFileNames(result.Success ? result.Value : [])
            }
        })
    })

    const handleChange = (itemValue) => {
        setSelectedFileName(itemValue)
    }

    useEffect(() => {
        if (selectedFileName !== "") {
            const fetchFile = async() => {
                const fileData = await fetch('http://192.168.1.3:8001/getFile', {
                    method: 'POST',
                    body: JSON.stringify(selectedFileName),
                }).then(async response => {
                    if (response.ok) {
                        return await response.json()
                    }
                })

                const uploadFile = async () => {
                    const {FileName, Blob} = fileData.Value;
                    const base64Data = Blob.split(',')[1];
                    const fileType = Blob.split(';')[0].slice(5);
                    
                    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
                    if (!permissions.granted) {
                        return;
                    }

                    try {
                        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, FileName, fileType)
                        .then(async (uri) => {
                            await FileSystem.writeAsStringAsync(uri, base64Data, {encoding: FileSystem.EncodingType.Base64})
                        }).catch(err => {
                            console.error(err)
                        })
                    } catch (err) {
                        console.error(e)
                    }
                }
                
                await uploadFile()
                fileData.Success ? setFetchStatus('Success') : setFetchStatus('Error')
                setFetchMessage(fileData.Message)
            }

            fetchFile()
        }
    }, [selectedFileName])

    return (
        <View style={styles.parentDiv}>
            {fetchMessage && (
                <Text style={fetchStatus === "Success" ? styles.Success : styles.Error}>
                    {fetchMessage}
                </Text>
            )}

            <Text style={styles.getLabel1}>Witch file do you want to get ?</Text>
            <Picker
                selectedValue={selectedFileName}
                onValueChange={handleChange}
                style={styles.picker}
            >
                <Picker.Item label="Select an option" value="" />
                {fileNames?.map((fileName, _) => {
                    return (<Picker.Item 
                        label={fileName?.FileName || "Unknown"} 
                        value={fileName?.Id || ""} 
                        key={fileName?.Id} 
                    />)
                })}
            </Picker>
        </View>
    )
}


const styles = StyleSheet.create({
    parentDiv: {
        alignItems: 'center',
    },

    getLabel1: {
        marginBottom: 16,
        fontSize: 20,
        lineHeight: 28,
        fontWeight: "600",
        textAlign: 'center',
        color: 'white',
    },

    picker: {
        color: '#fff',
        marginBottom: '24',
        width: '200',
        paddingVertical: '12',
        paddingHorizontal: '16',
        borderRadius: 8,
        backgroundColor: 'rgb(55 65 81)',
    },

    Success: {
        marginBottom: '16',
        fontSize: 20,
        lineHeight: 28,
        fontWeight: "600",
        textAlign: 'center',
        color: 'rgb(34, 197, 94)',
    },

    Error: {
        marginBottom: '16',
        fontSize: 20,
        lineHeight: 28,
        fontWeight: "600",
        textAlign: 'center',
        color: 'rgb(239, 68, 68)',
    },
});