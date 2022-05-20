import { useState, useEffect } from 'react';
import axios from 'axios';
import * as serviceWorker from '../../serviceWorker';

const pushNotificationSupported = serviceWorker.isPushNotificationSupported();
// check push notifications are supported by the browser
  

export function usePushNotifications() {
    const [userConsent, setSuserConsent] = useState(Notification.permission);
    //to manage the user consent: Notification.permission is a JavaScript native function that return the current state of the permission
    //We initialize the userConsent with that value
    const [userSubscription, setUserSubscription] = useState(null);
    //to manage the use push notification subscription
    const [pushServerSubscriptionId, setPushServerSubscriptionId] = useState();
    //to manage the push server subscription
    const [error, setError] = useState(null);
    //to manage errors
    const [loading, setLoading] = useState(true);
    //to manage async actions

    useEffect(() => {
        if (pushNotificationSupported) {
            setLoading(true);
            setError(false);
            console.log("push notification is supported, calling register function")
            serviceWorker.register();
        }
    }, []);
    //if the push notifications are supported, registers the service worker
    //this effect runs only the first render

    useEffect(() => {
        setLoading(true);
        setError(false);
        const getExistingSubscription = async () => {
            const existingSubscription = await serviceWorker.getUserSubscription();
            setUserSubscription(existingSubscription);
            setLoading(false);
        };
        getExistingSubscription();
    }, []);
    //Retrieve if there is any push notification subscription for the registered service worker
    // this use effect runs only in the first render

    /**
     * define a click handler that asks the user permission,
     * it uses the setSuserConsent state, to set the consent of the user
     * If the user denies the consent, an error is created with the setError hook
     */
    const onClickAskUserPermission = () => {
        setLoading(true);
        setError(false);
        serviceWorker.askUserPermission().then((consent) => {
            setSuserConsent(consent);
            if (consent !== 'granted') {
                setError({
                    name: 'Consent denied',
                    message: 'You denied the consent to receive notifications',
                    code: 0
                });
            }
            setLoading(false);
        });
    };
    //

    /**
     * define a click handler that creates a push notification subscription.
     * Once the subscription is created, it uses the setUserSubscription hook
     */
    const onClickSusbribeToPushNotification = () => {
        setLoading(true);
        setError(false);
        serviceWorker
            .createNotificationSubscription()
            .then(function (subscription) {
                console.log(subscription)
                setUserSubscription(subscription);
                setLoading(false);
            })
            .catch((err) => {
                console.error(
                    "Couldn't create the notification subscription",
                    err,
                    'name:',
                    err.name,
                    'message:',
                    err.message,
                    'code:',
                    err.code
                );
                setError(err);
                setLoading(false);
            });
        // if ('serviceWorker' in navigator) {
        //     navigator.serviceWorker.ready.then(function (registration) {
        //         if (!registration.pushManager) {
        //             console.log('Push manager unavailable.')
        //             return
        //         }

        //         registration.pushManager.getSubscription().then(function (existedSubscription) {
        //             if (existedSubscription === null) {
        //                 console.log('No subscription detected, make a request.')
        //                 registration.pushManager.subscribe({
        //                     applicationServerKey: urlB64ToUint8Array('BJdLsp38HrmZxuR6qsvoDdTwtVBpUb75OLleU5qW8wnNCr58_VZIR-Vck8tGmQSBOOcUso2RhEClNTjmq22fIp8'),
        //                     userVisibleOnly: true,
        //                 }).then(function (newSubscription) {
        //                     console.log('New subscription added.', newSubscription)
        //                     //sendSubscription(newSubscription)
        //                 }).catch(function (e) {
        //                     if (Notification.permission !== 'granted') {
        //                         console.log('Permission was not granted.')
        //                     } else {
        //                         console.error('An error ocurred during the subscription process.', e)
        //                     }
        //                 })
        //             } else {
        //                 console.log('Existed subscription detected.')
        //                 //sendSubscription(existedSubscription)
        //             }
        //         })
        //     })
        //         .catch(function (e) {
        //             console.error('An error ocurred during Service Worker registration.', e)
        //         })
        // }
        // else {
        //     console.log('Can not reachable to the service worker');
        // }
    };

    /**
     * define a click handler that sends the push susbcribtion to the push server.
     * Once the subscription ics created on the server, it saves the id using the hook setPushServerSubscriptionId
     */
    const onClickSendSubscriptionToPushServer = () => {
        setLoading(true);
        setError(false);
        axios
            .post('/api/notification/subscribe', { data: userSubscription }, {headers: {'x-access-token': sessionStorage.getItem("token")}})
            .then(function (response) {
                setPushServerSubscriptionId(response.data.id);
                //save subscription Id to local storage, security be damn
                localStorage.setItem("notificationSubId", response.data.id)
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                setError(err);
            });
    };

    /**
     * define a click handler that requests the push server to send a notification, passing the id of the saved subscription
     */
    const onClickSendNotification = async () => {
        setLoading(true);
        setError(false);
        axios.get(`/api/notification/send_notif/${pushServerSubscriptionId}`).catch((error) => {
            setLoading(false);
            setError(error);
        });
        setLoading(false);
    };

    return {
        onClickAskUserPermission,
        onClickSusbribeToPushNotification,
        onClickSendSubscriptionToPushServer,
        pushServerSubscriptionId,
        onClickSendNotification,
        userConsent,
        pushNotificationSupported,
        userSubscription,
        error,
        loading
    };
}