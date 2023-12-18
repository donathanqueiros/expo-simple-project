FROM reactnativecommunity/react-native-android

ENV EXPO_TOKEN=CZikjHbAKlAKEmaBDpAejjVZmECwH7CLir0H2hpG


RUN git clone https://github.com/donathanqueiros/expo-simple-project.git /app

WORKDIR /app

COPY ./.docker/scripts /scripts

RUN npm -g i eas-cli
# RUN yarn install

# RUN eas build --platform android --profile preview --local --non-interactive

RUN ["chmod", "+x", "/scripts/entrypoint.sh"]
ENTRYPOINT ["/scripts/entrypoint.sh"]



