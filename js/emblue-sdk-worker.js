self.addEventListener('push', function(event) {
    if (event && event.data) {
        var obj = event.data.json();
        var notif = obj.notification;
        var data = {};
        var actions = [];
        try {
            data = obj.data["gcm.notification.data"] ? JSON.parse(obj.data["gcm.notification.data"]) : {};
            actions = data.actions || [];

        } catch (err) {}

        var options = {
            body: notif.body,
            image: data.image || '',
            icon: notif.icon || '',
            click_action: notif.click_action || null,
            data: data,
            actions: actions
        };
        event.waitUntil(self.registration.showNotification(notif.title, options));
    }
});
self.addEventListener('notificationclick', function(event) {
    if (event) {
        if (event.notification.data) {
            if (event.notification.data.actions && event.notification.data.actions.length > 0) {
                try {
                    var action = {};
                    if (event.action) {
                        action = event.notification.data.actions.filter(function(el) { return el.action == event.action })[0];
                        if (action && action.url != '') {
                            event.waitUntil(
                                self.clients.openWindow(action.url)
                            );
                        }
                    } else {
                        action = event.notification.data.actions[0];
                        event.waitUntil(
                            self.clients.openWindow(action.url)
                        );
                    }
                } catch (e) {}
            } else if (event.notification.data.click_action && event.notification.data.click_action != '') {
                event.waitUntil(
                    self.clients.openWindow(event.notification.data.click_action)
                );
            }
        }
        event.notification.close();
    }
})