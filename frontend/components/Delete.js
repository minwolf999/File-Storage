import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function Delete() {
    const [fileNames, setFileNames] = useState([])
    const [selectedFileName, setSelectedFileName] = useState('')
    const [showConfirm, setShowConfirm] = useState(false)

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

        if (itemValue !== '') {
            setShowConfirm(true)
        } else {
            setShowConfirm(false)
        }
    }

    const confirmDelete = () => {
        fetch('http://192.168.1.3:8001/deleteFile', {
            method: 'POST',
            body: JSON.stringify(selectedFileName),
        }).then(async(response) => {
            if (response.ok) {
                const result = await response.json()
                
                result.Success ? setFetchStatus('Success') : setFetchStatus('Error')
                setFetchMessage(result.Message)
            }
        })
        
        setSelectedFileName('')
        setShowConfirm(false)
    }

    const cancelDelete = () => {
        setSelectedFileName('')
        setShowConfirm(false)
    }

    return (
        <View style={styles.parentDiv}>
            {fetchMessage && (
                <Text style={fetchStatus === "Success" ? styles.Success : styles.Error}>
                    {fetchMessage}
                </Text>
            )}

            <Text style={styles.deleteLabel1}>Witch file do you want to delete ?</Text>
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

            {
                showConfirm && (
                    <View>
                        <Text style={styles.deleteLabel1}>
                            Are you sure you want to delete the file '{ fileNames.map(file => (file.Id === selectedFileName ? file.FileName : '')) }' ?
                        </Text>

                        <View style={styles.confirmDiv}>
                            <Button onPress={confirmDelete} color="rgb(34, 197, 94)" style={styles.buttonYes} title="Yes"/>
                            <Button onPress={cancelDelete} color="rgb(239, 68, 68)" style={styles.buttonNo} title="No"/>
                        </View>
                    </View>
                )
            }
        </View>
    )
}


const styles = StyleSheet.create({
    parentDiv: {
        alignItems: 'center',
    },

    deleteLabel1: {
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

    confirmDiv: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
    },

    buttonYes: {
        width: '100',
        fontSize: 20,
        lineHeight: 28,
        paddingHorizontal: '8',
        borderRadius: '8',
        fontWeight: "600",
    },

    buttonNo: {
        width: '100',
        fontSize: 20,
        lineHeight: 28,
        paddingHorizontal: '8',
        borderRadius: '8',
        fontWeight: "600",
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