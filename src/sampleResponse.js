

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

}

export default sampleResponse;