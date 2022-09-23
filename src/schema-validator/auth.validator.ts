export const signupSchemaValidator = {
    title: "User Signup",
    description: "User signup credentials",
    type: "object",
    required: ["email", "username", "password", "roles"],
    properties: {
        email: {
            type: "string",
            minLength: 1,
            format: "email"
        },
        username: {
            type: "string",
            minLength: 3,
            pattern: "^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$"
        },
        password: {
            type: "string",
            minLength: 6
        },
        roles: {
            type: "array",
            items: {
                type: "string",
                enum: ["STUDENT", "INSTRUCTOR", "USER"]
            }
        }
    },
}

export const loginSchemaValidator = {
    title: "User Login",
    description: "User login credentials",
    type: "object",
    required: ["username", "password"],
    properties: {
        username: {
            type: "string",
            minLength: 3,
            pattern: "^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$"
        },
        password: {
            type: "string",
            minLength: 6
        }
    }
}