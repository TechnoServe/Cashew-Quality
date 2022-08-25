# TNS Cashew Nut Quality Audit Mobile APP

## Tech Stack
- React-native
- TypeScript
- Expo
- Firebase

## Requirements
- Expo
- Firebase account

## Setup
1. After cloning, go to Application Directory:
    ```
    cd caju-mobile-2
    ```

2. Create your config file and intall Project packages:
    ```
    cp src/core/utils/config.example.js src/core/utils/config.js
    npm install
    ```

3. Setup firebase connection database:
   - Open config file(src/core/utils/config.js)
   - Uncomment const firebaseConfig block
   - Replace object values with your firebase configuration


4. Run the app
    ```
    expo start
    ```
## Build
- Development(apk file)
    ```
    eas build --profile staging --platform android
    ```

- Production(aab file)
    ```
    eas build --profile production --platform android
    ```

