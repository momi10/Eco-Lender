// Notification reducer
const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_NOTIFICATIONS_START':
      return {
        ...state,
        loading: true,
        error: null
      };

    case 'FETCH_NOTIFICATIONS_SUCCESS':
      return {
        ...state,
        notifications: action.payload.notifications,
        unreadCount: action.payload.pagination.unread,
        loading: false
      };

    case 'NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n._id === action.payload ? { ...n, isRead: true } : n
        ),
        unreadCount: state.unreadCount > 0 ? state.unreadCount - 1 : 0
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };

    default:
      return state;
  }
};

export default notificationReducer;
