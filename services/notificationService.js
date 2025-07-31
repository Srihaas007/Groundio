// services/notificationService.js
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { doc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
  }

  async initialize() {
    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.warn('Failed to get push token for push notification!');
        return null;
      }

      // Get push token
      if (Platform.OS !== 'web') {
        this.expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Push token:', this.expoPushToken);
      }

      // Configure Android channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Groundio Notifications',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#4A90E2',
          sound: 'default',
        });

        // Booking notifications channel
        await Notifications.setNotificationChannelAsync('booking', {
          name: 'Booking Updates',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#27ae60',
          sound: 'default',
        });

        // Payment notifications channel
        await Notifications.setNotificationChannelAsync('payment', {
          name: 'Payment Updates',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#f39c12',
          sound: 'default',
        });
      }

      return this.expoPushToken;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return null;
    }
  }

  setupNotificationListeners(navigation) {
    // Listen for notifications received while app is running
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      this.handleNotificationReceived(notification);
    });

    // Listen for user interactions with notifications
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      this.handleNotificationResponse(response, navigation);
    });
  }

  removeNotificationListeners() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  handleNotificationReceived(notification) {
    // Handle notification received while app is open
    const { title, body, data } = notification.request.content;
    
    // You can show custom in-app notification here
    // or update app state based on notification data
  }

  handleNotificationResponse(response, navigation) {
    const { data } = response.notification.request.content;
    
    // Navigate based on notification type
    if (data?.type === 'booking_confirmed') {
      navigation.navigate('BookingsScreen');
    } else if (data?.type === 'booking_cancelled') {
      navigation.navigate('BookingsScreen');
    } else if (data?.type === 'payment_success') {
      navigation.navigate('BookingsScreen');
    } else if (data?.type === 'new_booking' && data?.userType === 'merchant') {
      navigation.navigate('screens/merchant/MViewOrders');
    }
  }

  async scheduleLocalNotification(title, body, data = {}, trigger = null) {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: trigger || null, // null = immediate
      });
      
      return notificationId;
    } catch (error) {
      console.error('Error scheduling local notification:', error);
      return null;
    }
  }

  async sendPushNotification(expoPushToken, title, body, data = {}) {
    if (!expoPushToken) {
      console.warn('No push token available');
      return null;
    }

    const message = {
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data,
      channelId: data.type === 'booking' ? 'booking' : 
                 data.type === 'payment' ? 'payment' : 'default',
    };

    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();
      console.log('Push notification sent:', result);
      return result;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return null;
    }
  }

  async saveNotificationToFirestore(userId, notification) {
    try {
      await addDoc(collection(db, 'notifications'), {
        userId,
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error saving notification to Firestore:', error);
    }
  }

  async markNotificationAsRead(notificationId) {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true,
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Booking-specific notifications
  async notifyBookingConfirmed(userToken, bookingData) {
    const title = 'Booking Confirmed! 🎉';
    const body = `Your booking for ${bookingData.venueName} on ${bookingData.date} at ${bookingData.timeSlot} has been confirmed.`;
    
    await this.sendPushNotification(userToken, title, body, {
      type: 'booking_confirmed',
      bookingId: bookingData.id,
    });

    await this.saveNotificationToFirestore(bookingData.userId, {
      title,
      body,
      data: { type: 'booking_confirmed', bookingId: bookingData.id },
    });
  }

  async notifyBookingCancelled(userToken, bookingData) {
    const title = 'Booking Cancelled';
    const body = `Your booking for ${bookingData.venueName} on ${bookingData.date} has been cancelled.`;
    
    await this.sendPushNotification(userToken, title, body, {
      type: 'booking_cancelled',
      bookingId: bookingData.id,
    });

    await this.saveNotificationToFirestore(bookingData.userId, {
      title,
      body,
      data: { type: 'booking_cancelled', bookingId: bookingData.id },
    });
  }

  // Merchant notifications
  async notifyMerchantNewBooking(merchantToken, bookingData) {
    const title = 'New Booking Received! 💰';
    const body = `You have a new booking for ${bookingData.venueName} on ${bookingData.date} at ${bookingData.timeSlot}.`;
    
    await this.sendPushNotification(merchantToken, title, body, {
      type: 'new_booking',
      userType: 'merchant',
      bookingId: bookingData.id,
    });

    await this.saveNotificationToFirestore(bookingData.merchantId, {
      title,
      body,
      data: { type: 'new_booking', bookingId: bookingData.id },
    });
  }

  // Payment notifications
  async notifyPaymentSuccess(userToken, paymentData) {
    const title = 'Payment Successful! ✅';
    const body = `Payment of ₹${paymentData.amount} for your booking has been processed successfully.`;
    
    await this.sendPushNotification(userToken, title, body, {
      type: 'payment_success',
      paymentId: paymentData.id,
    });

    await this.saveNotificationToFirestore(paymentData.userId, {
      title,
      body,
      data: { type: 'payment_success', paymentId: paymentData.id },
    });
  }

  async notifyPaymentFailed(userToken, paymentData) {
    const title = 'Payment Failed ❌';
    const body = `Payment for your booking could not be processed. Please try again.`;
    
    await this.sendPushNotification(userToken, title, body, {
      type: 'payment_failed',
      paymentId: paymentData.id,
    });

    await this.saveNotificationToFirestore(paymentData.userId, {
      title,
      body,
      data: { type: 'payment_failed', paymentId: paymentData.id },
    });
  }

  // Reminder notifications
  async scheduleBookingReminder(userToken, bookingData) {
    const bookingDate = new Date(bookingData.date + ' ' + bookingData.timeSlot);
    const reminderTime = new Date(bookingDate.getTime() - 2 * 60 * 60 * 1000); // 2 hours before
    
    if (reminderTime > new Date()) {
      const title = 'Booking Reminder 🔔';
      const body = `Your booking at ${bookingData.venueName} is in 2 hours at ${bookingData.timeSlot}.`;
      
      await this.scheduleLocalNotification(
        title,
        body,
        {
          type: 'booking_reminder',
          bookingId: bookingData.id,
        },
        {
          date: reminderTime,
        }
      );
    }
  }

  async cancelScheduledNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error cancelling scheduled notification:', error);
    }
  }

  async cancelAllScheduledNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error cancelling all scheduled notifications:', error);
    }
  }

  async updatePushToken(userId, token) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        pushToken: token,
        tokenUpdatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating push token:', error);
    }
  }
}

export default new NotificationService();
