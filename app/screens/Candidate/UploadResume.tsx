import { Alert, Button, Text, TouchableOpacity, View } from "react-native"
import * as DocumentPicker from 'expo-document-picker';
import { useState } from "react";
import { uploadResume } from "../../api/user";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginSuccess } from "../../features/user/userSlice";

interface UploadResumeParams{
    resumeExists: Boolean
}

const UploadResume:React.FC<UploadResumeParams> = ({resumeExists})=>{

    const dispatch = useAppDispatch();
    const [uploading,setUploading] = useState(false);
    const user = useAppSelector((state)=> state.user.user)

    const pickDocument = async()=>{
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/pdf',
            copyToCacheDirectory: true
        })

        if(!result.canceled){
            const doc = result.assets[0];

            try{
                setUploading(true);
                const data = await uploadResume({
                    uri: doc.uri,
                    name: doc.file?.name || 'resume.pdf',
                    type: doc.mimeType || 'application/pdf'
                })

                Alert.alert('Success', 'Resume uploaded')

                if(data.user){
                    dispatch(loginSuccess(data.user));
                }
            }catch(err){
                console.error('Upload failed', err);
                Alert.alert('Error', 'Failed to upload image.');
            }finally{
                setUploading(false);
            }
        }
    }

    if(!user)return null;

    return(
        <View style={{marginTop: 10}}>
            <TouchableOpacity style={{backgroundColor: '#4B9EFF',
            borderRadius: 10,
            paddingVertical: 12,
            alignItems: 'center',
             marginTop: 16}} onPress={pickDocument} >
             <Text style={{color:'#FFF' ,fontSize: 16,
    fontWeight: '600',}}>Upload Resume</Text>
            </TouchableOpacity>
        </View>
    )
}

export default UploadResume;