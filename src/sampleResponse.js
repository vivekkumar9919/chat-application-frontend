

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

}

export default sampleResponse;