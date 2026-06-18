import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectNotifications = (
    userId,
    onMessage
) => {

    console.log("Connecting for user:", userId);

    const socket =
        new SockJS("http://localhost:8080/ws");

    stompClient = new Client({

        webSocketFactory: () => socket,

        reconnectDelay: 5000,

        debug: (str) => {
            console.log("STOMP:", str);
        },

        onConnect: () => {

            console.log("✅ WebSocket Connected");

            stompClient.subscribe(
                `/topic/notifications/${userId}`,
                (message) => {

                    console.log(
                        "Notification received:",
                        message.body
                    );

                    onMessage(message.body);
                }
            );
        },

        onStompError: (frame) => {
            console.error(
                "STOMP ERROR:",
                frame
            );
        }

    });

    stompClient.activate();
};

export const disconnectNotifications = () => {

    if (stompClient) {
        stompClient.deactivate();
    }
};