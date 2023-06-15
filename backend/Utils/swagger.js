import swaggerJSDoc from "swagger-jsdoc";

export const options = {
  explorer: true,
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Courses.am",
      version: "1.0.0",
      description: "Platform for online courses",
    },
    servers: [{ url: "http://178.160.195.53:5000" }],
    components: {
      logins: {
        Login: {
          type: "object",
          properties: {
            email: { type: "string" },
            password: { type: "string" },
          },
          example: {
            email: "name@email.com",
            password: "Name1234.",
          },
        },
        Register: {
          type: "object",
          properties: {
            type: { type: "string", description: "student or teacher" },
            isIndividual: { type: "boolean" },
            name: { type: "string" },
            email: { type: "string" },
            password: {
              type: "string",
              description:
                "Must contain 8 letters uppercase lowercase number and symbol",
            },
          },
          example: {
            type: "student",
            isIndividual: true,
            name: "Name Surname",
            email: "name@email.com",
            password: "Name1234.",
          },
        },
        Register_Company: {
          type: "object",
          properties: {
            companyType: {
              type: "string",
              description: "Set company type default: company",
            },
            companyName: { type: "string", description: "Company Name" },
            adminType: {
              type: "string",
              description: "Set admin type default: admin",
            },
            name: { type: "string", description: "Admin name" },
            email: { type: "string", description: "Company and admin email" },
            password: {
              type: "string",
              description:
                "Must contain 8 letters uppercase lowercase number and symbol",
            },
          },
          example: {
            companyType: "company",
            companyName: "Educational Company",
            adminType: "admin",
            name: "Admin AdminSurname",
            email: "company@email.com",
            password: "Test1234.",
          },
        },
      },
      request: {
        Company_Assign_Teacher: {
          type: "object",
          properties: {
            _id: { type: "string", description: "Company ID" },
            teacher: { type: "string", description: "Teacher ID" },
          },
          example: {
            _id: "6466267369d59e70e2329e47",
            teacher: "646741ccceeaeeab0df71181",
          },
        },
        Subscribe: {
          type: "object",
          properties: {
            studentId: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
          },
          example: {
            studentId: "645e18580644c3aa854ae94b",
            name: "student studentson",
            email: "student@email.com",
            phone: "+37491322222",
          },
        },
        Delete_Subscribtion: {
          type: "object",
          properties: {
            courseId: { type: "string", description: "Course ID" },
          },
          example: {
            courseId: "645e25660a4082efcf5a49da",
          },
        },
        Approve_Pending: {
          type: "object",
          properties: {
            _id: { type: "string", description: "Pending ID" },
          },
          example: {
            _id: "64621f9c55e10e506d9bee9b",
          },
        },
        Refresh_Token: {
          type: "object",
          properties: {
            refreshToken: { type: "string" },
          },
          example: {
            refreshToken:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDY0ZjI5ZGJjZDIwNmE3ODVhMThlZWQiLCJpYXQiOjE2ODQ4MjUyMzIsImV4cCI6MTY4NzQxNzIzMn0.jk16kT8k1c-8YXZqGODb8futa4ARR8QTNFtrJ9LDyac",
          },
        },
        Logout: {
          type: "object",
          properties: {
            refreshToken: { type: "string" },
          },
          example: {
            refreshToken:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDY0ZjI5ZGJjZDIwNmE3ODVhMThlZWQiLCJpYXQiOjE2ODQ4MjUyMzIsImV4cCI6MTY4NzQxNzIzMn0.jk16kT8k1c-8YXZqGODb8futa4ARR8QTNFtrJ9LDyac",
          },
        },
      },
      schemas: {
        Student: {
          type: "object",
          properties: {
            type: { type: "string", description: "default: student" },
            isIndividual: { type: "boolean" }, // default: true??
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            role: {
              type: "object",
              properties: {
                user: { type: "boolean", description: "default: true" },
                admin: { type: "boolean", description: "default: false" },
              },
            },
            avatar: { type: "string" },
            phone: { type: "string" },
            address: { type: "string" },
            age: { type: "string" },
            languages: { type: "array" },
            stage: {
              type: "string",
              description: "stage ID",
            },
          },
        },
        Teacher: {
          type: "object",
          properties: {
            type: { type: "string", description: "default: teacher" },
            isIndividual: { type: "boolean", description: "default: true" },
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            role: {
              type: "object",
              properties: {
                user: { type: "boolean", description: "default: true" },
                admin: { type: "boolean", description: "default: false" },
              },
            },
            personalInfo: {
              type: "object",
              properties: {
                phone: { type: "string" },
                address: { type: "string" },
                avatar: { type: "string" },
                age: { type: "string" },
                about: { type: "string" },
                languages: { type: "array" },
              },
            },
            courses: {
              type: "string",
              description:
                "Array that contains course IDs created by the teacher",
            },
            stage: { type: "string" },
          },
        },
        Company: {
          type: "object",
          properties: {
            type: { type: "string" },
            companyName: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            companyInfo: {
              type: "object",
              properties: {
                phone: { type: "string" },
                address: { type: "string" },
                description: { type: "string" },
                avatar: { type: "string" },
              },
            },
            director: {
              type: "object",
              properties: {
                name: { type: "string" },
                phone: { type: "string" },
                address: { type: "string" },
              },
            },
            admin: { type: "string", description: "Admin ID" },
            students: {
              type: "string",
              description: "Array that contains Student IDs",
            },
            teachers: {
              type: "string",
              description: "Array that contains Teacher IDs",
            },
            courses: {
              type: "string",
              description: "Array that contains Course IDs",
            },
          },
        },
        Company_Teacher: {
          type: "object",
          properties: {
            type: { type: "string" },
            isIndividual: { type: "boolean" },
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            role: {
              type: "object",
              properties: {
                user: { type: "string" },
                admin: { type: "string" },
              },
            },
            avatar: { type: "string" },
            phone: { type: "string" },
            age: { type: "number" },
            languages: { type: "array" },
            company: {
              type: "string",
              description: "Company ID that belongs to",
            },
            courses: {
              type: "string",
              description: "Course ID assigned by the company",
            },
            stage: { type: "string" },
          },
        },
        Course: {
          type: "object",
          require: [
            "pending",
            "title",
            "category",
            "stage",
            "description",
            "ageLimit",
            "finalExam",
            "certificate",
            "price",
          ],
          properties: {
            pending: { type: "boolean" },
            title: { type: "string" },
            image: { type: "string" },
            category: {
              type: "string",
              description: "Id of the category that belongs to",
            },
            stage: {
              type: "string",
              description: "Id of the stage that belongs to",
            },
            description: { type: "string" },
            ageLimit: {
              min: { type: "number" },
              max: { type: "number" },
            },
            finalExam: { type: "boolean" },
            certificate: { type: "boolean" },
            price: { type: "number" },
            phases: [
              {
                type: "string",
                description: "Id of phases that belong to this course",
              },
            ],
            teacher: {
              type: "string",
              description: "Id of the teacher that created",
            },
            company: {
              type: "string",
              description: "Id of the company that created",
            },
            rating: [
              {
                rater: {
                  type: "string",
                  description: "Id of the user that belongs rated",
                },
                rate: { type: "number" },
                description: "Not developed yet",
              },
            ],
            comments: [
              {
                user: {
                  type: "string",
                  description: "Id of the user that commneted",
                },
                comment: { type: "string" },
                description: "Not developed yet",
              },
            ],
          },
        },
        Phase: {
          type: "object",
          require: ["phaseTitle", "course"],
          properties: {
            phaseTitle: { type: "string" },
            lesson: [
              {
                type: "string",
                description: "Id of the lessons that belong to this phase",
              },
            ],
            finalExam: {
              type: "string",
              description: "Id of the exam that belongs to this phase",
            },
            course: { type: "string" },
          },
        },
        Lesson: {
          type: "object",
          require: [
            "lessonTitle",
            "lessonTiming",
            "lessonStatus",
            "phase",
            "course",
          ],
          properties: {
            lessonTitle: { type: "string" },
            lessonTiming: { type: "number" },
            lessonLink: { type: "string" },
            lessonDescription: { type: "string" },
            additional: { type: "string" },
            lessonStatus: { type: "boolean" },
            homework: {
              type: "string",
              description: "Id of the homework that belongs to this lesson",
            },
            finalExam: {
              type: "string",
              description: "Id of the exam that belongs to this lesson",
            },
            phase: {
              type: "string",
              description: "Id of the phase that belongs to",
            },
            course: {
              type: "string",
              description: "Id of the course that belongs to",
            },
          },
        },
        Homework: {
          type: "object",
          require: [
            "homeWorkDescription",
            "homeWorkStatus",
            "lesson",
            "phase",
            "course",
          ],
          properties: {
            homeWorkVideo: { type: "string" },
            homeWorkDescription: { type: "string" },
            additional: { type: "string" },
            homeWorkStatus: { type: "boolean" },
            lesson: {
              type: "string",
              description: "Id of the lesson that belongs to",
            },
            phase: {
              type: "string",
              description: "Id of the phase that belongs to",
            },
            course: {
              type: "string",
              description: "Id of the course that belongs to",
            },
          },
        },
        Exam: {
          type: "object",
          require: [
            "examTitle",
            "examDescription",
            "examPassingValue",
            "examPassingTime",
            "question",
            "examStatus",
            "phase",
          ],
          properties: {
            examTitle: { type: "string" },
            examDescription: { type: "string" },
            examPassingValue: { type: "number" },
            examPassingTime: { type: "number" },
            additional: { type: "string" },
            examQuestion: [
              {
                question: { type: "string" },
                answers: { type: "array" },
              },
            ],
            examStatus: { type: "boolean" },
            phase: {
              type: "string",
              description: "Id of the phase that belongs to",
            },
          },
        },
        Pending: {
          type: "object",
          require: [
            "pending",
            "studentId",
            "name",
            "email",
            "phone",
            "courseId",
          ],
          properties: {
            pending: { type: "boolean" },
            studentId: { type: "string", description: "ID of student" },
            name: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            courseId: { type: "string", description: "ID of course" },
          },
        },
        Subscribe: {
          type: "object",
          properties: {
            pending: { type: "boolean", description: "default: false" },
            studentId: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            courseId: { type: "string" },
            subscribedAt: { type: "date", description: "auto-generated" },
          },
        },
        Refresh_Token: {
          type: "object",
          properties: {
            userId: { type: "string" },
            token: { type: "string" },
            createdAt: {
              type: "date",
              description: "default: Date.now, expires: 30 * 86400 // 30 days",
            },
          },
        },
        // securitySchemes: {
        //   ApiKeyAuth: {
        //     type: "apiKey",
        //     in: "header",
        //     name: "Authorization",
        //   },
        // },
      },
    },
    // security: [
    //   {
    //     ApiKeyAuth: [],
    //   },
    // ],
  },
  apis: ["./Route/*/*.js"],
};

export const specs = swaggerJSDoc(options);
