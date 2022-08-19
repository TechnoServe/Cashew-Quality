import storage from '@react-native-firebase/storage';

export const uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = storage().ref().child("images/" + imageName);

    return ref.put(blob);
}