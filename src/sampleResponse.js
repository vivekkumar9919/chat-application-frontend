

const sampleResponse = {

    loginResponse: {
        "status_code": 200,
        "message": "Login successful",
        "error": null,
        "user": {
          "id": 2,
          "email": "exampleuser@example1.com",
          "created_at": "2025-09-13T08:58:52.909Z",
          "updated_at": "2025-09-13T08:58:52.909Z"
        }
    },
    logoutResponse: {
        status_code: 200
    },
    signupResponse: {
        "status_code": 200,
        "message": "User registered successfully",
        "error": null,
        "user": {
            "id": 2,
            "email": "exampleuser@example1.com",
            "username": "exampleuser1",
            "created_at": "2025-09-13T08:58:52.909Z",
            "updated_at": "2025-09-13T08:58:52.909Z"
        }
    },
    updateProfilePicResponse: {
        "status_code": 200,
        "success": true,
        "message": "Profile picture updated successfully",
        "profilePicUrl": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }

    // Conversation responses
    conversationResponse: {
        "status_code": 200,
        "message": "Conversations fetched successfully",
        "conversations": [
            {
                "conversation_id": 1,
                "type": "direct",
                "display_name": "john_doe",
                "other_user_id": 3,
                "avatar": null,
                "last_message": "Hello there!",
                "last_message_at": "2025-10-25T16:30:00.000Z",
                "unread_count": 2,
                "participants": [2, 3]
            },
            {
                "conversation_id": 2,
                "type": "direct", 
                "display_name": "jane_smith",
                "other_user_id": 4,
                "avatar": null,
                "last_message": "How are you?",
                "last_message_at": "2025-10-25T16:25:00.000Z",
                "unread_count": 0,
                "participants": [2, 4]
            }
        ]
    },

    // Message responses
    messageResponse: {
        "status_code": 200,
        "message": "Messages fetched successfully",
        "messages": [
            {
                "id": 1,
                "message_text": "Hello there!",
                "sender_id": 3,
                "sender_name": "john_doe",
                "created_at": "2025-10-25T16:30:00.000Z",
                "isOwn": false
            },
            {
                "id": 2,
                "message_text": "Hi! How are you?",
                "sender_id": 2,
                "sender_name": "exampleuser1",
                "created_at": "2025-10-25T16:31:00.000Z",
                "isOwn": true
            }
        ]
    },

    sendMessageResponse: {
        "status_code": 201,
        "message": "Message sent successfully",
        "message": {
            "messageId": 3,
            "conversationId": 1,
            "senderId": 2,
            "messageText": "This is a test message"
        }
    },

    // User search and management responses
    userSearchResponse: {
        "status_code": 200,
        "message": "Users fetched successfully",
        "users": [
            {
                "id": 3,
                "username": "john_doe",
                "email": "john@example.com"
            },
            {
                "id": 4,
                "username": "jane_smith",
                "email": "jane@example.com"
            }
        ]
    },

    allUsersResponse: {
        "status_code": 200,
        "message": "All users fetched successfully",
        "users": [
            {
                "id": 1,
                "username": "exampleuser1",
                "email": "exampleuser@example1.com",
                "created_at": "2025-09-13T08:58:52.909Z"
            },
            {
                "id": 2,
                "username": "exampleuser2",
                "email": "exampleuser@example2.com",
                "created_at": "2025-09-13T08:58:52.909Z"
            },
            {
                "id": 3,
                "username": "john_doe",
                "email": "john@example.com",
                "created_at": "2025-09-13T08:58:52.909Z"
            },
            {
                "id": 4,
                "username": "jane_smith",
                "email": "jane@example.com",
                "created_at": "2025-09-13T08:58:52.909Z"
            }
        ]
    },

    // Conversation management responses
    createConversationResponse: {
        "status_code": 201,
        "message": "Conversation created successfully",
        "conversation": {
            "conversationId": 1,
            "type": "direct",
            "name": null,
            "participants": [2, 3]
        }
    }

}

export default sampleResponse;