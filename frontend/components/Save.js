import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { uuidv7 } from 'uuidv7';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';


export default function Save() {
    const [file, setFile] = useState(null);
    const [id, setId] = useState('')
    const [fileName, setFileName] = useState('')
    const [blob, setBlob] = useState('')
    const [fetchStatus, setFetchStatus] = useState('')
    const [fetchMessage, setFetchMessage] = useState('')

    const pickFile = async () => {
        const result = await DocumentPicker.getDocumentAsync()
        setFile(result?.assets[0]);
    };

    useEffect(() => {
        if (file) {            
            const split = file.name.split('.')
            split.pop()

            setId(uuidv7());
            setFileName(split.join('.'));

            const readFile = async (fileUri) => {
                try {
                    const data = await FileSystem.readAsStringAsync(fileUri, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    setBlob(`data:${file.mimeType};base64,${data}`);
                } catch (error) {
                    console.error(error);
                }
            };

            readFile(file.uri)
        }
    }, [file]);

    useEffect(() => {
        if (id && fileName && blob) {
            try {
                fetch('http://192.168.1.3:8001/saveFile', {
                    method: 'POST',
                    body: JSON.stringify({
                        Id: id,
                        FileName: fileName,
                        Blob: blob
                    }),
                }).then(async response => {
                    if (response.ok) {
                        const result = await response.json()
                        
                        result.Success ? setFetchStatus('Success') : setFetchStatus('Error')
                        setFetchMessage(result.Message)
                    }
                }).catch(err => {
                    console.error(err)
                })
            } catch (err) {
                console.error(err)
            }
        }
    }, [id, fileName, blob]);
      
    return (
        <View>
            {fetchMessage && (
                <Text style={fetchStatus === "Success" ? styles.Success : styles.Error}>
                    {fetchMessage}
                </Text>
            )}

            <Button title='What file do you want to save ?' onPress={pickFile}></Button>
        </View>
    )
}

const styles = StyleSheet.create({
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