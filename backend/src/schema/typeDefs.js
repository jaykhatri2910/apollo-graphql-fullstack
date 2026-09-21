const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Employee {
    id: ID!
    name: String!
    age: Int!
    class: String!
    subjects: [String]!
    attendance: Int!
    role: String!
    email: String!
    avatar: String
    date: String
  }

  type AuthPayload {
    token: String!
    user: Employee!
  }

  type EmployeePage {
    employees: [Employee]!
    totalCount: Int!
    totalPages: Int!
  }

  input EmployeeFilter {
    name: String
    minAge: Int
    maxAge: Int
    role: String
    attendanceMin: Int
    attendanceMax: Int
  }

  input EmployeeSort {
    field: String!
    order: String! # "asc" or "desc"
  }

  type Query {
    employees(
      page: Int
      pageSize: Int
      filter: EmployeeFilter
      sortBy: EmployeeSort
    ): EmployeePage!
    employee(id: ID!): Employee
    me: Employee
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    addEmployee(
      name: String!
      age: Int!
      class: String!
      subjects: [String]!
      attendance: Int!
      role: String
      email: String!
      password: String!
      avatar: String
    ): Employee!
    updateEmployee(
      id: ID!
      name: String
      age: Int
      class: String
      subjects: [String]
      attendance: Int
      role: String
      email: String
      avatar: String
    ): Employee!
    deleteEmployee(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;
