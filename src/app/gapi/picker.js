
import APATE from '../apate';


APATE.namespace('APATE.gapi');

APATE.gapi.picker = (function() {

    const DEVELOPER_KEY = 'AIzaSyBFPj2q81WzO0Usdl6WIvDznHwq5QwDUvU';
    const CLIENT_ID = '300075547607-b6neu992je5akra1o4t0omlqsd1araqk.apps.googleusercontent.com';
    const API_KEY = 'APATE-253119';
    const SCOPE = ['https://www.googleapis.com/auth/drive'];

    let pickerApiLoaded = false;
    let oauthToken;


    const init = () => {
        window.gapi.load('auth', {'callback': onAuthApiLoad});
        window.gapi.load('picker', {'callback': onPickerApiLoad});
    };

    const onAuthApiLoad = () => {
        window.gapi.auth.authorize({
            'client_id': CLIENT_ID,
            'scope': SCOPE,
            'immediate': false
        }, handleAuthResult);
    };

    const handleAuthResult = (authResult) => {
        if (authResult && !authResult.error) {
            oauthToken = authResult.access_token;
            createPicker();
        }
    };

    const onPickerApiLoad = () => {
        pickerApiLoaded = true;
        createPicker();
    };

    const createPicker = () => {
        if (pickerApiLoaded && oauthToken) {
            const view = new google.picker.View(google.picker.ViewId.DOCUMENTS);
            // view.setMimeTypes("image/png,image/jpeg,image/jpg");
            const picker = new google.picker.PickerBuilder()
                .enableFeature(google.picker.Feature.NAV_HIDDEN)
                .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
                .setAppId(API_KEY)
                .setOAuthToken(oauthToken)
                .addView(view)
                .addView(new google.picker.DocsUploadView())
                .setDeveloperKey(DEVELOPER_KEY)
                .setCallback(pickerCallback)
                .build();
            // show picker
            picker.setVisible(true);
        }
    };

    const pickerCallback = (data) => {
        if (data.action == google.picker.Action.PICKED) {
            const fileId = data.docs[0].id;
            alert('The user selected: ' + fileId);
        }
    };


    return {
        init: init
    };

}());


export default APATE.gapi.picker;
